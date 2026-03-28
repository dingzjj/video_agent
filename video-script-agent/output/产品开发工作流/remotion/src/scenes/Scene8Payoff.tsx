import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Sparkle } from '@phosphor-icons/react';


const BG = 'linear-gradient(135deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

export const Scene8Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 150 } });
  const line2Opacity = spring({ frame, fps, config: { damping: 200 }, delay: 20 });
  const line3Opacity = spring({ frame, fps, config: { damping: 200 }, delay: 40 });
  const subOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 60 });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
        padding: '0 80px',
      }}
    >
      {/* 中心光晕 */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(249,115,22,0.12)', border: '1.5px solid rgba(249,115,22,0.35)',
          borderRadius: 999, padding: '14px 36px', marginBottom: 56,
        }}>
          <Sparkle size={28} weight="duotone" color={ACCENT} />
          <span style={{ color: ACCENT, fontSize: 28, fontWeight: 700 }}>一句话记住</span>
        </div>

        {/* 主文字 */}
        <h1 style={{ fontSize: 76, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 0 }}>
          PM 不是
        </h1>
        <div style={{ opacity: line2Opacity }}>
          <h1 style={{ fontSize: 76, fontWeight: 900, color: 'rgba(255,255,255,0.5)', lineHeight: 1.25, marginBottom: 0 }}>
            写文档的人
          </h1>
        </div>
        <div style={{ opacity: line3Opacity }}>
          <h1 style={{ fontSize: 76, fontWeight: 900, color: ACCENT, lineHeight: 1.25 }}>
            把痛点变成现实的人
          </h1>
        </div>

        {/* 分割线 */}
        <div style={{
          width: 120, height: 5, borderRadius: 3,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_B})`,
          margin: '36px auto',
          opacity: subOpacity,
        }} />

        {/* 小文字 */}
        <p style={{
          fontSize: 38, color: 'rgba(255,255,255,0.6)',
          fontWeight: 700, lineHeight: 1.5,
          opacity: subOpacity,
        }}>
          如果你对这件事感兴趣<br />
          <span style={{ color: ACCENT_B }}>你已经有最重要的素质了 ✨</span>
        </p>
      </div>

      {/* 品牌底条 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
        background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_B}, ${ACCENT})`,
      }} />
    </AbsoluteFill>
  );
};
