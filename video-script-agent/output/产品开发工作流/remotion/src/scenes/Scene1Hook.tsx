import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Warning } from '@phosphor-icons/react';


// 工业橙主题色
const BG = 'linear-gradient(135deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 75, stiffness: 180 } });
  const line1Opacity = spring({ frame, fps, config: { damping: 200 } });
  const line2Opacity = spring({ frame, fps, config: { damping: 200 }, delay: 20 });
  const subOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 40 });

  const glowY = interpolate(frame, [0, 210], [0, -20], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
      }}
    >
      {/* 光晕装饰 */}
      <div style={{
        position: 'absolute',
        top: 200 + glowY,
        left: -100,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 300,
        right: -80,
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(253,230,138,0.1) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* 主内容 */}
      <div style={{
        transform: `scale(${scale})`,
        padding: '0 80px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(249,115,22,0.12)',
          border: '1.5px solid rgba(249,115,22,0.35)',
          borderRadius: 999,
          padding: '10px 28px',
          marginBottom: 52,
        }}>
          <Warning size={28} weight="duotone" color={ACCENT} />
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 26, fontWeight: 600 }}>
            你遇到过这个问题吗
          </span>
        </div>

        {/* 大标题第一行 */}
        <div style={{ opacity: line1Opacity }}>
          <h1 style={{
            fontSize: 100,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            你以为产品经理
          </h1>
        </div>

        {/* 大标题第二行 */}
        <div style={{ opacity: line2Opacity }}>
          <h1 style={{
            fontSize: 100,
            fontWeight: 900,
            color: ACCENT,
            lineHeight: 1.2,
            marginBottom: 40,
          }}>
            就是写需求文档？
          </h1>
        </div>

        {/* 强调线 */}
        <div style={{
          width: 120,
          height: 5,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_B})`,
          margin: '0 auto 40px',
          borderRadius: 3,
        }} />

        {/* 副标题 */}
        <p style={{
          fontSize: 44,
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 700,
          lineHeight: 1.4,
          opacity: subOpacity,
        }}>
          其实他们 80% 的时间在做<br />
          <span style={{ color: ACCENT_B }}>另一件事</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
