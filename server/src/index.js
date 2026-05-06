import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import vowRoutes from './routes/vows.js';
import progressionRoutes from './routes/progressions.js';
import sessionRoutes from './routes/sessions.js';
import practitionerRoutes from './routes/practitioner.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/auth', authRoutes);
app.use('/vows', vowRoutes);
app.use('/vows/:vowId/progressions', progressionRoutes);
app.use('/sessions', sessionRoutes);
app.use('/practitioner', practitionerRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[evolveai-server] listening on http://0.0.0.0:${port}`);
});
