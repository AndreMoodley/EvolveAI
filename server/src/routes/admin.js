import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { settleWeeklyWagers } from '../services/wager.service.js';
import { logger } from '../lib/logger.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const updatePractitionerSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  ki: z.number().int().min(0).max(100).optional(),
  shadowLevel: z.number().int().min(1).max(5).optional(),
  hammerCount: z.number().int().min(0).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

router.get('/stats', async (_req, res) => {
  const [totalUsers, totalSessions, totalVows, strikeSum, kiAvg] = await Promise.all([
    prisma.practitioner.count(),
    prisma.voidSession.count(),
    prisma.vow.count(),
    prisma.strikeEvent.aggregate({ _sum: { amount: true } }),
    prisma.practitioner.aggregate({ _avg: { ki: true } }),
  ]);
  res.json({
    totalUsers,
    totalSessions,
    totalVows,
    totalStrikes: strikeSum._sum.amount ?? 0,
    avgKi: Math.round(kiAvg._avg.ki ?? 0),
  });
});

router.get('/practitioners', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const skip = (page - 1) * limit;

  const [practitioners, total] = await Promise.all([
    prisma.practitioner.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        ki: true,
        shadowLevel: true,
        hammerCount: true,
        streak: true,
        createdAt: true,
        lastLogDate: true,
      },
    }),
    prisma.practitioner.count(),
  ]);

  res.json({ practitioners, total, page, limit, pages: Math.ceil(total / limit) });
});

router.get('/practitioners/:id', async (req, res) => {
  const user = await prisma.practitioner.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      ki: true,
      shadowLevel: true,
      hammerCount: true,
      streak: true,
      createdAt: true,
      lastLogDate: true,
      anchorCompletedAt: true,
      _count: { select: { vows: true, sessions: true, leaks: true, strikes: true } },
    },
  });
  if (!user) return res.status(404).json({ error: 'Practitioner not found' });
  res.json(user);
});

router.patch('/practitioners/:id', async (req, res) => {
  const parsed = updatePractitionerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.practitioner.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      ki: true,
      shadowLevel: true,
      hammerCount: true,
      streak: true,
      createdAt: true,
    },
  });
  res.json(updated);
});

router.delete('/practitioners/:id', async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }
  await prisma.practitioner.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// POST /admin/cron/settle-wagers — trigger weekly wager settlement (call from cron job)
router.post('/cron/settle-wagers', async (req, res, next) => {
  try {
    await settleWeeklyWagers();
    logger.info('Weekly wager settlement triggered via admin cron');
    res.json({ settled: true });
  } catch (err) {
    next(err);
  }
});

// POST /admin/grant-crystals — manual crystal grant for testing / promotions
router.post('/grant-crystals', async (req, res, next) => {
  try {
    const { practitionerId, amount } = req.body;
    if (!practitionerId || !amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'practitionerId and numeric amount required' });
    }
    const updated = await prisma.practitioner.update({
      where: { id: practitionerId },
      data: { voidCrystalBalance: { increment: amount } },
      select: { id: true, voidCrystalBalance: true },
    });
    logger.info({ practitionerId, amount }, 'Crystals granted via admin');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
