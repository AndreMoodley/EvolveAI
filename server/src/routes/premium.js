import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { premiumLimiter } from '../middleware/rateLimiter.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { SummonSchema, WagerSchema } from '../config/schemas.js';
import { performSummon } from '../services/summon.service.js';
import { createRestrictionHold, settleRestriction } from '../services/wager.service.js';
import { getStripe } from '../lib/stripe.js';

const router = Router();

// GET /premium/inventory — unlocked bloodlines, domains, familiars, crystal balance
router.get('/inventory', requireAuth, async (req, res, next) => {
  try {
    const practitioner = await prisma.practitioner.findUnique({
      where: { id: req.userId },
      select: {
        voidCrystalBalance: true,
        activeBloodlineId: true,
        activeDomainPackId: true,
        activeFamiliarId: true,
        restrictionScar: true,
        corruptedAt: true,
        bloodlines: { include: { bloodline: true } },
        domains: { include: { domainPack: true } },
        familiars: { include: { familiar: true } },
      },
    });

    if (!practitioner) throw new NotFoundError('Practitioner');

    res.json({
      voidCrystalBalance: practitioner.voidCrystalBalance,
      activeBloodlineId: practitioner.activeBloodlineId,
      activeDomainPackId: practitioner.activeDomainPackId,
      activeFamiliarId: practitioner.activeFamiliarId,
      restrictionScar: practitioner.restrictionScar,
      isCorrupted: !!practitioner.corruptedAt,
      corruptedAt: practitioner.corruptedAt,
      bloodlines: practitioner.bloodlines.map((pb) => pb.bloodline),
      domains: practitioner.domains.map((pd) => pd.domainPack),
      familiars: practitioner.familiars.map((pf) => pf.familiar),
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /premium/inventory — set active bloodline / domain / familiar
router.patch('/inventory', requireAuth, async (req, res, next) => {
  try {
    const { activeBloodlineId, activeDomainPackId, activeFamiliarId } = req.body;
    const updated = await prisma.practitioner.update({
      where: { id: req.userId },
      data: {
        ...(activeBloodlineId !== undefined && { activeBloodlineId }),
        ...(activeDomainPackId !== undefined && { activeDomainPackId }),
        ...(activeFamiliarId !== undefined && { activeFamiliarId }),
      },
      select: { activeBloodlineId: true, activeDomainPackId: true, activeFamiliarId: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /premium/summon — server-side gacha pull
router.post('/summon', requireAuth, premiumLimiter, async (req, res, next) => {
  try {
    const { scrollType } = SummonSchema.parse(req.body);
    const result = await performSummon(req.userId, scrollType);
    logger.info({ userId: req.userId, scrollType, familiarId: result.familiar.id }, 'Familiar summoned');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /premium/summon/history — pull history for pity counter display
router.get('/summon/history', requireAuth, async (req, res, next) => {
  try {
    const history = await prisma.familiarSummon.findMany({
      where: { practitionerId: req.userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: { familiar: true },
    });
    res.json(history);
  } catch (err) {
    next(err);
  }
});

// POST /premium/wager — open a Void Crystal wager for the week
router.post('/wager', requireAuth, premiumLimiter, async (req, res, next) => {
  try {
    const { crystalAmount, weekTarget } = WagerSchema.parse(req.body);

    const practitioner = await prisma.practitioner.findUnique({
      where: { id: req.userId },
      select: { voidCrystalBalance: true },
    });
    if (!practitioner) throw new NotFoundError('Practitioner');
    if (practitioner.voidCrystalBalance < crystalAmount) {
      throw new AppError('Insufficient Void Crystals', 400, 'INSUFFICIENT_CRYSTALS');
    }

    // Check no active wager this week
    const weekStart = getWeekStart();
    const existing = await prisma.wagerEvent.findFirst({
      where: { practitionerId: req.userId, weekStart, outcome: null },
    });
    if (existing) throw new AppError('A wager is already active for this week', 409, 'WAGER_EXISTS');

    const [wager] = await prisma.$transaction([
      prisma.wagerEvent.create({
        data: { practitionerId: req.userId, crystalAmount, weekStart, weekTarget },
      }),
      prisma.practitioner.update({
        where: { id: req.userId },
        data: { voidCrystalBalance: { decrement: crystalAmount } },
      }),
    ]);

    res.status(201).json(wager);
  } catch (err) {
    next(err);
  }
});

// GET /premium/wagers — wager history
router.get('/wagers', requireAuth, async (req, res, next) => {
  try {
    const wagers = await prisma.wagerEvent.findMany({
      where: { practitionerId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 52,
    });
    res.json(wagers);
  } catch (err) {
    next(err);
  }
});

// POST /premium/restriction — create a Heavenly Restriction (Soul Escrow) vow
router.post('/restriction', requireAuth, premiumLimiter, async (req, res, next) => {
  try {
    const { title, description, resolutionDate, wagerAmount } = req.body;
    if (!title || !resolutionDate || !wagerAmount) {
      throw new ValidationError('title, resolutionDate, and wagerAmount are required');
    }

    const stripe = getStripe();
    const paymentIntent = await createRestrictionHold(req.userId, wagerAmount, stripe);

    const vow = await prisma.vow.create({
      data: {
        practitionerId: req.userId,
        title,
        description: description ?? '',
        type: 'major',
        vowSubtype: 'heavenly_restriction',
        startDate: new Date(),
        resolutionDate: new Date(resolutionDate),
        wagerAmount,
        wagerStatus: 'pending',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    logger.info({ userId: req.userId, vowId: vow.id, wagerAmount }, 'Heavenly Restriction created');
    res.status(201).json({ vow, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
});

// POST /premium/webhook/stripe — settle Soul Escrow holds on resolutionDate
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new AppError('Stripe webhook secret not configured', 500);

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.captured') {
      const intent = event.data.object;
      await settleRestriction(intent.id, false); // forfeited
    }
    if (event.type === 'payment_intent.canceled') {
      const intent = event.data.object;
      await settleRestriction(intent.id, true); // succeeded
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err }, 'Stripe webhook error');
    res.status(400).json({ error: err.message });
  }
});

// POST /premium/webhook/revenuecat — handle IAP entitlement events
router.post('/webhook/revenuecat', async (req, res, next) => {
  try {
    const { event } = req.body;
    if (!event) return res.json({ received: true });

    const { type, app_user_id, product_id } = event;
    logger.info({ type, app_user_id, product_id }, 'RevenueCat webhook received');

    // Map product_id to domain/bloodline/familiar and unlock for user
    // Full mapping done in revenuecat.service.js when implemented
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default router;
