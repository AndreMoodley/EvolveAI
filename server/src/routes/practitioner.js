import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const profileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  ki: z.number().int().min(0).max(100).optional(),
  shadowLevel: z.number().int().min(1).max(5).optional(),
});

const strikeSchema = z.object({
  amount: z.number().int().positive().max(10000),
});

const leakSchema = z.object({
  category: z.string().min(1).max(40),
  label: z.string().min(1).max(120),
  cost: z.number().int().min(1).max(100).default(5),
});

router.get('/me', async (req, res) => {
  const user = await prisma.practitioner.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.patch('/me', async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.practitioner.update({
    where: { id: req.userId },
    data: parsed.data,
  });
  const { passwordHash, ...safe } = updated;
  res.json(safe);
});

router.post('/me/strike', async (req, res) => {
  const parsed = strikeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount } = parsed.data;
  const [, user] = await prisma.$transaction([
    prisma.strikeEvent.create({ data: { practitionerId: req.userId, amount } }),
    prisma.practitioner.update({
      where: { id: req.userId },
      data: { hammerCount: { increment: amount }, lastLogDate: new Date() },
    }),
  ]);
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.post('/me/anchor', async (req, res) => {
  const updated = await prisma.practitioner.update({
    where: { id: req.userId },
    data: { anchorCompletedAt: new Date() },
  });
  const { passwordHash, ...safe } = updated;
  res.json(safe);
});

router.get('/me/leaks', async (req, res) => {
  const leaks = await prisma.kiLeak.findMany({
    where: { practitionerId: req.userId },
    orderBy: { occurredAt: 'desc' },
    take: 200,
  });
  res.json(leaks);
});

router.post('/me/leaks', async (req, res) => {
  const parsed = leakSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { category, label, cost } = parsed.data;
  const [leak, user] = await prisma.$transaction([
    prisma.kiLeak.create({
      data: { practitionerId: req.userId, category, label, cost },
    }),
    prisma.practitioner.update({
      where: { id: req.userId },
      data: { ki: { decrement: cost } },
    }),
  ]);
  res.status(201).json({ leak, ki: Math.max(0, user.ki) });
});

router.post('/me/seal', async (req, res) => {
  const amount = Math.min(100, Math.max(1, Number(req.body?.amount) || 10));
  const user = await prisma.practitioner.findUnique({ where: { id: req.userId } });
  const next = Math.min(100, (user?.ki ?? 0) + amount);
  const updated = await prisma.practitioner.update({
    where: { id: req.userId },
    data: { ki: next },
  });
  const { passwordHash, ...safe } = updated;
  res.json(safe);
});

export default router;
