import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { PALETTE, TYPO, AURA_COLORS } from '../theme';

export const streakMilestoneSchema = {
  streak: 30,
  practitionerName: 'Practitioner',
  auraKey: 'gold',
};

const TIER_FOR_STREAK = (s) => {
  if (s >= 365) return { label: 'YEAR OF DISCIPLINE', accent: '#fff', superlative: 'ABSOLUTE' };
  if (s >= 100) return { label: 'CENTURION', accent: PALETTE.gold, superlative: 'UNBROKEN' };
  if (s >= 30) return { label: 'CYCLE COMPLETE', accent: PALETTE.crimsonGlow, superlative: 'TEMPERED' };
  if (s >= 7) return { label: 'FIRST WEEK', accent: PALETTE.ki, superlative: 'IGNITED' };
  return { label: 'FORGED', accent: AURA_COLORS.gold, superlative: 'DAY ' + s };
};

export const StreakMilestone = ({ streak = 30, practitionerName = 'Practitioner', auraKey = 'gold' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tier = TIER_FOR_STREAK(streak);

  const burstScale = spring({ frame, fps, config: { damping: 14 } });
  const numberSpring = spring({ frame: frame - 8, fps, config: { damping: 12, mass: 0.8 } });
  const displayedNumber = Math.round(streak * Math.min(1, numberSpring));

  const labelOp = interpolate(frame, [fps * 0.6, fps * 1.0, durationInFrames - 20, durationInFrames], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${PALETTE.voidSurfaceHi} 0%, ${PALETTE.obsidian} 70%)`,
    }}>
      {/* Radial flame rays */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        const len = interpolate(frame, [0, 30], [0, 700], { extrapolateRight: 'clamp' });
        const op = interpolate(frame, [0, 30, durationInFrames - 20, durationInFrames], [0, 0.18, 0.18, 0]);
        return (
          <AbsoluteFill key={i} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 4, height: len,
              background: `linear-gradient(to top, ${tier.accent}, transparent)`,
              transform: `rotate(${angle}deg) translateY(-${len / 2}px)`,
              transformOrigin: 'center bottom',
              opacity: op,
            }} />
          </AbsoluteFill>
        );
      })}

      {/* Big number */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center',
          transform: `scale(${0.8 + burstScale * 0.2})`,
          filter: `drop-shadow(0 0 80px ${tier.accent})`,
        }}>
          <div style={{ ...TYPO.label, color: tier.accent, fontSize: 22, marginBottom: 8 }}>
            {tier.superlative}
          </div>
          <div style={{
            ...TYPO.display,
            color: PALETTE.textPrimary,
            fontSize: 480,
            lineHeight: 0.85,
            textShadow: `0 0 30px ${tier.accent}`,
          }}>
            {displayedNumber}
          </div>
          <div style={{ ...TYPO.title, color: tier.accent, fontSize: 36, marginTop: 4 }}>
            {tier.label}
          </div>
        </div>
      </AbsoluteFill>

      {/* Footer */}
      <Sequence from={fps * 1.0}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80 }}>
          <div style={{ opacity: labelOp, textAlign: 'center' }}>
            <div style={{ ...TYPO.mono, color: PALETTE.textTertiary, fontSize: 14, letterSpacing: 3 }}>
              {practitionerName.toUpperCase()} · CONSECUTIVE DAYS
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
