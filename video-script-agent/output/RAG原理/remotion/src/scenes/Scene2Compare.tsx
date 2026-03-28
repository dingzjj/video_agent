import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

export const Scene2Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 左右同时从两侧滑入，snappy感
  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 22, stiffness: 220 }, delay: 5 }),
    [0, 1], [-400, 0]
  );
  const rightX = interpolate(
    spring({ frame, fps, config: { damping: 22, stiffness: 220 }, delay: 15 }),
    [0, 1], [400, 0]
  );
  const labelOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 35 });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 60px', fontFamily: FONT,
    }}>
      {/* 中间分割线 */}
      <div style={{
        position: 'absolute',
        top: '15%', bottom: '15%',
        left: '50%', width: 1,
        background: 'rgba(255,255,255,0.08)',
      }} />

      <div style={{ display: 'flex', gap: 32, width: '100%', alignItems: 'center' }}>
        {/* 左：普通 AI — 极简，只说核心 */}
        <div style={{
          flex: 1, transform: `translateX(${leftX}px)`,
          textAlign: 'center', padding: '0 20px',
        }}>
          <p style={{ fontSize: 80, marginBottom: 24 }}>📚</p>
          <p style={{
            fontSize: 44, fontWeight: 900, color: '#FF6B6B',
            marginBottom: 20, letterSpacing: '-1px',
          }}>
            闭卷考试
          </p>
          <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            只靠训练时<br />记住的东西
          </p>
        </div>

        {/* 右：RAG */}
        <div style={{
          flex: 1, transform: `translateX(${rightX}px)`,
          textAlign: 'center', padding: '0 20px',
        }}>
          <p style={{ fontSize: 80, marginBottom: 24 }}>📖</p>
          <p style={{
            fontSize: 44, fontWeight: 900, color: '#4ADE80',
            marginBottom: 20, letterSpacing: '-1px',
          }}>
            开卷考试
          </p>
          <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            答题前先去<br />查资料
          </p>
        </div>
      </div>

      {/* 底部大字点睛 */}
      <div style={{
        position: 'absolute', bottom: 140,
        textAlign: 'center', width: '100%',
        opacity: labelOpacity,
      }}>
        <p style={{
          fontSize: 32, color: 'rgba(255,255,255,0.35)',
          fontWeight: 500, letterSpacing: '2px',
        }}>
          RAG 选择了开卷
        </p>
      </div>
    </AbsoluteFill>
  );
};
