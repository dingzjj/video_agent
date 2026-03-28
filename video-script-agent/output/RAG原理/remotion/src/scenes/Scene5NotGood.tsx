import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const badItems = [
  { icon: '💬', text: '今天心情怎么样？', desc: '闲聊' },
  { icon: '🌐', text: '帮我翻译这句话', desc: '翻译' },
  { icon: '💻', text: '写段 Python 代码', desc: '代码生成' },
];

export const Scene5NotGood = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 100 } });

  const item1Opacity = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 100 } });
  const item2Opacity = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 100 } });
  const item3Opacity = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 100 } });
  const itemOpacities = [item1Opacity, item2Opacity, item3Opacity];

  const goodOpacity = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 80 } });
  const goodScale = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 80, stiffness: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <p style={{ color: '#FF4444', fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
          ❌ RAG 不适合这些
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 26 }}>AI 自己就能搞定，不用多此一举</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', marginTop: 40 }}>
        {/* Bad items */}
        {badItems.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,68,68,0.08)',
              border: '2px solid rgba(255,68,68,0.25)',
              borderRadius: 20,
              padding: '28px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              opacity: itemOpacities[i],
            }}
          >
            <span style={{ fontSize: 48, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 30, marginBottom: 4 }}>
                {item.text}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 22 }}>{item.desc}</p>
            </div>
            {/* X mark */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(255,68,68,0.2)',
                border: '2px solid rgba(255,68,68,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                color: '#FF4444',
                fontWeight: 900,
              }}
            >
              ✗
            </div>
          </div>
        ))}

        {/* Good example */}
        <div
          style={{
            background: 'rgba(68,255,136,0.1)',
            border: '2px solid rgba(68,255,136,0.4)',
            borderRadius: 20,
            padding: '28px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            opacity: goodOpacity,
            transform: `scale(${goodScale})`,
          }}
        >
          <span style={{ fontSize: 48, flexShrink: 0 }}>📊</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#44FF88', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
              查一下公司 Q3 财报
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>这才是 RAG 的主场</p>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(68,255,136,0.2)',
              border: '2px solid rgba(68,255,136,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              color: '#44FF88',
              fontWeight: 900,
            }}
          >
            ✓
          </div>
        </div>
      </div>

      {/* Bottom quote */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          opacity: goodOpacity,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 26 }}>
          RAG 是工具，不是神器
        </p>
      </div>
    </AbsoluteFill>
  );
};
