import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const vowSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  type: z.enum(['major', 'minor']),
  startDate: z.string().datetime().optional(),
  resolutionDate: z.string().datetime(),
});

router.get('/', async (req, res) => {
  const vows = await prisma.vow.findMany({
    where: { practitionerId: req.userId },
    orderBy: { resolutionDate: 'asc' },
  });
  res.json(vows);
});

router.post('/', async (req, res) => {
  const parsed = vowSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const vow = await prisma.vow.create({
    data: {
      practitionerId: req.userId,
      title: data.title,
      description: data.description,
      type: data.type,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      resolutionDate: new Date(data.resolutionDate),
    },
  });
  res.status(201).json(vow);
});

router.get('/:id', async (req, res) => {
  const vow = await prisma.vow.findFirst({
    where: { id: req.params.id, practitionerId: req.userId },
    include: { progressions: { orderBy: { orderIndex: 'asc' } } },
  });
  if (!vow) return res.status(404).json({ error: 'Vow not found' });
  res.json(vow);
});

router.put('/:id', async (req, res) => {
  const parsed = vowSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const found = await prisma.vow.findFirst({
    where: { id: req.params.id, practitionerId: req.userId },
  });
  if (!found) return res.status(404).json({ error: 'Vow not found' });
  const data = parsed.data;
  const updated = await prisma.vow.update({
    where: { id: found.id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      resolutionDate: data.resolutionDate ? new Date(data.resolutionDate) : undefined,
    },
  });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const found = await prisma.vow.findFirst({
    where: { id: req.params.id, practitionerId: req.userId },
  });
  if (!found) return res.status(404).json({ error: 'Vow not found' });
  await prisma.vow.delete({ where: { id: found.id } });
  res.status(204).end();
});

export default router;
