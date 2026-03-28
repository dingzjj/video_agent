import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ChartLine, Users, PaintBrush, Code, Cpu } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

const TEAMS = [
  { icon: Cpu,       label: '算法团队', color: '#F97316' },
  { icon: PaintBrush,label: '设计团队', color: '#FB923C' },
  { icon: Code,      label: '前端团队', color: '#FBBF24' },
  { icon: ChartLine, label: '后端团队', color: '#FDE68A' },
];

export const Scene4Coord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 200 } });
  const featureOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 10 });

  // PM 中心节点
  const pmScale = spring({ frame, fps, config: { damping: 70, stiffness: 200 }, delay: 15 });

  // 四个团队
  const teamPositions = [
    { top: -130, left: -160 },
    { top: -130, right: -160 },
    { bottom: -130, left: -160 },
    { bottom: -130, right: -160 },
  ];

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
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 顶部功能卡片 */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        textAlign: 'center', opacity: featureOpacity,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: 'rgba(253,230,138,0.12)', border: '1.5px solid rgba(253,230,138,0.35)',
          borderRadius: 20, padding: '16px 36px',
        }}>
          <span style={{ fontSize: 32 }}>🛵</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: ACCENT_B, fontSize: 30, fontWeight: 800 }}>预计送达 25 分钟</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 500 }}>一个小功能，背后 4 支团队</p>
          </div>
        </div>
      </div>

      {/* 中心 PM 节点 + 四团队 */}
      <div style={{
        position: 'relative',
        width: 380,
        height: 380,
        marginTop: 60,
      }}>
        {/* 连线（十字形） */}
        {[0,1,2,3].map(i => {
          const lineOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 30 + i * 15 });
          const isTop = i < 2;
          const isLeft = i % 2 === 0;
          return (
            <div key={i} style={{
              position: 'absolute',
              top: isTop ? '50%' : undefined,
              bottom: !isTop ? '50%' : undefined,
              left: isLeft ? '15%' : undefined,
              right: !isLeft ? '15%' : undefined,
              width: '35%',
              height: 2,
              background: `rgba(249,115,22,0.35)`,
              opacity: lineOpacity,
              transform: `rotate(${isTop ? (isLeft ? -45 : 45) : (isLeft ? 45 : -45)}deg)`,
              transformOrigin: isLeft ? 'right center' : 'left center',
            }} />
          );
        })}

        {/* PM 中心 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${pmScale})`,
          width: 130, height: 130, borderRadius: '50%',
          background: `rgba(249,115,22,0.18)`,
          border: `3px solid ${ACCENT}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <Users size={40} weight="duotone" color={ACCENT} />
          <p style={{ color: ACCENT, fontSize: 22, fontWeight: 900, marginTop: 6 }}>PM</p>
        </div>

        {/* 四个团队角落 */}
        {TEAMS.map(({ icon: Icon, label, color }, i) => {
          const delay = 35 + i * 18;
          const teamScale = spring({ frame, fps, config: { damping: 80, stiffness: 180 }, delay });
          const pos = teamPositions[i];

          return (
            <div key={i} style={{
              position: 'absolute',
              ...pos,
              transform: `scale(${teamScale})`,
              background: `${color}12`,
              border: `1.5px solid ${color}40`,
              borderRadius: 18,
              padding: '18px 24px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
              width: 130,
            }}>
              <Icon size={38} weight="duotone" color={color} />
              <p style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>{label}</p>
            </div>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        textAlign: 'center',
        opacity: spring({ frame, fps, config: { damping: 200 }, delay: 80 }),
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 26, fontWeight: 500 }}>
          缺一支团队，功能就上不了线
        </p>
      </div>
    </AbsoluteFill>
  );
};
