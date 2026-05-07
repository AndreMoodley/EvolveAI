import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const sessionSchema = z.object({
  modality: z.enum(['origin', 'pull', 'push', 'core', 'cardio', 'recovery']),
  description: z.string().min(1).max(500),
  reps: z.number().int().nonnegative().default(0),
  rating: z.number().int().min(1).max(10).default(7),
  note: z.string().max(2000).optional(),
  occurredOn: z.string().datetime().optional(),
});

router.get('/', async (req, res) => {
  const sessions = await prisma.voidSession.findMany({
    where: { practitionerId: req.userId },
    orderBy: { occurredOn: 'desc' },
    take: 200,
  });
  res.json(sessions);
});

router.post('/', async (req, res) => {
  const parsed = sessionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const session = await prisma.voidSession.create({
    data: {
      practitionerId: req.userId,
      modality: data.modality,
      description: data.description,
      reps: data.reps ?? 0,
      rating: data.rating ?? 7,
      note: data.note,
      occurredOn: data.occurredOn ? new Date(data.occurredOn) : new Date(),
    },
  });
  if (session.reps > 0) {
    await prisma.$transaction([
      prisma.strikeEvent.create({
        data: { practitionerId: req.userId, amount: session.reps },
      }),
      prisma.practitioner.update({
        where: { id: req.userId },
        data: { hammerCount: { increment: session.reps }, lastLogDate: new Date() },
      }),
    ]);
  }
  res.status(201).json(session);
});

router.delete('/:id', async (req, res) => {
  const existing = await prisma.voidSession.findFirst({
    where: { id: req.params.id, practitionerId: req.userId },
  });
  if (!existing) return res.status(404).json({ error: 'Session not found' });
  await prisma.voidSession.delete({ where: { id: existing.id } });
  res.status(204).end();
});

export default router;
