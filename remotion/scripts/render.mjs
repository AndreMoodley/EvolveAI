#!/usr/bin/env node
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const compositionId = args[0];
const propsArg = args[1];
const outArg = args[2];

if (!compositionId) {
  console.error(`
Usage: node scripts/render.mjs <compositionId> [propsJson] [outPath]

Examples:
  node scripts/render.mjs StrikeBurst
  node scripts/render.mjs RealmAscension '{"fromRealm":4,"toRealm":5,"hammerCount":18000}'
  node scripts/render.mjs DailyRecap '{...}' out/recap-2026-05-07.mp4

Compositions:
  - RealmAscension       (1920x1080, ~6s)  realm threshold cinematic
  - StrikeBurst          (1080x1080, 2.5s) shareable strike celebration
  - DailyRecap           (1080x1920, 7s)   vertical daily summary
  - VowDeclaration       (1080x1920, 7s)   sacred vow ceremony
  - VoidEntityShowcase   (1080x1080, 10s)  parameterized hero loop
  - StreakMilestone      (1080x1080, 4s)   streak celebration
`);
  process.exit(1);
}

const inputProps = propsArg ? JSON.parse(propsArg) : {};
const outPath = outArg
  ? path.resolve(ROOT, outArg)
  : path.resolve(ROOT, `out/${compositionId}-${Date.now()}.mp4`);

fs.mkdirSync(path.dirname(outPath), { recursive: true });

console.log(`▸ Bundling…`);
const serveUrl = await bundle({
  entryPoint: path.join(ROOT, 'index.js'),
  webpackOverride: (c) => c,
});

console.log(`▸ Selecting composition: ${compositionId}`);
const composition = await selectComposition({
  serveUrl,
  id: compositionId,
  inputProps,
});

console.log(`▸ Rendering ${composition.width}x${composition.height} @ ${composition.fps}fps for ${composition.durationInFrames} frames`);
console.log(`▸ Output: ${outPath}`);

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: outPath,
  inputProps,
  onProgress: ({ progress }) => {
    process.stdout.write(`\r  ${Math.round(progress * 100)}%`);
  },
});

console.log(`\n✓ Done: ${outPath}`);
