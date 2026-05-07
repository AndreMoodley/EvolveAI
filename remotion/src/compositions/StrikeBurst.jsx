import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { PALETTE, TYPO, AURA_COLORS } from '../theme';

export const strikeBurstSchema = {
  reps: 100,
  modality: 'origin',
  rating: 9,
  auraKey: 'crimson',
};

const MODALITY_LABELS = {
  origin: 'ORIGIN ART',
  pull: 'PULL',
  push: 'PUSH',
  core: 'CORE',
  cardio: 'CARDIO',
  recovery: 'RECOVERY',
};

export const StrikeBurst = ({ reps = 100, modality = 'origin', rating = 9, auraKey = 'crimson' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const auraColor = AURA_COLORS[auraKey] ?? AURA_COLORS.crimson;

  const counterSpring = spring({ frame: frame - 6, fps, config: { damping: 10, mass: 0.6 } });
  const displayedCount = Math.round(reps * Math.min(1, counterSpring));

  const labelOp = interpolate(frame, [0, 8, durationInFrames - 12, durationInFrames], [0, 1, 1, 0]);
  const ringScale = interpolate(frame, [0, 30], [0, 1.4], { extrapolateRight: 'clamp' });
  const ringOp = interpolate(frame, [4, 30], [0.9, 0], { extrapolateRight: 'clamp' });

  const pulse = (Math.sin(frame * 0.3) + 1) / 2;
  const glowSize = 60 + pulse * 40;

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${PALETTE.voidSurfaceHi} 0%, ${PALETTE.obsidian} 70%)`,
    }}>
      {/* Burst rings */}
      {[0, 0.15, 0.3].map((delay, i) => {
        const localFrame = frame - delay * fps;
        const sc = interpolate(localFrame, [0, 24], [0, 1.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const op = interpolate(localFrame, [0, 24], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 800, height: 800, borderRadius: 400,
              border: `3px solid ${auraColor}`,
              transform: `scale(${sc})`,
              opacity: op,
            }} />
          </AbsoluteFill>
        );
      })}

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 ${glowSize}px ${auraColor})` }}>
          <div style={{ ...TYPO.label, color: auraColor, opacity: labelOp, fontSize: 24, marginBottom: 24 }}>
            NEURAL HAMMERING
          </div>
          <div style={{
            ...TYPO.display,
            color: PALETTE.textPrimary,
            fontSize: 360,
            lineHeight: 0.9,
            textShadow: `0 0 30px ${auraColor}`,
          }}>
            {displayedCount}
          </div>
          <div style={{ ...TYPO.label, color: PALETTE.textSecondary, opacity: labelOp, fontSize: 22, marginTop: 8 }}>
            {MODALITY_LABELS[modality] ?? 'STRIKES'} · RATING {rating}/10
          </div>
        </div>
      </AbsoluteFill>

      {/* Sparks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = interpolate(frame, [6, 36], [0, 600], { extrapolateRight: 'clamp' });
        const op = interpolate(frame, [6, 36], [1, 0], { extrapolateRight: 'clamp' });
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        return (
          <AbsoluteFill key={i} style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: auraColor,
              transform: `translate(${x}px, ${y}px)`,
              opacity: op,
              boxShadow: `0 0 12px ${auraColor}`,
            }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
