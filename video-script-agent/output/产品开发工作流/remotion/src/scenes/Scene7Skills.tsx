import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Trophy, MagnifyingGlass, Users, FileText } from '@phosphor-icons/react';


const BG = 'linear-gradient(160deg, #0F0A00 0%, #1A1200 100%)';
const ACCENT = '#F97316';
const ACCENT_B = '#FDE68A';

const SKILLS = [
  { rank: '🥇', label: '判断优先级', desc: '100个需求只做10个，选哪些？', color: '#F97316', delay: 10 },
  { rank: '🥈', label: '用户洞察',   desc: '听懂用户背后的真实需求',       color: '#FB923C', delay: 30 },
  { rank: '🥉', label: '沟通协作',   desc: '跨团队推动，让事情发生',       color: '#FBBF24', delay: 50 },
];

export const Scene7Skills: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 200 } });
  const footerOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 80 });

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
        position: 'absolute', top: 250, right: -80,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)',
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
          <Trophy size={28} weight="duotone" color={ACCENT} />
          <span style={{ color: ACCENT, fontSize: 28, fontWeight: 700 }}>PM 核心技能排行榜</span>
        </div>
      </div>

      {/* 技能列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', marginTop: 50 }}>
        {SKILLS.map(({ rank, label, desc, color, delay }, i) => {
          const x = interpolate(
            spring({ frame, fps, config: { damping: 80, stiffness: 160 }, delay }),
            [0, 1], [-200, 0]
          );
          const opacity = spring({ frame, fps, config: { damping: 200 }, delay });

          return (
            <div key={i} style={{
              transform: `translateX(${x}px)`,
              opacity,
              background: `${color}0e`,
              border: `1.5px solid ${color}40`,
              borderRadius: 22,
              padding: '28px 40px',
              display: 'flex', alignItems: 'center', gap: 24,
            }}>
              <span style={{ fontSize: 48, flexShrink: 0 }}>{rank}</span>
              <div>
                <p style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 800 }}>{label}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, marginTop: 4 }}>{desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 写需求文档 排名 */}
      <div style={{
        marginTop: 28, width: '100%',
        opacity: footerOpacity,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 16,
          padding: '18px 36px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <FileText size={32} weight="light" color="rgba(255,255,255,0.25)" />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 26 }}>
            写需求文档… 第 6 名 😅
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
