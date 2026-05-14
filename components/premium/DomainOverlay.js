import React, { useRef, useCallback } from 'react';
import { Animated, Easing, View, Pressable, StyleSheet } from 'react-native';
import { getDomainConfig } from '../../constants/domains';
import { usePremiumStore } from '../../features/premium/store/premium.store';

const MAX_PARTICLES = 10;

function TapParticle({ x, y, spec, onDone }) {
  const anims = useRef(
    Array.from({ length: spec.count }, () => ({
      opacity: new Animated.Value(1),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  React.useEffect(() => {
    const animations = anims.map((a, i) => {
      const angle = (i / spec.count) * Math.PI * 2;
      const speed = spec.velocityRange[0] + Math.random() * (spec.velocityRange[1] - spec.velocityRange[0]);
      const tx = Math.cos(angle) * speed * 0.15;
      const ty = Math.sin(angle) * speed * 0.15;
      return Animated.parallel([
        Animated.timing(a.translateX, {
          toValue: tx,
          duration: spec.decayMs,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(a.translateY, {
          toValue: ty,
          duration: spec.decayMs,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(a.opacity, {
          toValue: 0,
          duration: spec.decayMs,
          useNativeDriver: true,
        }),
        Animated.timing(a.scale, {
          toValue: 0.2,
          duration: spec.decayMs,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(onDone);
  }, []);

  const colorRange = spec.colorRange;
  const sizeMin = spec.sizeRange[0];
  const sizeMax = spec.sizeRange[1];

  return (
    <>
      {anims.map((a, i) => {
        const size = sizeMin + Math.random() * (sizeMax - sizeMin);
        const color = colorRange[Math.floor(Math.random() * colorRange.length)];
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity: a.opacity,
              transform: [
                { translateX: a.translateX },
                { translateY: a.translateY },
                { scale: a.scale },
              ],
            }}
          />
        );
      })}
    </>
  );
}

let _nextId = 0;

export function DomainOverlay({ children }) {
  const activeDomainPackId = usePremiumStore((s) => s.activeDomainPackId);
  const [particles, setParticles] = React.useState([]);

  const domainConfig = activeDomainPackId ? getDomainConfig(activeDomainPackId) : null;
  const particleSpec = domainConfig?.particleSpec;

  const handleTap = useCallback(
    (event) => {
      if (!particleSpec) return;
      const { locationX, locationY } = event.nativeEvent;
      const id = _nextId++;
      setParticles((prev) => [
        ...prev.slice(-(MAX_PARTICLES - 1)),
        { id, x: locationX, y: locationY },
      ]);
    },
    [particleSpec]
  );

  const removeParticle = useCallback((id) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (!particleSpec) return children;

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
      {children}
      {particles.map((p) => (
        <TapParticle
          key={p.id}
          x={p.x}
          y={p.y}
          spec={particleSpec}
          onDone={() => removeParticle(p.id)}
        />
      ))}
    </Pressable>
  );
}
