import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

// 这场景改为：全屏大字逐步揭示，不用卡片列表
export const Scene4Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const r = spring({ frame, fps, config: { damping: 200 }, delay: 0 });
  const a = spring({ frame, fps, config: { damping: 200 }, delay: 22 });
  const g = spring({ frame, fps, config: { damping: 200 }, delay: 44 });
  const descOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 66 });

  const ROWS = [
    { letter: 'R', word: 'Retrieval', zh: '检索', color: '#FF6B35', anim: r },
    { letter: 'A', word: 'Augmented', zh: '增强', color: '#FFD166', anim: a },
    { letter: 'G', word: 'Generation', zh: '生成', color: '#4ADE80', anim: g },
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      justifyContent: 'center', alignItems: 'flex-start',
      padding: '160px 80px', fontFamily: FONT,
    }}>
      <div style={{ width: '100%' }}>
        {ROWS.map(({ letter, word, zh, color, anim }) => (
          <div key={letter} style={{
            display: 'flex', alignItems: 'baseline', gap: 24,
            marginBottom: 32,
            opacity: anim,
            transform: `translateX(${interpolate(anim, [0, 1], [-40, 0])}px)`,
          }}>
            {/* 大字母 */}
            <span style={{
              fontSize: 100, fontWeight: 900, color,
              lineHeight: 1, width: 90, flexShrink: 0,
            }}>{letter}</span>
            {/* 英文 + 中文 */}
            <div>
              <p style={{ fontSize: 36, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{word}</p>
              <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{zh}</p>
            </div>
          </div>
        ))}

        {/* 底部一句话总结 */}
        <div style={{
          marginTop: 48, opacity: descOpacity,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 40,
        }}>
          <p style={{ fontSize: 32, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            先查，再融合，再输出
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
