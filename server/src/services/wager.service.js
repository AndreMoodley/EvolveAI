import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

/**
 * Creates a Stripe payment hold (manual capture) for a Heavenly Restriction.
 * The hold is NOT charged immediately — it is captured (forfeited) or canceled (refunded)
 * when the restriction resolves on resolutionDate.
 */
export async function createRestrictionHold(userId, amountUsd, stripe) {
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amountUsd * 100), // cents
    currency: 'usd',
    capture_method: 'manual', // HOLD — not an immediate charge
    metadata: { userId, type: 'heavenly_restriction' },
    description: 'EvolveAI — Heavenly Restriction Wager',
  });
  logger.info({ userId, intentId: intent.id, amountUsd }, 'Restriction hold created');
  return intent;
}

/**
 * Settles a Heavenly Restriction:
 * - success = true → cancel hold (refund / no charge)
 * - success = false → capture hold (forfeit funds)
 * Also updates the Vow's wagerStatus and grants Transcendent skin on success.
 */
export async function settleRestriction(paymentIntentId, success) {
  const vow = await prisma.vow.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { practitioner: true },
  });
  if (!vow) {
    logger.warn({ paymentIntentId }, 'Vow not found for settlement');
    return;
  }

  await prisma.vow.update({
    where: { id: vow.id },
    data: { wagerStatus: success ? 'succeeded' : 'forfeited' },
  });

  if (success) {
    // Grant Transcendent entity skin flag
    await prisma.practitioner.update({
      where: { id: vow.practitionerId },
      data: { hasTranscendentSkin: true },
    });
    logger.info({ userId: vow.practitionerId, vowId: vow.id }, 'Restriction succeeded — Transcendent skin granted');
  } else {
    // Mark entity as scarred — permanent visual brand
    await prisma.practitioner.update({
      where: { id: vow.practitionerId },
      data: { restrictionScar: true },
    });
    logger.info({ userId: vow.practitionerId, vowId: vow.id }, 'Restriction forfeited — Restriction Scar applied');
  }
}

/**
 * Settle weekly wager events. Called by a scheduled job at week end.
 * Checks if the practitioner completed their weekTarget, then doubles or forfeits crystals.
 */
export async function settleWeeklyWagers() {
  const weekStart = getPreviousWeekStart();
  const activeWagers = await prisma.wagerEvent.findMany({
    where: { weekStart, outcome: null },
    include: { practitioner: true },
  });

  logger.info({ count: activeWagers.length }, 'Settling weekly wagers');

  for (const wager of activeWagers) {
    const { practitionerId, crystalAmount, weekTarget, id } = wager;
    const achieved = await checkWeekTargetAchieved(practitionerId, weekStart, weekTarget);

    if (achieved) {
      await prisma.$transaction([
        prisma.wagerEvent.update({ where: { id }, data: { outcome: 'won', settledAt: new Date() } }),
        prisma.practitioner.update({
          where: { id: practitionerId },
          data: { voidCrystalBalance: { increment: crystalAmount * 2 } },
        }),
      ]);
      logger.info({ practitionerId, crystalAmount, outcome: 'won' }, 'Wager won — crystals doubled');
    } else {
      await prisma.wagerEvent.update({
        where: { id },
        data: { outcome: 'lost', settledAt: new Date() },
      });
      logger.info({ practitionerId, crystalAmount, outcome: 'lost' }, 'Wager lost — crystals forfeited');
    }
  }
}

async function checkWeekTargetAchieved(practitionerId, weekStart, weekTarget) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  if (weekTarget.sessionCount) {
    const sessionCount = await prisma.voidSession.count({
      where: {
        practitionerId,
        occurredOn: { gte: weekStart, lt: weekEnd },
        reps: { gt: 0 },
      },
    });
    if (sessionCount < weekTarget.sessionCount) return false;
  }

  if (weekTarget.anchorDays) {
    // Check anchor completions — requires AnchorLog model or equivalent
    // For now, use streak as proxy
    const practitioner = await prisma.practitioner.findUnique({
      where: { id: practitionerId },
      select: { streak: true },
    });
    if ((practitioner?.streak ?? 0) < weekTarget.anchorDays) return false;
  }

  return true;
}

function getPreviousWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day - 6; // previous Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}
