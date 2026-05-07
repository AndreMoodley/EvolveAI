import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { PALETTE, TYPO, AURA_COLORS } from '../theme';

export const vowDeclarationSchema = {
  vowTitle: 'I will not break form under fatigue',
  vowType: 'major',
  resolutionDate: '2026-12-31',
  practitionerName: 'Practitioner',
  targetStrikes: 10000,
};

export const VowDeclaration = ({
  vowTitle = 'I will not break form under fatigue',
  vowType = 'major',
  resolutionDate = '2026-12-31',
  practitionerName = 'Practitioner',
  targetStrikes = 10000,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const accent = vowType === 'major' ? PALETTE.crimsonGlow : PALETTE.gold;

  const introOp = interpolate(frame, [0, 12, fps * 1.5, fps * 2], [0, 1, 1, 0]);
  const sigilSpring = spring({ frame: frame - fps * 0.5, fps, config: { damping: 16, mass: 1.2 } });
  const sigilOp = interpolate(frame, [fps * 0.5, fps * 1, durationInFrames - 30, durationInFrames], [0, 1, 1, 0.4]);

  const titleOp = interpolate(frame, [fps * 2.2, fps * 3, durationInFrames - 30, durationInFrames], [0, 1, 1, 0.3]);
  const titleY = spring({ frame: frame - fps * 2.2, fps, config: { damping: 18 } });

  const sealOp = interpolate(frame, [fps * 4, fps * 4.5, durationInFrames - 20, durationInFrames], [0, 1, 1, 0.6]);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${PALETTE.voidSurface} 0%, ${PALETTE.obsidian} 80%)`,
    }}>
      {/* Concentric rings */}
      {[1, 2, 3, 4].map((i) => {
        const localFrame = frame - i * 8;
        const sc = spring({ frame: localFrame, fps, config: { damping: 14 } });
        return (
          <AbsoluteFill key={i} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 200 + i * 140, height: 200 + i * 140,
              borderRadius: '50%',
              border: `1px solid ${accent}`,
              opacity: 0.15 * sc,
              transform: `scale(${0.5 + sc * 0.5})`,
            }} />
          </AbsoluteFill>
        );
      })}

      {/* Intro label */}
      <Sequence from={0} durationInFrames={fps * 2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: introOp, textAlign: 'center' }}>
            <div style={{ ...TYPO.label, color: PALETTE.textTertiary, fontSize: 16, marginBottom: 16 }}>
              SACRED COMMITMENT
            </div>
            <div style={{ ...TYPO.title, color: PALETTE.textSecondary, fontSize: 28 }}>
              The {vowType === 'major' ? 'Major' : 'Minor'} Binding
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sigil glyph */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          opacity: sigilOp,
          transform: `scale(${0.5 + sigilSpring * 0.5})`,
          filter: `drop-shadow(0 0 60px ${accent})`,
        }}>
          <div style={{
            ...TYPO.display,
            color: accent,
            fontSize: 280,
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
          }}>
            盟
          </div>
        </div>
      </AbsoluteFill>

      {/* Vow title */}
      <Sequence from={fps * 2.2}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 200 }}>
          <div style={{
            opacity: titleOp,
            transform: `translateY(${(1 - titleY) * 20}px)`,
            textAlign: 'center',
            maxWidth: '80%',
          }}>
            <div style={{ ...TYPO.label, color: accent, fontSize: 13, marginBottom: 16 }}>
              I, {practitionerName.toUpperCase()}, VOW
            </div>
            <div style={{ ...TYPO.title, color: PALETTE.textPrimary, fontSize: 44, lineHeight: 1.2 }}>
              "{vowTitle}"
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Seal footer */}
      <Sequence from={fps * 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80 }}>
          <div style={{ opacity: sealOp, textAlign: 'center' }}>
            <div style={{ ...TYPO.mono, color: PALETTE.textTertiary, fontSize: 14, letterSpacing: 3 }}>
              {targetStrikes.toLocaleString()} STRIKES · RESOLUTION {resolutionDate}
            </div>
            <div style={{
              marginTop: 14,
              padding: '8px 24px',
              border: `1px solid ${accent}`,
              borderRadius: 999,
              ...TYPO.label,
              color: accent,
              fontSize: 12,
              display: 'inline-block',
            }}>
              SEALED
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
