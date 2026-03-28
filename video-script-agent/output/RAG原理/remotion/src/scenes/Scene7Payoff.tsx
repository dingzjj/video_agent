import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

// Payoff：极简全屏大字，暖色，有余韵
export const Scene7Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 1.2 } });
  const subOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 20 });
  const lineOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 35 });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 80px', fontFamily: FONT,
    }}>
      {/* 暖光晕 */}
      <div style={{
        position: 'absolute', top: '45%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)',
      }} />

      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        {/* 超大核心词 */}
        <h1 style={{
          fontSize: 130, fontWeight: 900,
          color: '#FF6B35',
          lineHeight: 1, marginBottom: 24,
          letterSpacing: '-4px',
        }}>
          查了再答
        </h1>

        <p style={{
          fontSize: 40, color: 'rgba(255,255,255,0.4)',
          fontWeight: 400, marginBottom: 0,
          opacity: subOpacity, letterSpacing: '2px',
        }}>
          这就是 RAG
        </p>
      </div>

      {/* 品牌底条，暖色 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #FF6B35, #FFD166, #4ADE80)',
        opacity: lineOpacity,
      }} />
    </AbsoluteFill>
  );
};
