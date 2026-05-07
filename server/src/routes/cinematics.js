import { Router } from 'express';
import { z } from 'zod';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REMOTION_ROOT = path.resolve(__dirname, '../../../remotion');
const RENDERS_DIR = path.resolve(__dirname, '../../renders');

fs.mkdirSync(RENDERS_DIR, { recursive: true });

const KNOWN_COMPOSITIONS = new Set([
  'RealmAscension',
  'StrikeBurst',
  'DailyRecap',
  'VowDeclaration',
  'VoidEntityShowcase',
  'StreakMilestone',
]);

const renderSchema = z.object({
  compositionId: z.string().refine((id) => KNOWN_COMPOSITIONS.has(id), {
    message: 'Unknown composition',
  }),
  inputProps: z.record(z.unknown()).optional().default({}),
});

let cachedBundleUrl = null;
let cachedBundlePromise = null;

async function getBundleUrl() {
  if (cachedBundleUrl) return cachedBundleUrl;
  if (cachedBundlePromise) return cachedBundlePromise;
  cachedBundlePromise = (async () => {
    const { bundle } = await import('@remotion/bundler');
    const url = await bundle({
      entryPoint: path.join(REMOTION_ROOT, 'index.js'),
    });
    cachedBundleUrl = url;
    return url;
  })();
  return cachedBundlePromise;
}

const router = Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = renderSchema.parse(req.body);
    const { compositionId, inputProps } = parsed;

    const { selectComposition, renderMedia } = await import('@remotion/renderer');
    const serveUrl = await getBundleUrl();

    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps,
    });

    const filename = `${compositionId}-${req.userId}-${Date.now()}.mp4`;
    const outPath = path.join(RENDERS_DIR, filename);

    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      inputProps,
    });

    res.json({
      compositionId,
      url: `/cinematics/file/${filename}`,
      width: composition.width,
      height: composition.height,
      durationInFrames: composition.durationInFrames,
      fps: composition.fps,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/file/:filename', (req, res, next) => {
  const safe = path.basename(req.params.filename);
  const file = path.join(RENDERS_DIR, safe);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  res.sendFile(file);
});

router.get('/compositions', requireAuth, (_req, res) => {
  res.json({
    compositions: [
      { id: 'RealmAscension', label: 'Realm Ascension', description: 'Cinematic when crossing realm thresholds' },
      { id: 'StrikeBurst', label: 'Strike Burst', description: 'Shareable strike celebration' },
      { id: 'DailyRecap', label: 'Daily Recap', description: 'Vertical end-of-day summary (9:16)' },
      { id: 'VowDeclaration', label: 'Vow Declaration', description: 'Sacred vow ceremony' },
      { id: 'VoidEntityShowcase', label: 'Void Entity Showcase', description: 'Hero loop of the entity' },
      { id: 'StreakMilestone', label: 'Streak Milestone', description: 'Streak celebration (7/30/100/365)' },
    ],
  });
});

export default router;
