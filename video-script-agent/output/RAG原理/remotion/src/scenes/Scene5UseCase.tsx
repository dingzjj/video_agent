import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif";

// 这场景：聚焦一个对话气泡，before/after 顺序展示，不是左右分屏
export const Scene5UseCase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 0 });
  const badOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 18 });
  const arrowOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 36 });
  const goodOpacity = spring({ frame, fps, config: { damping: 200 }, delay: 50 });

  const badY = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: 18 }),
    [0, 1], [30, 0]
  );
  const goodY = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 180 }, delay: 50 }),
    [0, 1], [30, 0]
  );

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0D0B08 0%, #1A1710 100%)',
      justifyContent: 'center', alignItems: 'center',
      padding: '100px 80px', fontFamily: FONT,
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* 用户提问气泡 */}
        <div style={{ opacity: questionOpacity, alignSelf: 'flex-end', maxWidth: '80%' }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '24px 24px 4px 24px',
            padding: '24px 36px',
          }}>
            <p style={{ fontSize: 32, color: '#FFFFFF' }}>你们产品怎么退款？</p>
          </div>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginTop: 8 }}>用户</p>
        </div>

        {/* 没有 RAG 的回答 */}
        <div style={{
          opacity: badOpacity, transform: `translateY(${badY}px)`,
          alignSelf: 'flex-start', maxWidth: '85%',
        }}>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>没有 RAG</p>
          <div style={{
            background: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.2)',
            borderRadius: '4px 24px 24px 24px',
            padding: '24px 36px',
          }}>
            <p style={{ fontSize: 30, color: '#FF8080', lineHeight: 1.5 }}>
              "抱歉，我不了解您的退款政策。"
            </p>
          </div>
        </div>

        {/* 箭头 */}
        <div style={{
          opacity: arrowOpacity, textAlign: 'center',
          fontSize: 28, color: 'rgba(255,255,255,0.2)',
        }}>加入 RAG ↓</div>

        {/* 有 RAG 的回答 */}
        <div style={{
          opacity: goodOpacity, transform: `translateY(${goodY}px)`,
          alignSelf: 'flex-start', maxWidth: '85%',
        }}>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>有 RAG</p>
          <div style={{
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: '4px 24px 24px 24px',
            padding: '24px 36px',
          }}>
            <p style={{ fontSize: 30, color: '#4ADE80', lineHeight: 1.5 }}>
              "根据服务手册第3页，7天内可申请全额退款……"
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
