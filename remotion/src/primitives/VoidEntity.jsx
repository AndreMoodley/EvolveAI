import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

const STAGE = {
  1: { torsoH: 44, armLen: 38, glowR: 6 },
  2: { torsoH: 51, armLen: 41, glowR: 8 },
  3: { torsoH: 57, armLen: 43, glowR: 10 },
  4: { torsoH: 63, armLen: 46, glowR: 12 },
  5: { torsoH: 70, armLen: 48, glowR: 15 },
  6: { torsoH: 77, armLen: 50, glowR: 18 },
  7: { torsoH: 84, armLen: 52, glowR: 22 },
};

const RING_D = {
  1: [128, 92, 62],
  2: [144, 104, 70],
  3: [158, 114, 78],
  4: [170, 124, 84],
  5: [182, 132, 90],
  6: [196, 142, 98],
  7: [210, 152, 106],
};

const REALM_OPACITY = [0, 0.5, 0.58, 0.67, 0.76, 0.84, 0.92, 1.0];

const PCFG = [
  { radius: 88, period: 174, dot: 5 },
  { radius: 74, period: 105, dot: 4 },
  { radius: 100, period: 216, dot: 6 },
  { radius: 66, period: 123, dot: 3 },
  { radius: 110, period: 264, dot: 5 },
  { radius: 80, period: 87, dot: 4 },
];

