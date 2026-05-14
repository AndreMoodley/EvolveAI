import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional().or(z.literal('')),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional().or(z.literal('')),
  STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal('')),
  REVENUECAT_SECRET: z.string().optional().or(z.literal('')),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

let env;

try {
  env = envSchema.parse(process.env);
} catch (err) {
  console.error('❌ Invalid environment configuration:');
  err.errors?.forEach((e) => console.error(`  ${e.path.join('.')}: ${e.message}`));
  process.exit(1);
}

export { env };
