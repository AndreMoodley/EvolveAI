import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0]);
  const scale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <h1 style={{ color: '#e94560', fontSize: 80, fontFamily: 'sans-serif', margin: 0 }}>
          EvolveAI
        </h1>
        <p style={{ color: '#ffffff', fontSize: 30, fontFamily: 'sans-serif', marginTop: 16 }}>
          Frame {frame}
        </p>
      </div>
    </AbsoluteFill>
  );
};
