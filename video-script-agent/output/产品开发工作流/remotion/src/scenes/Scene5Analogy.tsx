import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { ForkKnife, ChefHat, Users } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #1C1917 0%, #292524 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

const LINES = [
  { text: 'PM 像餐厅经理', sub: null, icon: ForkKnife, color: ACCENT_B, delay: 0 },
  { text: '不需要会炒菜', sub: '（不需要会写代码）', icon: ChefHat, color: 'rgba(255,255,255,0.6)', delay: 25 },
  { text: '但要知道客人想吃什么', sub: '（要懂用户需求）', icon: Users, color: ACCENT, delay: 50 },
];

export const Scene5Analogy: React.FC = () => {
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
      {/* 暖调光晕 */}
      <div style={{
        position: 'absolute', top: 150, right: -80,
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 标题 */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        textAlign: 'center', opacity: titleOpacity,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 28, fontWeight: 600 }}>
          不会写代码，能做 PM 吗？
        </p>
      </div>

      {/* 三行类比 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', marginTop: 40 }}>
        {LINES.map(({ text, sub, icon: Icon, color, delay }, i) => {
          const lineScale = spring({ frame, fps, config: { damping: 80, stiffness: 160 }, delay });
          const lineOpacity = spring({ frame, fps, config: { damping: 200 }, delay });

          return (
            <div key={i} style={{
              transform: `scale(${lineScale})`,
              opacity: lineOpacity,
              background: i === 2 ? `rgba(249,115,22,0.10)` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${i === 2 ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 22,
              padding: '28px 40px',
              display: 'flex', alignItems: 'center', gap: 24,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `${color}18`,
                border: `2px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={36} weight="duotone" color={color} />
              </div>
              <div>
                <p style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, lineHeight: 1.3 }}>
                  {text}
                </p>
                {sub && (
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 24, marginTop: 6 }}>
                    {sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部结论 */}
      <div style={{
        position: 'absolute', bottom: 80, left: 60, right: 60,
        textAlign: 'center',
        opacity: spring({ frame, fps, config: { damping: 200 }, delay: 80 }),
      }}>
        <div style={{
          background: `rgba(253,230,138,0.10)`,
          border: `1.5px solid rgba(253,230,138,0.25)`,
          borderRadius: 16, padding: '20px 36px',
        }}>
          <p style={{ color: ACCENT_B, fontSize: 28, fontWeight: 700 }}>
            当然可以！理解用户 &gt; 技术能力 ✓
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
