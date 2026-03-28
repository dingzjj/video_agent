import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { MagnifyingGlass, Lightbulb, Star } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

const STEPS = [
  { icon: MagnifyingGlass, step: '用户调研', desc: '大家想要无压力打招呼', color: '#F97316', delay: 0 },
  { icon: Lightbulb,       step: '洞察提炼', desc: '不打扰，但让对方注意到', color: '#FBBF24', delay: 28 },
  { icon: Star,            step: '功能诞生', desc: '微信「拍一拍」上线',     color: '#FDE68A', delay: 56 },
];

export const Scene6Research: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 200 } });

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
        position: 'absolute', top: 200, left: -100,
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 标题 */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        textAlign: 'center', opacity: titleOpacity,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(249,115,22,0.10)', border: '1.5px solid rgba(249,115,22,0.3)',
          borderRadius: 999, padding: '12px 32px',
        }}>
          <span style={{ fontSize: 26 }}>💬</span>
          <span style={{ color: ACCENT, fontSize: 28, fontWeight: 700 }}>微信「拍一拍」的诞生</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 24, marginTop: 12 }}>
          好产品来自真实用户洞察
        </p>
      </div>

      {/* 三步流程 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', marginTop: 60 }}>
        {STEPS.map(({ icon: Icon, step, desc, color, delay }, i) => {
          const stepScale = spring({ frame, fps, config: { damping: 80, stiffness: 180 }, delay });
          const stepX = interpolate(stepScale, [0, 1], [-200, 0]);
          const arrowOpacity = spring({ frame, fps, config: { damping: 200 }, delay: delay + 20 });

          return (
            <div key={i}>
              <div style={{
                transform: `translateX(${stepX}px) scale(${stepScale})`,
                background: `${color}0e`,
                border: `2px solid ${color}40`,
                borderRadius: 22,
                padding: '32px 44px',
                display: 'flex', alignItems: 'center', gap: 28,
              }}>
                <div style={{
                  width: 84, height: 84, borderRadius: '50%',
                  background: `${color}18`,
                  border: `2px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={42} weight="duotone" color={color} />
                </div>
                <div>
                  <p style={{ color, fontSize: 34, fontWeight: 800, marginBottom: 6 }}>{step}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 26 }}>{desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  textAlign: 'center', padding: '10px 0',
                  opacity: arrowOpacity,
                  fontSize: 28, color: `rgba(249,115,22,0.4)`,
                }}>↓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部 */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        textAlign: 'center',
        opacity: spring({ frame, fps, config: { damping: 200 }, delay: 90 }),
      }}>
        <p style={{ color: ACCENT_B, fontSize: 26, fontWeight: 600 }}>
          发现「没被说出口的需求」= PM 最大价值
        </p>
      </div>
    </AbsoluteFill>
  );
};
