import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 重文字从下冲上来，有分量
  const y = interpolate(
    spring({ frame, fps, config: { damping: 18, stiffness: 80, mass: 1.5 } }),
    [0, 1], [120, 0]
  );
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const subOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 22 });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
    }}>
      {/* 暖色光晕，不是冷蓝 */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,160,50,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '0 80px', textAlign: 'center', opacity }}>
        {/* 超大疑问，不解释，制造悬念 */}
        <div style={{ transform: `translateY(${y}px)` }}>
          <h1 style={{
            fontSize: 110, fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.1, marginBottom: 0,
            letterSpacing: '-2px',
          }}>
            AI 说的
          </h1>
          <h1 style={{
            fontSize: 110, fontWeight: 900,
            color: '#FF6B35',
            lineHeight: 1.1, marginBottom: 48,
            letterSpacing: '-2px',
          }}>
            是真的吗？
          </h1>
        </div>

        <p style={{
          fontSize: 38, color: 'rgba(255,255,255,0.5)', fontWeight: 400,
          opacity: subOpacity, letterSpacing: '1px',
        }}>
          认识一下 RAG
        </p>
      </div>
    </AbsoluteFill>
  );
};
