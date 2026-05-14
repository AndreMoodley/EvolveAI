import rateLimit from 'express-rate-limit';

// Global limit — 200 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

// Auth endpoints — 10 attempts per 15 minutes (brute force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
  skipSuccessfulRequests: true,
});

// Premium / gacha endpoints — 20 per minute to prevent scroll farming
export const premiumLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down, practitioner. The Void does not rush.' },
});

// Strike logging — 60 per minute max (avoid hammer count gaming)
export const strikeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Strike rate exceeded. Honor your training cadence.' },
});
