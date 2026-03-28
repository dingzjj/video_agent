import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const Scene6Warning = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = spring({ frame, fps, config: { damping: 80, stiffness: 150 } });
  const titleScale = spring({ frame, fps, config: { damping: 70, stiffness: 250, mass: 0.6 } });
  const subOpacity = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #2a1500 0%, #1a0a00 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
      }}
    >
      {/* Decorative glows */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,150,0,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Warning icon */}
      <div
        style={{
          fontSize: 120,
          marginBottom: 40,
          transform: `scale(${bgScale})`,
        }}
      >
        ⚠️
      </div>

      {/* Main text */}
      <div style={{ transform: `scale(${titleScale})`, textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FF9900',
            lineHeight: 1,
            marginBottom: 16,
            textShadow: '0 0 60px rgba(255,150,0,0.4)',
          }}
        >
          垃圾进
        </h1>
        <div
          style={{
            width: 80,
            height: 4,
            background: '#FF6600',
            margin: '0 auto 16px',
            borderRadius: 2,
          }}
        />
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FF6600',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(255,100,0,0.4)',
          }}
        >
          垃圾出
        </h1>
      </div>

      {/* Sub text */}
      <div
        style={{
          marginTop: 60,
          opacity: subOpacity,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255,150,0,0.1)',
            border: '2px solid rgba(255,150,0,0.3)',
            borderRadius: 20,
            padding: '28px 48px',
          }}
        >
          <p style={{ color: 'rgba(255,200,100,0.9)', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            资料库质量 = AI 回答质量
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 26, lineHeight: 1.5 }}>
            资料库乱，AI 就算想答好也没戏
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
