import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const cards = [
  {
    icon: '📋',
    title: '企业内部问答',
    example: '"公司报销流程是什么？"',
    color: '#4488FF',
  },
  {
    icon: '⚖️',
    title: '法律文书查阅',
    example: '"这份合同有没有风险？"',
    color: '#AA66FF',
  },
  {
    icon: '🏥',
    title: '医疗文献检索',
    example: '"这个药有什么副作用？"',
    color: '#44FFAA',
  },
];

export const Scene4Cards = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, from: -40, to: 0, config: { damping: 100 } });
  const titleOpacity = spring({ frame, fps, config: { damping: 100 } });

  const card1X = interpolate(spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 80 } }), [0, 1], [-200, 0]);
  const card2X = interpolate(spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 80 } }), [0, 1], [-200, 0]);
  const card3X = interpolate(spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 80 } }), [0, 1], [-200, 0]);

  const cardXs = [card1X, card2X, card3X];
  const card1Opacity = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 100 } });
  const card2Opacity = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 100 } });
  const card3Opacity = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 100 } });
  const cardOpacities = [card1Opacity, card2Opacity, card3Opacity];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0a2818 0%, #061a10 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
      }}
    >
      {/* Decorative */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(68,255,136,0.1) 0%, transparent 70%)',
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
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(68,255,136,0.15)',
            border: '2px solid rgba(68,255,136,0.3)',
            borderRadius: 999,
            padding: '12px 36px',
            marginBottom: 20,
          }}
        >
          <p style={{ color: '#44FF88', fontSize: 28, fontWeight: 700 }}>RAG 最擅长</p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 30 }}>有专业知识库的场景</p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          width: '100%',
          marginTop: 60,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              background: `${card.color}11`,
              border: `2px solid ${card.color}44`,
              borderRadius: 24,
              padding: '36px 48px',
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              transform: `translateX(${cardXs[i]}px)`,
              opacity: cardOpacities[i],
            }}
          >
            <div
              style={{
                fontSize: 64,
                width: 96,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <p style={{ color: card.color, fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
                {card.title}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 26, fontStyle: 'italic' }}>
                {card.example}
              </p>
            </div>

            {/* Check mark */}
            <div
              style={{
                marginLeft: 'auto',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `${card.color}22`,
                border: `2px solid ${card.color}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                color: card.color,
              }}
            >
              ✓
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
