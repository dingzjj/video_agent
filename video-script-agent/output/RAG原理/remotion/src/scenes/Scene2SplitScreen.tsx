import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const Scene2SplitScreen = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = spring({ frame, fps, config: { damping: 100 } });
  const rightOpacity = spring({ frame, fps, config: { damping: 100 } });
  const labelOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 100 },
  });

  const leftX = interpolate(frame, [0, 20], [-80, 0], { extrapolateRight: 'clamp' });
  const rightX = interpolate(frame, [0, 20], [80, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#111111', flexDirection: 'row' }}>
      {/* LEFT: Closed book exam */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #2a0000 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: leftOpacity,
          transform: `translateX(${leftX}px)`,
          borderRight: '4px solid #333',
          position: 'relative',
        }}
      >
        {/* Dim overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
          }}
        />

        {/* Emoji */}
        <div style={{ fontSize: 120, marginBottom: 32, position: 'relative', zIndex: 1 }}>😵</div>

        <div
          style={{
            background: 'rgba(255,60,60,0.15)',
            border: '2px solid rgba(255,60,60,0.4)',
            borderRadius: 20,
            padding: '24px 32px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            opacity: labelOpacity,
          }}
        >
          <p style={{ color: '#FF6666', fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
            普通 AI
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 28 }}>闭卷考试</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, marginTop: 12, lineHeight: 1.4 }}>
            只靠记忆
            <br />
            知识有截止日期
          </p>
        </div>
      </div>

      {/* RIGHT: Open book exam */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #001a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: rightOpacity,
          transform: `translateX(${rightX}px)`,
          position: 'relative',
        }}
      >
        {/* Bright overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(0,200,100,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Emoji */}
        <div style={{ fontSize: 120, marginBottom: 32, position: 'relative', zIndex: 1 }}>📖</div>

        <div
          style={{
            background: 'rgba(0,200,100,0.15)',
            border: '2px solid rgba(0,200,100,0.4)',
            borderRadius: 20,
            padding: '24px 32px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            opacity: labelOpacity,
          }}
        >
          <p style={{ color: '#44FF88', fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
            RAG
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 28 }}>开卷考试</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, marginTop: 12, lineHeight: 1.4 }}>
            先查资料
            <br />
            再给出答案
          </p>
        </div>
      </div>

      {/* Center VS badge */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#222',
          border: '3px solid #555',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: labelOpacity,
        }}
      >
        <span style={{ color: '#aaa', fontSize: 28, fontWeight: 900 }}>VS</span>
      </div>

      {/* Title at top */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: leftOpacity,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 32, fontWeight: 700 }}>
          RAG 的核心区别
        </p>
      </div>
    </AbsoluteFill>
  );
};
