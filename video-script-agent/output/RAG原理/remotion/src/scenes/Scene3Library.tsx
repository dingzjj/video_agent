import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

// 这一场景改用"时间轴"布局，和前面的左右对比形成视觉差异
export const Scene3Library: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STEPS = [
    { emoji: '🙋', label: '你提问', sub: '"这个药有副作用吗？"' },
    { emoji: '📚', label: '去知识库找', sub: '语义搜索最相关的内容' },
    { emoji: '💬', label: '带资料来回答', sub: '根据文献第3页……' },
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      justifyContent: 'center', alignItems: 'center',
      padding: '120px 80px', fontFamily: FONT,
    }}>
      {/* 顶部标题，小字，不抢戏 */}
      <p style={{
        position: 'absolute', top: 120,
        fontSize: 30, color: 'rgba(255,255,255,0.3)',
        textAlign: 'center', width: '100%', letterSpacing: '3px',
        fontWeight: 500,
        opacity: spring({ frame, fps, config: { damping: 200 } }),
      }}>
        它是怎么工作的
      </p>

      {/* 垂直时间轴 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map(({ emoji, label, sub }, i) => {
          const delay = i * 20;
          const opacity = spring({ frame, fps, config: { damping: 200 }, delay });
          const x = interpolate(
            spring({ frame, fps, config: { damping: 20, stiffness: 200 }, delay }),
            [0, 1], [-60, 0]
          );

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', opacity }}>
              {/* 左侧：时间轴线 + 圆点 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 32, width: 40 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: i === 1 ? '#FF6B35' : 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.1)', minHeight: 48 }} />
                )}
              </div>

              {/* 右侧：内容 */}
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0, transform: `translateX(${x}px)` }}>
                <p style={{ fontSize: 52, marginBottom: 8 }}>{emoji}</p>
                <p style={{ fontSize: 40, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: 26, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>{sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
