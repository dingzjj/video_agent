import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { MagnifyingGlass, ListChecks, PuzzlePiece, Rocket, ArrowClockwise, ArrowDown } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

const STEPS = [
  { icon: MagnifyingGlass, label: '① 发现问题', color: '#F97316' },
  { icon: ListChecks,      label: '② 定义需求', color: '#FB923C' },
  { icon: PuzzlePiece,     label: '③ 设计方案', color: '#FBBF24' },
  { icon: Rocket,          label: '④ 开发上线', color: '#FDE68A' },
  { icon: ArrowClockwise,  label: '⑤ 迭代优化', color: '#F97316' },
];

export const Scene3Flow: React.FC = () => {
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
        position: 'absolute', bottom: 200, right: -80,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 标题 */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        textAlign: 'center', opacity: titleOpacity,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 28, fontWeight: 600 }}>
          产品开发 5 步工作流
        </p>
        <p style={{ color: ACCENT_B, fontSize: 22, fontWeight: 500, marginTop: 8 }}>
          PM 贯穿全程
        </p>
      </div>

      {/* 步骤列表 */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 0,
        width: '100%', marginTop: 60,
      }}>
        {STEPS.map(({ icon: Icon, label, color }, i) => {
          const delay = i * 28;
          const stepScale = spring({
            frame, fps,
            config: { damping: 80, stiffness: 180 },
            delay,
          });
          const stepX = interpolate(stepScale, [0, 1], [-120, 0]);
          const arrowOpacity = spring({
            frame, fps,
            config: { damping: 200 },
            delay: delay + 18,
          });

          return (
            <div key={i}>
              <div style={{
                transform: `translateX(${stepX}px) scale(${stepScale})`,
                background: `${color}10`,
                border: `1.5px solid ${color}40`,
                borderRadius: 20,
                padding: '28px 40px',
                display: 'flex', alignItems: 'center', gap: 28,
              }}>
                <div style={{
                  width: 76, height: 76, borderRadius: '50%',
                  background: `${color}18`,
                  border: `2px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={38} weight="duotone" color={color} />
                </div>
                <p style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 800 }}>{label}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div style={{
                  textAlign: 'center', padding: '6px 0',
                  opacity: arrowOpacity,
                }}>
                  <ArrowDown size={28} color="rgba(249,115,22,0.4)" weight="bold" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
