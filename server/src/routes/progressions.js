import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(requireAuth);

const progressionSchema = z.object({
  text: z.string().min(1).max(500),
  completed: z.boolean().optional(),
});

async function ensureVow(req, res) {
  const vow = await prisma.vow.findFirst({
    where: { id: req.params.vowId, practitionerId: req.userId },
  });
  if (!vow) {
    res.status(404).json({ error: 'Vow not found' });
    return null;
  }
  return vow;
}

router.get('/', async (req, res) => {
  const vow = await ensureVow(req, res);
  if (!vow) return;
  const progressions = await prisma.progression.findMany({
    where: { vowId: vow.id },
    orderBy: { orderIndex: 'asc' },
  });
  res.json(progressions);
});

router.post('/', async (req, res) => {
  const vow = await ensureVow(req, res);
  if (!vow) return;
  const parsed = progressionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const last = await prisma.progression.findFirst({
    where: { vowId: vow.id },
    orderBy: { orderIndex: 'desc' },
  });
  const orderIndex = last ? last.orderIndex + 1 : 0;
  const created = await prisma.progression.create({
    data: { vowId: vow.id, text: parsed.data.text, orderIndex },
  });
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const vow = await ensureVow(req, res);
  if (!vow) return;
  const parsed = progressionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.progression.findFirst({
    where: { id: req.params.id, vowId: vow.id },
  });
  if (!existing) return res.status(404).json({ error: 'Progression not found' });
  const completed = parsed.data.completed;
  const updated = await prisma.progression.update({
    where: { id: existing.id },
    data: {
      ...(parsed.data.text != null ? { text: parsed.data.text } : {}),
      ...(completed != null
        ? { completed, completedAt: completed ? new Date() : null }
        : {}),
    },
  });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const vow = await ensureVow(req, res);
  if (!vow) return;
  const existing = await prisma.progression.findFirst({
    where: { id: req.params.id, vowId: vow.id },
  });
  if (!existing) return res.status(404).json({ error: 'Progression not found' });
  await prisma.progression.delete({ where: { id: existing.id } });
  res.status(204).end();
});

export default router;