export const VoidEntity = ({
  realmLevel = 1,
  ki = 100,
  shadowLevel = 1,
  streak = 0,
  auraColor = '#7cf6ff',
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stage = STAGE[realmLevel] ?? STAGE[1];
  const ringDs = RING_D[realmLevel] ?? RING_D[1];
  const numParticles = Math.min(Math.max(realmLevel - 1, 0) + (streak >= 7 ? 1 : 0), PCFG.length);
  const charOpacity = REALM_OPACITY[realmLevel] ?? 1;
  const eyeColor = ki > 60 ? auraColor : ki > 30 ? '#f5b301' : '#ff5b76';
  const armDeg = 22 + (shadowLevel - 1) * 7;

  const CW = 280;
  const CH = 268;
  const CX = CW / 2;
  const CY = 148;

  const breathe = Math.sin((frame / (fps * 3.8)) * Math.PI * 2);
  const bodyScale = interpolate(breathe, [-1, 1], [0.985, 1.012]);
  const eyeOp = interpolate(Math.sin((frame / (fps * 0.85)) * Math.PI * 2), [-1, 1], [0.6, 1.0]);

  const HEAD_W = 44, HEAD_H = 44;
  const HEAD_TOP = 46, HEAD_LEFT = CX - HEAD_W / 2;
  const NECK_W = 12, NECK_H = 14;
  const NECK_TOP = HEAD_TOP + HEAD_H + 1;
  const NECK_LEFT = CX - NECK_W / 2;
  const TORSO_W = 50;
  const TORSO_TOP = NECK_TOP + NECK_H;
  const TORSO_LEFT = CX - TORSO_W / 2;
  const ARM_W = 11;
  const ARM_TOP = TORSO_TOP + 6;
  const ARM_L_LEFT = TORSO_LEFT - ARM_W - 4;
  const ARM_R_LEFT = TORSO_LEFT + TORSO_W + 4;
  const LEG_W = 18, LEG_H = 52;
  const LEG_TOP = TORSO_TOP + stage.torsoH + 2;
  const LEG_L_LEFT = CX - LEG_W - 3;
  const LEG_R_LEFT = CX + 3;

  const partStyle = (extra = {}) => ({
    position: 'absolute',
    backgroundColor: '#080b12',
    border: `1px solid ${auraColor}38`,
    boxShadow: `0 0 ${stage.glowR}px ${auraColor}`,
    ...extra,
  });

  const ringConfigs = [
    { period: 3.2, baseOp: 0.08, peakOp: 0.26, scFrom: 0.94, scTo: 1.06, bw: 1 },
    { period: 2.5, baseOp: 0.12, peakOp: 0.35, scFrom: 0.96, scTo: 1.04, bw: 1.5 },
    { period: 1.7, baseOp: 0.18, peakOp: 0.48, scFrom: 0.97, scTo: 1.03, bw: 1.5 },
  ];

  return (
    <div style={{
      width: CW, height: CH, position: 'relative',
      transform: `scale(${scale})`, transformOrigin: 'center center',
    }}>
      {ringDs.map((d, i) => {
        const cfg = ringConfigs[i];
        const t = (Math.sin((frame / (fps * cfg.period)) * Math.PI * 2) + 1) / 2;
        const op = interpolate(t, [0, 1], [cfg.baseOp, cfg.peakOp]);
        const sc = interpolate(t, [0, 1], [cfg.scFrom, cfg.scTo]);
        return (
          <div key={i} style={{
            position: 'absolute',
            width: d, height: d, borderRadius: d / 2,
            top: CY - d / 2, left: CX - d / 2,
            border: `${cfg.bw}px solid ${auraColor}`,
            opacity: op,
            transform: `scale(${sc})`,
          }} />
        );
      })}

      {PCFG.slice(0, numParticles).map((cfg, i) => {
        const startDeg = (i / Math.max(numParticles, 1)) * 360;
        const rotation = startDeg + (frame / cfg.period) * 360;
        return (
          <div key={i} style={{
            position: 'absolute',
            width: cfg.radius * 2, height: cfg.radius * 2,
            top: CY - cfg.radius, left: CX - cfg.radius,
            transform: `rotate(${rotation}deg)`,
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: cfg.radius - cfg.dot / 2,
              width: cfg.dot, height: cfg.dot, borderRadius: cfg.dot / 2,
              backgroundColor: auraColor,
              boxShadow: `0 0 ${cfg.dot * 4}px ${auraColor}`,
            }} />
          </div>
        );
      })}

      <div style={{
        position: 'absolute', inset: 0,
        opacity: charOpacity,
        transform: `scale(${bodyScale})`,
      }}>
        <div style={partStyle({ top: HEAD_TOP, left: HEAD_LEFT, width: HEAD_W, height: HEAD_H, borderRadius: HEAD_W / 2 })} />

        <div style={{
          position: 'absolute',
          top: HEAD_TOP + HEAD_H * 0.36, left: HEAD_LEFT + HEAD_W * 0.18,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: eyeColor,
          boxShadow: `0 0 12px ${eyeColor}`,
          opacity: eyeOp,
        }} />
        <div style={{
          position: 'absolute',
          top: HEAD_TOP + HEAD_H * 0.36, left: HEAD_LEFT + HEAD_W * 0.62,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: eyeColor,
          boxShadow: `0 0 12px ${eyeColor}`,
          opacity: eyeOp,
        }} />

        <div style={partStyle({ top: NECK_TOP, left: NECK_LEFT, width: NECK_W, height: NECK_H, borderRadius: 4 })} />
        <div style={partStyle({
          top: TORSO_TOP, left: TORSO_LEFT, width: TORSO_W, height: stage.torsoH,
          borderRadius: 8,
        })} />

        <div style={partStyle({
          top: ARM_TOP, left: ARM_L_LEFT, width: ARM_W, height: stage.armLen,
          borderRadius: ARM_W / 2,
          transform: `rotate(-${armDeg}deg)`,
          transformOrigin: '50% 0%',
        })} />
        <div style={partStyle({
          top: ARM_TOP, left: ARM_R_LEFT, width: ARM_W, height: stage.armLen,
          borderRadius: ARM_W / 2,
          transform: `rotate(${armDeg}deg)`,
          transformOrigin: '50% 0%',
        })} />

        <div style={partStyle({
          top: LEG_TOP, left: LEG_L_LEFT, width: LEG_W, height: LEG_H,
          borderRadius: '4px 4px 8px 8px',
        })} />
        <div style={partStyle({
          top: LEG_TOP, left: LEG_R_LEFT, width: LEG_W, height: LEG_H,
          borderRadius: '4px 4px 8px 8px',
        })} />
      </div>
    </div>
  );
};
