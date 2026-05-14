import './config/env.js'; // validates env vars at startup — exits if invalid
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { httpLogger, logger } from './lib/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import vowRoutes from './routes/vows.js';
import progressionRoutes from './routes/progressions.js';
import sessionRoutes from './routes/sessions.js';
import practitionerRoutes from './routes/practitioner.js';
import cinematicsRoutes from './routes/cinematics.js';
import adminRoutes from './routes/admin.js';
import premiumRoutes from './routes/premium.js';

const app = express();

// Security headers
app.use(helmet());

// CORS — explicit origins in production
const allowedOrigins =
  env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN || '').split(',').filter(Boolean)
    : '*';
app.use(cors({ origin: allowedOrigins }));

// Gzip compression
app.use(compression());

// Structured HTTP request logging
app.use(httpLogger);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Global rate limiter
app.use(globalLimiter);

// Health check (before rate limiter cascade for load balancers)
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), env: env.NODE_ENV });
});

// Routes
app.use('/auth', authRoutes);
app.use('/vows', vowRoutes);
app.use('/vows/:vowId/progressions', progressionRoutes);
app.use('/sessions', sessionRoutes);
app.use('/practitioner', practitionerRoutes);
app.use('/cinematics', cinematicsRoutes);
app.use('/admin', adminRoutes);
app.use('/premium', premiumRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' });
});

// Central error handler — must be last
app.use(errorHandler);

app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`[evolveai-server] listening on http://0.0.0.0:${env.PORT}`);
});
