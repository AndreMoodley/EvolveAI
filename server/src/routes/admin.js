import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

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

export default router;
