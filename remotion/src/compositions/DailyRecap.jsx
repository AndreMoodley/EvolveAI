import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { VoidEntity } from '../primitives/VoidEntity';
import { PALETTE, TYPO, AURA_COLORS, REALM_PALETTES } from '../theme';

export const dailyRecapSchema = {
  practitionerName: 'Practitioner',
  date: '2026-05-07',
  realmLevel: 5,
  hammerCount: 18420,
  ki: 78,
  shadowLevel: 3,
  streak: 42,
  todayStrikes: 312,
  modalities: ['origin', 'pull'],
  vowsAdvanced: 2,
  kiLeaks: 1,
  auraKey: 'crimson',
};

export const DailyRecap = (props) => {
  const {
    practitionerName, date, realmLevel, hammerCount, ki, shadowLevel,
    streak, todayStrikes, modalities, vowsAdvanced, kiLeaks, auraKey,
  } = props;
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const auraColor = AURA_COLORS[auraKey] ?? AURA_COLORS.crimson;
  const realmPalette = REALM_PALETTES[realmLevel] ?? REALM_PALETTES[1];

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at top, ${realmPalette.primary} 0%, ${PALETTE.obsidian} 70%)`,
      padding: '80px 60px',
    }}>
      {/* Top header */}
      <Sequence from={0} durationInFrames={fps * 8}>
        <FadeIn delay={0} duration={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...TYPO.label, color: auraColor, fontSize: 18 }}>VOID LEDGER</div>
            <div style={{ ...TYPO.mono, color: PALETTE.textTertiary, fontSize: 16, marginTop: 6 }}>
              {date}
            </div>
          </div>
        </FadeIn>
      </Sequence>

      {/* Center entity */}
      <Sequence from={20} durationInFrames={fps * 8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: -height * 0.06 }}>
          <FadeIn delay={0} duration={30}>
            <div style={{ transform: 'scale(1.6)' }}>
              <VoidEntity realmLevel={realmLevel} ki={ki} shadowLevel={shadowLevel} streak={streak} auraColor={auraColor} />
            </div>
          </FadeIn>
        </AbsoluteFill>
      </Sequence>

      {/* Practitioner name + realm */}
      <Sequence from={fps * 0.8} durationInFrames={fps * 7}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: height * 0.22 }}>
          <SlideUp delay={0}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...TYPO.title, color: PALETTE.textPrimary, fontSize: 42 }}>
                {practitionerName}
              </div>
              <div style={{ ...TYPO.label, color: realmPalette.accent, marginTop: 10, fontSize: 16 }}>
                REALM {realmLevel} · {realmPalette.name}
              </div>
            </div>
          </SlideUp>
        </AbsoluteFill>
      </Sequence>

      {/* Stat grid */}
      <Sequence from={fps * 1.5}>
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 100,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '90%' }}>
            <Stat label="STRIKES TODAY" value={todayStrikes.toLocaleString()} accent={auraColor} delay={0} />
            <Stat label="STREAK" value={`${streak} DAYS`} accent={PALETTE.gold} delay={6} />
            <Stat label="KI" value={`${ki}/100`} accent={PALETTE.ki} delay={12} />
            <Stat label="SHADOW" value={`LV ${shadowLevel}/5`} accent={PALETTE.ember} delay={18} />
            <Stat label="LIFETIME" value={hammerCount.toLocaleString()} accent={realmPalette.accent} delay={24} wide />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Bottom narrative */}
      <Sequence from={fps * 4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 30 }}>
          <FadeIn delay={0} duration={20}>
            <div style={{ ...TYPO.mono, color: PALETTE.textTertiary, fontSize: 14, textAlign: 'center', maxWidth: '80%' }}>
              {modalities.length} MODALITIES · {vowsAdvanced} VOWS ADVANCED · {kiLeaks} KI LEAKS
            </div>
          </FadeIn>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Stat = ({ label, value, accent, delay, wide = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const op = interpolate(sp, [0, 1], [0, 1]);
  const ty = (1 - sp) * 20;
  return (
    <div style={{
      gridColumn: wide ? '1 / span 2' : 'auto',
      background: `linear-gradient(135deg, ${PALETTE.voidSurfaceHi}, ${PALETTE.voidSurface})`,
      border: `1px solid ${PALETTE.hairline}`,
      borderRadius: 16,
      padding: 20,
      opacity: op,
      transform: `translateY(${ty}px)`,
    }}>
      <div style={{ ...TYPO.label, color: PALETTE.textTertiary, fontSize: 11 }}>{label}</div>
      <div style={{ ...TYPO.title, color: accent, fontSize: 32, marginTop: 6 }}>{value}</div>
    </div>
  );
};

const FadeIn = ({ delay = 0, duration = 20, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [delay, delay + duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: op }}>{children}</div>;
};

const SlideUp = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return <div style={{ opacity: sp, transform: `translateY(${(1 - sp) * 20}px)` }}>{children}</div>;
};
