import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Translate, ArrowRight, Horse, Car } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

export const Scene2Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 200 } });

  // 左侧用户气泡
  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 80, stiffness: 160 }, delay: 10 }),
    [0, 1], [-250, 0]
  );
  const leftOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 10 });

  // 箭头
  const arrowScale = spring({ frame, fps, config: { damping: 80, stiffness: 200 }, delay: 30 });

  // 右侧PM翻译
  const rightX = interpolate(
    spring({ frame, fps, config: { damping: 80, stiffness: 160 }, delay: 50 }),
    [0, 1], [250, 0]
  );
  const rightOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 50 });

  // 底部标签
  const tagOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 70 });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
        padding: '0 60px',
      }}
    >
      {/* 光晕 */}
      <div style={{
        position: 'absolute', top: 300, left: -80,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 标题 */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(249,115,22,0.10)', border: '1.5px solid rgba(249,115,22,0.3)',
          borderRadius: 999, padding: '12px 32px',
        }}>
          <Translate size={28} weight="duotone" color={ACCENT} />
          <span style={{ color: ACCENT, fontSize: 28, fontWeight: 700 }}>PM = 翻译官</span>
        </div>
      </div>

      <div style={{ width: '100%', marginTop: 60 }}>
        {/* 用户说 */}
        <div style={{
          transform: `translateX(${leftX}px)`,
          opacity: leftOpacity,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          padding: '36px 44px',
          marginBottom: 24,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, fontWeight: 500, marginBottom: 12 }}>
            📢 用户说：
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Horse size={56} weight="duotone" color="rgba(255,255,255,0.5)" />
            <p style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 800, lineHeight: 1.3 }}>
              「我想要一匹<br />更快的马」
            </p>
          </div>
        </div>

        {/* 箭头 */}
        <div style={{
          textAlign: 'center',
          transform: `scale(${arrowScale})`,
          marginBottom: 24,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: `rgba(249,115,22,0.15)`,
            border: `1.5px solid rgba(249,115,22,0.4)`,
            borderRadius: 999, padding: '10px 28px',
          }}>
            <span style={{ color: ACCENT, fontSize: 28, fontWeight: 700 }}>PM 翻译</span>
            <ArrowRight size={28} weight="bold" color={ACCENT} />
          </div>
        </div>

        {/* PM 翻译结果 */}
        <div style={{
          transform: `translateX(${rightX}px)`,
          opacity: rightOpacity,
          background: `rgba(249,115,22,0.10)`,
          border: `2px solid rgba(249,115,22,0.4)`,
          borderRadius: 24,
          padding: '36px 44px',
        }}>
          <p style={{ color: ACCENT, fontSize: 24, fontWeight: 500, marginBottom: 12 }}>
            💡 用户真正需要：
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Car size={56} weight="duotone" color={ACCENT} />
            <p style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 800, lineHeight: 1.3 }}>
              「更快到达<br />目的地」
            </p>
          </div>
          <p style={{ color: ACCENT_B, fontSize: 26, fontWeight: 600, marginTop: 16 }}>
            答案可能是汽车，不是马 🚗
          </p>
        </div>
      </div>

      {/* 底部标签 */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        textAlign: 'center', opacity: tagOpacity,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 26, fontWeight: 500 }}>
          听懂需求背后的需求，才是 PM 的核心
        </p>
      </div>
    </AbsoluteFill>
  );
};
