import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { BLOODLINES, ORIGIN_STAGE } from '../../constants/bloodlines';

export const AURA_COLORS = {
  ki:      { label: 'Ki',    sublabel: 'Cyan',    color: '#7cf6ff' },
  gold:    { label: 'Power', sublabel: 'Gold',    color: '#f5b301' },
  crimson: { label: 'Void',  sublabel: 'Crimson', color: '#c91538' },
  white:   { label: 'Pure',  sublabel: 'White',   color: '#dde8ff' },
};

const CW = 280;
const CH = 268;
const CX = CW / 2;
const CY = 148;

// Fallback stage for the origin bloodline (maps old field names to new)
const STAGE_COMPAT = Object.fromEntries(
  Object.entries(ORIGIN_STAGE).map(([k, v]) => [
    k,
    { torsoH: v.torsoHeight, armLen: v.armLength, glowR: v.glowRadius },
  ])
);

const RING_D = {
  1: [128,  92,  62],
  2: [144, 104,  70],
  3: [158, 114,  78],
  4: [170, 124,  84],
  5: [182, 132,  90],
  6: [196, 142,  98],
  7: [210, 152, 106],
};

const PCFG = [
  { radius: 88,  dur: 5800, dot: 5 },
  { radius: 74,  dur: 3500, dot: 4 },
  { radius: 100, dur: 7200, dot: 6 },
  { radius: 66,  dur: 4100, dot: 3 },
  { radius: 110, dur: 8800, dot: 5 },
  { radius: 80,  dur: 2900, dot: 4 },
];

const REALM_OPACITY = [0, 0.50, 0.58, 0.67, 0.76, 0.84, 0.92, 1.00];

const CORRUPTION_COLORS = {
  body: '#1a0a0a',
  border: '#3a0a0a44',
  eye: '#ff2040',
  aura: '#600010',
};

function Particle({ index, total, radius, dur, dot, color }) {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, {
        toValue: 1,
        duration: dur,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const startDeg = (index / Math.max(total, 1)) * 360;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        top: CY - radius,
        left: CX - radius,
        transform: [{
          rotate: rot.interpolate({
            inputRange: [0, 1],
            outputRange: [`${startDeg}deg`, `${startDeg + 360}deg`],
          }),
        }],
      }}
    >
      <View style={{
        position: 'absolute',
        top: 0,
        left: radius - dot / 2,
        width: dot,
        height: dot,
        borderRadius: dot / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: dot * 2,
        elevation: 4,
      }} />
    </Animated.View>
  );
}

function resolveStage(bloodlineKey, realmLevel) {
  const bloodline = BLOODLINES[bloodlineKey];
  if (!bloodline) return STAGE_COMPAT[realmLevel] ?? STAGE_COMPAT[1];

  const cfg = bloodline.stageConfig[realmLevel] ?? bloodline.stageConfig[1];
  return {
    torsoH: cfg.torsoHeight,
    armLen: cfg.armLength,
    glowR: cfg.glowRadius,
  };
}

function resolveAuraColor(bloodlineKey, auraKey, isCorrupted) {
  if (isCorrupted) return CORRUPTION_COLORS.aura;

  const bloodline = BLOODLINES[bloodlineKey];
  if (bloodline?.auraColors?.[auraKey]) {
    return bloodline.auraColors[auraKey];
  }
  return AURA_COLORS[auraKey]?.color ?? AURA_COLORS.ki.color;
}

