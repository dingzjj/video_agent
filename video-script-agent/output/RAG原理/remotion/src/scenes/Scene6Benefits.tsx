import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

// 极简版：三个大数字 + 关键词，不要卡片
const ITEMS = [
  { num: '①', text: '知识不过时', color: '#FF6B35' },
  { num: '②', text: '不乱编', color: '#FFD166' },
  { num: '③', text: '私有数据也行', color: '#4ADE80' },
];

export const Scene6Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      justifyContent: 'center', alignItems: 'center',
      padding: '120px 80px', fontFamily: FONT,
    }}>
      <div style={{ width: '100%' }}>
        {ITEMS.map(({ num, text, color }, i) => {
          const delay = i * 18;
          const opacity = spring({ frame, fps, config: { damping: 200 }, delay });
          const x = interpolate(
            spring({ frame, fps, config: { damping: 20, stiffness: 220 }, delay }),
            [0, 1], [-80, 0]
          );

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 32,
              marginBottom: i < ITEMS.length - 1 ? 56 : 0,
              opacity, transform: `translateX(${x}px)`,
            }}>
              <span style={{
                fontSize: 52, fontWeight: 900, color,
                width: 52, flexShrink: 0,
              }}>{num}</span>
              <p style={{
                fontSize: 52, fontWeight: 800, color: '#FFFFFF',
                letterSpacing: '-1px',
              }}>{text}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
