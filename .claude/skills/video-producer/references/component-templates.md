# Remotion 组件模板（反 AI 味版）

> **核心原则**：每屏只放 1 个核心信息。宁可场景多，不要信息密。

## 安装依赖

```bash
npm install @phosphor-icons/react @remotion/google-fonts @remotion/transitions
```

---

## 布局类型选择指南

| 场景类型 | 推荐布局 | 禁止用法 |
|----------|----------|----------|
| Hook 开场 | 大字冲击型 | 卡片列表 |
| 概念解释 | 大字逐句型 / 打字机 | 三卡片并排 |
| 流程步骤 | 逐步大字（一步一屏或一步占满） | 三栏卡片堆叠 |
| 对比场景 | 左右分屏（字要大） | 小字卡片对比 |
| 结尾升华 | 极简大字 | 任何列表 |

---

## 模板 1：大字冲击型（Hook / 重点观点）

**适用**：开场、单个核心观点、警示、Payoff

一屏只放一句话，字要大，背景要深，用光晕制造焦点。

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont('normal', { weights: ['700', '900'], subsets: ['latin'] });

export const BigWordScene = ({ line1, line2, accent = '#0070F3' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 75, stiffness: 180 } });
  const line2Opacity = spring({ frame, fps, config: { damping: 100 }, delay: 18 });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      alignItems: 'center', justifyContent: 'center',
      fontFamily, padding: '0 80px',
    }}>
      {/* 光晕 —— 制造焦点感 */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        {/* 主句：超大 */}
        <h1 style={{
          fontSize: 96, fontWeight: 900, color: '#FFFFFF',
          lineHeight: 1.2, marginBottom: 24,
        }}>
          {line1}
        </h1>

        {/* 强调线 */}
        <div style={{
          width: 80, height: 5, background: accent,
          margin: '0 auto 32px', borderRadius: 3,
        }} />

        {/* 副句：稍小但仍然大 */}
        <p style={{
          fontSize: 52, fontWeight: 700,
          color: accent, lineHeight: 1.3,
          opacity: line2Opacity,
        }}>
          {line2}
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 模板 2：逐句打字型（概念解释 / 流程步骤）

**适用**：解释原理、拆解步骤、关键词定义

每句话独占大面积，spring 依次弹入。**不用卡片边框**，直接大字裸排。

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont('normal', { weights: ['700', '900'], subsets: ['latin'] });

const LINES = [
  { text: '① 你提问', sub: '输入你的问题', color: '#FFFFFF' },
  { text: '② AI 去查资料', sub: '知识库语义检索', color: '#0070F3' },
  { text: '③ 带资料回答你', sub: '有据可查，不乱编', color: '#22C55E' },
];

export const StepByStepScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: '#000000',
      justifyContent: 'center', alignItems: 'flex-start',
      fontFamily, padding: '120px 80px',
    }}>
      {/* 场景小标题 */}
      <p style={{
        position: 'absolute', top: 80, left: 80,
        color: 'rgba(255,255,255,0.35)', fontSize: 28, fontWeight: 600,
        opacity: spring({ frame, fps, config: { damping: 100 } }),
      }}>
        RAG 三步走
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}>
        {LINES.map(({ text, sub, color }, i) => {
          const delay = i * 28;
          const y = interpolate(
            spring({ frame, fps, config: { damping: 200 }, delay }),
            [0, 1], [40, 0]
          );
          const opacity = spring({ frame, fps, config: { damping: 100 }, delay });

          return (
            <div key={i} style={{ transform: `translateY(${y}px)`, opacity }}>
              {/* 主文字：极大 */}
              <p style={{
                fontSize: 72, fontWeight: 900,
                color, lineHeight: 1.1, marginBottom: 8,
              }}>
                {text}
              </p>
              {/* 辅助说明：小一号，不抢眼 */}
              <p style={{
                fontSize: 32, color: 'rgba(255,255,255,0.45)',
                fontWeight: 500, paddingLeft: 4,
              }}>
                {sub}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

---

## 模板 3：左右分屏对比型

**适用**：有 RAG vs 没有 RAG、闭卷 vs 开卷、好 vs 差

两侧字号要大，颜色对比要强，不要堆砌文字。

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';
import { XCircle, CheckCircle } from '@phosphor-icons/react';

const { fontFamily } = loadFont('normal', { weights: ['700', '900'], subsets: ['latin'] });

export const SplitCompareScene = ({
  leftLabel, leftPoints,
  rightLabel, rightPoints,
  leftColor = '#FF4444', rightColor = '#22C55E',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 200 }, delay: 5 }),
    [0, 1], [-120, 0]
  );
  const rightX = interpolate(
    spring({ frame, fps, config: { damping: 200 }, delay: 15 }),
    [0, 1], [120, 0]
  );

  return (
    <AbsoluteFill style={{ background: '#050505', fontFamily, flexDirection: 'row' }}>
      {/* 左侧 */}
      <div style={{
        flex: 1,
        background: `linear-gradient(180deg, #1a0000 0%, #050505 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px',
        transform: `translateX(${leftX}px)`,
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}>
        <XCircle size={72} weight="duotone" color={leftColor} style={{ marginBottom: 24 }} />
        <p style={{ color: leftColor, fontSize: 44, fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>
          {leftLabel}
        </p>
        {leftPoints.map((pt, i) => (
          <p key={i} style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 28,
            fontWeight: 600, textAlign: 'center', lineHeight: 1.5, marginBottom: 12,
          }}>
            {pt}
          </p>
        ))}
      </div>

      {/* 右侧 */}
      <div style={{
        flex: 1,
        background: `linear-gradient(180deg, #001a08 0%, #050505 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px',
        transform: `translateX(${rightX}px)`,
      }}>
        <CheckCircle size={72} weight="duotone" color={rightColor} style={{ marginBottom: 24 }} />
        <p style={{ color: rightColor, fontSize: 44, fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>
          {rightLabel}
        </p>
        {rightPoints.map((pt, i) => (
          <p key={i} style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 28,
            fontWeight: 600, textAlign: 'center', lineHeight: 1.5, marginBottom: 12,
          }}>
            {pt}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

---

## 模板 4：关键词高亮大字型（单句强调）

**适用**：打出最重要的那句话，某个词需要特别强调

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont('normal', { weights: ['700', '900'], subsets: ['latin'] });

// 高亮色块从左向右 spring 擦出
const WordHighlight = ({ word, color, delay = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 200 }, delay });
  const scaleX = Math.max(0, Math.min(1, progress));

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{
        position: 'absolute', left: 0, right: 0, top: '50%',
        height: '1.1em',
        transform: `translateY(-50%) scaleX(${scaleX})`,
        transformOrigin: 'left center',
        backgroundColor: color,
        borderRadius: '0.12em', zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1, color: '#000' }}>{word}</span>
    </span>
  );
};

export const HighlightScene = ({ prefix, highlight, suffix, highlightColor = '#0070F3' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, config: { damping: 100 } });

  return (
    <AbsoluteFill style={{
      background: '#000000',
      alignItems: 'center', justifyContent: 'center',
      fontFamily, padding: '0 80px',
    }}>
      <div style={{ opacity, textAlign: 'center' }}>
        <h1 style={{ fontSize: 88, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.3 }}>
          {prefix}
          <WordHighlight word={highlight} color={highlightColor} delay={20} />
          {suffix}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
// 示例：<HighlightScene prefix="RAG = 让 AI " highlight="查了再答" suffix="" />
```

---

## 模板 5：Payoff 结尾极简型

**适用**：最后一幕，极简，只留下最重要的一句话

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont('normal', { weights: ['700', '900'], subsets: ['latin'] });

export const PayoffScene = ({ line1, accentWord, line2, accent = '#0070F3' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 80, stiffness: 150 } });
  const line2Opacity = spring({ frame, fps, config: { damping: 100 }, delay: 15 });

  return (
    <AbsoluteFill style={{
      background: '#000000',
      alignItems: 'center', justifyContent: 'center',
      fontFamily, padding: '0 80px',
    }}>
      {/* 光晕 */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
      }} />

      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        <h1 style={{ fontSize: 80, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
          {line1}<br />
          <span style={{ color: accent }}>{accentWord}</span>
        </h1>

        <div style={{ opacity: line2Opacity }}>
          <div style={{
            width: 80, height: 4, borderRadius: 2, margin: '32px auto',
            background: `linear-gradient(90deg, ${accent}, #22C55E)`,
          }} />
          <p style={{ fontSize: 44, color: 'rgba(255,255,255,0.7)', fontWeight: 700, lineHeight: 1.4 }}>
            {line2}
          </p>
        </div>
      </div>

      {/* 品牌底条 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
        background: `linear-gradient(90deg, ${accent}, #22C55E, ${accent})`,
      }} />
    </AbsoluteFill>
  );
};
```

---

## 场景布局节奏参考

好的视频节奏 = **冲击 → 解释 → 冲击 → 解释 → 收尾**

```
Scene 1: 大字冲击（Hook）         → 模板1
Scene 2: 左右对比                 → 模板3
Scene 3: 逐句大字（类比/解释）    → 模板2
Scene 4: 逐句大字（流程步骤）     → 模板2
Scene 5: 左右对比（场景举例）     → 模板3
Scene 6: 关键词高亮（警示/结论）  → 模板4
Scene 7: 极简 Payoff              → 模板5
```

**不要连续两个场景用同一个模板。**
