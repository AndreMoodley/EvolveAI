import { z } from 'zod';

// Shared Zod schemas — used on both client (validation) and server (parsing)
// Import from this file in both /util and server/src to avoid duplication

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupSchema = LoginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
});

export const LogSessionSchema = z.object({
  modality: z.enum(['origin', 'pull', 'push', 'core', 'cardio', 'recovery']),
  description: z.string().min(1, 'Description required').max(300),
  reps: z.number().int().min(0),
  rating: z.number().int().min(1).max(10),
  note: z.string().max(500).optional(),
  occurredOn: z.string().datetime().optional(),
});

export const CreateVowSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['major', 'minor']),
  vowSubtype: z.enum(['standard', 'heavenly_restriction']).default('standard'),
  startDate: z.string().datetime(),
  resolutionDate: z.string().datetime(),
  wagerAmount: z.number().min(5).max(100).optional(),
});

export const KiLeakSchema = z.object({
  category: z.enum(['social', 'food', 'media', 'argument', 'validation', 'doubt']),
  label: z.string().min(1).max(100),
  cost: z.number().int().min(1).max(100),
});

export const StrikeSchema = z.object({
  amount: z.number().int().min(1).max(10000),
});

export const SealKiSchema = z.object({
  amount: z.number().int().min(1).max(100).optional(),
});

export const SummonSchema = z.object({
  scrollType: z.enum(['lesser', 'abyssal']),
});

export const WagerSchema = z.object({
  crystalAmount: z.number().int().min(50).max(2000),
  weekTarget: z.object({
    anchorDays: z.number().int().min(1).max(7).optional(),
    sessionCount: z.number().int().min(1).max(7).optional(),
  }),
});