export default function SpiritEntity({
  realmLevel = 1,
  ki = 100,
  shadowLevel = 1,
  streak = 0,
  auraKey = 'ki',
  bloodlineKey = 'origin',
  isCorrupted = false,
}) {
  const stage = resolveStage(bloodlineKey, realmLevel);
  const auraColor = resolveAuraColor(bloodlineKey, auraKey, isCorrupted);
  const ringDs = RING_D[realmLevel] ?? RING_D[1];
  const numParticles = Math.min(realmLevel - 1 + (streak >= 7 ? 1 : 0), PCFG.length);
  const charOpacity = REALM_OPACITY[realmLevel] ?? 1;

  const bodyBg = isCorrupted ? CORRUPTION_COLORS.body : '#080b12';
  const bodyBorderColor = isCorrupted
    ? CORRUPTION_COLORS.border
    : `${auraColor}38`;

  const eyeColor = isCorrupted
    ? CORRUPTION_COLORS.eye
    : ki > 60
    ? auraColor
    : ki > 30
    ? '#f5b301'
    : '#ff5b76';

  const armDeg = 22 + (shadowLevel - 1) * 7;

  const breathe = useRef(new Animated.Value(0)).current;
  const ringA   = useRef(new Animated.Value(0)).current;
  const ringB   = useRef(new Animated.Value(0)).current;
  const ringC   = useRef(new Animated.Value(0)).current;
  const eyeAnim = useRef(new Animated.Value(0)).current;
  const armAnim = useRef(new Animated.Value(armDeg)).current;
  const corruptPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, dur) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration: dur, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: dur, useNativeDriver: true }),
        ])
      );
    loop(breathe, 3800).start();
    loop(ringA, 3200).start();
    loop(ringB, 2500).start();
    loop(ringC, 1700).start();
    loop(eyeAnim, isCorrupted ? 400 : 850).start();
    if (isCorrupted) loop(corruptPulse, 1200).start();
  }, [isCorrupted]);

  useEffect(() => {
    Animated.spring(armAnim, {
      toValue: armDeg,
      useNativeDriver: true,
      friction: 7,
      tension: 30,
    }).start();
  }, [shadowLevel]);

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

  const bodyScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1.012] });
  const leftRot  = armAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '-360deg'] });
  const rightRot = armAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const eyeOp   = eyeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.60, 1.0] });
  const corruptOp = corruptPulse.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.3] });

  const ringAnims = [
    { val: ringA, baseOp: 0.08, peakOp: 0.26, scFrom: 0.94, scTo: 1.06, bw: 1   },
    { val: ringB, baseOp: 0.12, peakOp: 0.35, scFrom: 0.96, scTo: 1.04, bw: 1.5 },
    { val: ringC, baseOp: 0.18, peakOp: 0.48, scFrom: 0.97, scTo: 1.03, bw: 1.5 },
  ];

  const part = (extra = {}) => ({
    position: 'absolute',
    backgroundColor: bodyBg,
    borderWidth: 1,
    borderColor: bodyBorderColor,
    shadowColor: auraColor,
    shadowOpacity: 0.18 + (realmLevel - 1) * 0.04,
    shadowRadius: stage.glowR * 0.5,
    elevation: 2,
    ...extra,
  });

  return (
    <View style={{ width: CW, height: CH, alignSelf: 'center' }}>

      {/* Aura rings */}
      {ringDs.map((d, i) => {
        const { val, baseOp, peakOp, scFrom, scTo, bw } = ringAnims[i];
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: d, height: d, borderRadius: d / 2,
              top: CY - d / 2, left: CX - d / 2,
              borderWidth: bw,
              borderColor: auraColor,
              opacity: val.interpolate({ inputRange: [0, 1], outputRange: [baseOp, peakOp] }),
              transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [scFrom, scTo] }) }],
            }}
          />
        );
      })}

      {/* Corruption overlay ring — only when corrupted */}
      {isCorrupted && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 160, height: 160,
            borderRadius: 80,
            top: CY - 80, left: CX - 80,
            borderWidth: 2,
            borderColor: '#ff2040',
            opacity: corruptOp,
          }}
        />
      )}

      {/* Orbit particles */}
      {PCFG.slice(0, numParticles).map((cfg, i) => (
        <Particle key={i} index={i} total={numParticles} color={auraColor} {...cfg} />
      ))}

      {/* Character silhouette */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: charOpacity,
          transform: [{ scale: bodyScale }],
        }}
      >
        {/* Head */}
        <View style={part({ top: HEAD_TOP, left: HEAD_LEFT, width: HEAD_W, height: HEAD_H, borderRadius: HEAD_W / 2 })} />

        {/* Eyes */}
        <Animated.View style={{
          position: 'absolute',
          top: HEAD_TOP + HEAD_H * 0.36, left: HEAD_LEFT + HEAD_W * 0.18,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: eyeColor,
          shadowColor: eyeColor, shadowOpacity: 0.85, shadowRadius: 6, elevation: 3,
          opacity: eyeOp,
        }} />
        <Animated.View style={{
          position: 'absolute',
          top: HEAD_TOP + HEAD_H * 0.36, left: HEAD_LEFT + HEAD_W * 0.62,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: eyeColor,
          shadowColor: eyeColor, shadowOpacity: 0.85, shadowRadius: 6, elevation: 3,
          opacity: eyeOp,
        }} />

        {/* Neck */}
        <View style={part({ top: NECK_TOP, left: NECK_LEFT, width: NECK_W, height: NECK_H, borderRadius: 4 })} />

        {/* Torso */}
        <View style={part({
          top: TORSO_TOP, left: TORSO_LEFT, width: TORSO_W, height: stage.torsoH,
          borderRadius: 8,
          shadowRadius: stage.glowR * 0.8,
          shadowOpacity: 0.28 + (realmLevel - 1) * 0.05,
        })} />

        {/* Left arm */}
        <Animated.View style={part({
          top: ARM_TOP, left: ARM_L_LEFT,
          width: ARM_W, height: stage.armLen,
          borderRadius: ARM_W / 2,
          transform: [{ rotate: leftRot }],
        })} />

        {/* Right arm */}
        <Animated.View style={part({
          top: ARM_TOP, left: ARM_R_LEFT,
          width: ARM_W, height: stage.armLen,
          borderRadius: ARM_W / 2,
          transform: [{ rotate: rightRot }],
        })} />

        {/* Left leg */}
        <View style={part({
          top: LEG_TOP, left: LEG_L_LEFT, width: LEG_W, height: LEG_H,
          borderTopLeftRadius: 4, borderTopRightRadius: 4,
          borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
        })} />

        {/* Right leg */}
        <View style={part({
          top: LEG_TOP, left: LEG_R_LEFT, width: LEG_W, height: LEG_H,
          borderTopLeftRadius: 4, borderTopRightRadius: 4,
          borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
        })} />
      </Animated.View>
    </View>
  );
}
