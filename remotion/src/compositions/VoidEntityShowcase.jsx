import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { VoidEntity } from '../primitives/VoidEntity';
import { PALETTE, TYPO, AURA_COLORS, REALM_PALETTES } from '../theme';

export const voidEntityShowcaseSchema = {
  realmLevel: 5,
  ki: 90,
  shadowLevel: 3,
  streak: 30,
  auraKey: 'crimson',
  showStats: true,
};

export const VoidEntityShowcase = ({
  realmLevel = 5,
  ki = 90,
  shadowLevel = 3,
  streak = 30,
  auraKey = 'crimson',
  showStats = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const auraColor = AURA_COLORS[auraKey] ?? AURA_COLORS.ki;
  const realmPalette = REALM_PALETTES[realmLevel] ?? REALM_PALETTES[1];

  const cameraDrift = Math.sin((frame / (fps * 12)) * Math.PI * 2) * 18;
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const op = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 45%, ${realmPalette.primary} 0%, ${realmPalette.secondary} 50%, ${PALETTE.obsidian} 100%)`,
      opacity: op,
    }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${cameraDrift}px)` }}>
        <div style={{ transform: 'scale(1.8)' }}>
          <VoidEntity realmLevel={realmLevel} ki={ki} shadowLevel={shadowLevel} streak={streak} auraColor={auraColor} />
        </div>
      </AbsoluteFill>

      {showStats && (
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 80,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              ...TYPO.display,
              color: realmPalette.accent,
              fontSize: 80,
              fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
              textShadow: `0 0 40px ${realmPalette.accent}`,
              marginBottom: 4,
            }}>
              {realmPalette.glyph}
            </div>
            <div style={{ ...TYPO.label, color: realmPalette.accent, fontSize: 14 }}>
              REALM {realmLevel} · {realmPalette.name}
            </div>
            <div style={{ ...TYPO.mono, color: PALETTE.textTertiary, fontSize: 13, marginTop: 8 }}>
              KI {ki} · SHADOW LV{shadowLevel} · STREAK {streak}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
