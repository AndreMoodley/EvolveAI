import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
});

router.post('/signup', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials shape' });
  const { email, password } = parsed.data;
  const existing = await prisma.practitioner.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already inscribed' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.practitioner.create({
    data: { email, passwordHash },
  });
  const token = signToken(user.id, user.role);
  res.status(201).json({ token, userId: user.id, email: user.email, name: user.name, role: user.role });
});

router.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials shape' });
  const { email, password } = parsed.data;
  const user = await prisma.practitioner.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user.id, user.role);
  res.json({ token, userId: user.id, email: user.email, name: user.name, role: user.role });
});

router.post('/refresh', requireAuth, async (req, res) => {
  const user = await prisma.practitioner.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const token = signToken(req.userId, user.role);
  res.json({ token, userId: req.userId, role: user.role });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.practitioner.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

export default router;
