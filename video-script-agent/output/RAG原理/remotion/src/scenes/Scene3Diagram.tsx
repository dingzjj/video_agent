import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const steps = [
  { icon: '💬', label: '① 你提问', desc: '"最新的报销政策是什么？"', color: '#4488FF' },
  { icon: '🔍', label: '② AI 检索知识库', desc: '找到最相关的文档片段', color: '#44BBFF' },
  { icon: '✅', label: '③ 带资料生成回答', desc: '有据可查，不再胡说', color: '#44FF88' },
];

export const Scene3Diagram = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 100 } });

  const step1Scale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 80, stiffness: 180 },
  });
  const step2Scale = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 80, stiffness: 180 },
  });
  const step3Scale = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 80, stiffness: 180 },
  });

  const scales = [step1Scale, step2Scale, step3Scale];

  const arrow1Opacity = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 100 } });
  const arrow2Opacity = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0a1628 0%, #0d2040 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(68,136,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 30, marginBottom: 8 }}>
          RAG 的工作原理
        </p>
        <p style={{ color: '#4488FF', fontSize: 36, fontWeight: 900 }}>就这三步</p>
      </div>

      {/* Steps */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
          marginTop: 60,
        }}
      >
        {steps.map((step, i) => (
          <div key={i}>
            <div
              style={{
                transform: `scale(${scales[i]})`,
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${step.color}44`,
                borderRadius: 24,
                padding: '36px 48px',
                display: 'flex',
                alignItems: 'center',
                gap: 36,
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `${step.color}22`,
                  border: `3px solid ${step.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>

              <div>
                <p style={{ color: step.color, fontSize: 38, fontWeight: 900, marginBottom: 8 }}>
                  {step.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 26, lineHeight: 1.4 }}>
                  {step.desc}
                </p>
              </div>
            </div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 40,
                  color: 'rgba(255,255,255,0.3)',
                  padding: '12px 0',
                  opacity: i === 0 ? arrow1Opacity : arrow2Opacity,
                }}
              >
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom tag */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          background: 'rgba(68,255,136,0.15)',
          border: '1px solid rgba(68,255,136,0.3)',
          borderRadius: 999,
          padding: '16px 40px',
        }}
      >
        <p style={{ color: '#44FF88', fontSize: 28, fontWeight: 700 }}>
          带资料才开口 · 说的每句话有据可查
        </p>
      </div>
    </AbsoluteFill>
  );
};
