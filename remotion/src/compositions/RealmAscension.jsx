import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { VoidEntity } from '../primitives/VoidEntity';
import { REALM_PALETTES, AURA_COLORS, PALETTE, TYPO } from '../theme';

export const realmAscensionSchema = {
  fromRealm: 4,
  toRealm: 5,
  hammerCount: 18000,
  practitionerName: 'Practitioner',
  auraKey: 'crimson',
};

export const RealmAscension = ({
  fromRealm = 4,
  toRealm = 5,
  hammerCount = 18000,
  practitionerName = 'Practitioner',
  auraKey = 'crimson',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const fromPalette = REALM_PALETTES[fromRealm] ?? REALM_PALETTES[1];
  const toPalette = REALM_PALETTES[toRealm] ?? REALM_PALETTES[7];
  const auraColor = AURA_COLORS[auraKey] ?? AURA_COLORS.ki;

  const phase1End = Math.floor(fps * 1.5);
  const phase2End = Math.floor(fps * 3.5);
  const phase3End = Math.floor(fps * 5.5);

  const bgMix = interpolate(frame, [phase1End, phase2End], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bgPrimary = mix(fromPalette.primary, toPalette.primary, bgMix);
  const bgSecondary = mix(fromPalette.secondary, toPalette.secondary, bgMix);

  const flashOp = interpolate(frame, [phase2End - 6, phase2End, phase2End + 12], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const entityScale = spring({ frame: frame - phase1End, fps, config: { damping: 12, mass: 0.8 } }) * 0.5 + 1.4;
  const entityShake = frame > phase2End - fps * 0.4 && frame < phase2End ? Math.sin(frame * 4) * 4 : 0;

  const fromTitleOp = interpolate(frame, [0, fps * 0.4, phase1End, phase1End + fps * 0.3], [0, 1, 1, 0]);
  const toTitleOp = interpolate(frame, [phase2End, phase2End + fps * 0.4, phase3End - fps * 0.5, phase3End], [0, 1, 1, 0.6]);
  const toTitleY = spring({ frame: frame - phase2End, fps, config: { damping: 14 } });

  const subtitleOp = interpolate(frame, [phase2End + fps * 0.6, phase2End + fps * 1.2, phase3End - fps * 0.5, phase3End], [0, 1, 1, 0.4]);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${bgPrimary} 0%, ${bgSecondary} 60%, ${PALETTE.obsidian} 100%)`, overflow: 'hidden' }}>
      <Vignette />
      <Stars frame={frame} count={60} />

      <Sequence from={0} durationInFrames={phase1End + 10}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: fromTitleOp, textAlign: 'center' }}>
            <div style={{ ...TYPO.label, color: PALETTE.textSecondary, fontSize: 18, marginBottom: 18 }}>
              CROSSING THE THRESHOLD
            </div>
            <div style={{ ...TYPO.title, color: PALETTE.textPrimary, fontSize: 48, opacity: 0.6 }}>
              {fromPalette.name}
            </div>
            <div style={{ ...TYPO.mono, color: fromPalette.accent, marginTop: 12, fontSize: 22 }}>
              {hammerCount.toLocaleString()} STRIKES
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          transform: `translateX(${entityShake}px) scale(${entityScale})`,
          filter: frame > phase2End ? `drop-shadow(0 0 60px ${auraColor})` : 'none',
        }}>
          <VoidEntity realmLevel={frame < phase2End ? fromRealm : toRealm} ki={100} shadowLevel={3} streak={30} auraColor={auraColor} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{
        background: `radial-gradient(circle at center, ${auraColor} 0%, transparent 60%)`,
        opacity: flashOp,
      }} />

      <Sequence from={phase2End - 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: height * 0.12 }}>
          <div style={{
            opacity: toTitleOp,
            transform: `translateY(${(1 - toTitleY) * 30}px)`,
            textAlign: 'center',
          }}>
            <div style={{
              ...TYPO.display,
              color: toPalette.accent,
              fontSize: 200,
              textShadow: `0 0 80px ${toPalette.accent}`,
              fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
            }}>
              {toPalette.glyph}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: height * 0.12 }}>
        <div style={{ opacity: subtitleOp, textAlign: 'center' }}>
          <div style={{ ...TYPO.label, color: toPalette.accent, fontSize: 16, marginBottom: 14 }}>
            REALM {toRealm} ATTAINED
          </div>
          <div style={{ ...TYPO.display, color: PALETTE.textPrimary, fontSize: 64 }}>
            {toPalette.name}
          </div>
          <div style={{ ...TYPO.mono, color: PALETTE.textSecondary, marginTop: 18, fontSize: 18 }}>
            {practitionerName.toUpperCase()} · {hammerCount.toLocaleString()} STRIKES
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Vignette = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
    pointerEvents: 'none',
  }} />
);

const Stars = ({ frame, count }) => {
  const stars = Array.from({ length: count }, (_, i) => {
    const seed = i * 9301 + 49297;
    const x = (seed * 233280) % 1920;
    const y = (seed * 12345) % 1080;
    const size = (i % 3) + 1;
    const phase = (i * 0.7) % (Math.PI * 2);
    const op = 0.2 + 0.5 * (Math.sin(frame * 0.05 + phase) + 1) / 2;
    return { x, y, size, op };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: s.x, top: s.y,
          width: s.size, height: s.size,
          borderRadius: s.size / 2,
          backgroundColor: '#fff',
          opacity: s.op,
        }} />
      ))}
    </AbsoluteFill>
  );
};

function mix(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}
