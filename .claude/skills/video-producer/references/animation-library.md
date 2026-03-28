# Remotion 动效库指南

## ⚠️ 铁律：动画必须用 useCurrentFrame()

```tsx
// ✅ 正确
import { useCurrentFrame, interpolate } from 'remotion';
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

// ❌ 错误 - CSS transitions 在 Remotion 中不会正确渲染
style={{ transition: 'opacity 0.3s' }}

// ❌ 错误 - Tailwind 动画类在 Remotion 中不会正确渲染
className="animate-fade-in transition-opacity"
```

**Tailwind 可用于布局和颜色，但 `transition-*` 和 `animate-*` 类绝对禁止。**

---

## Spring 动画预设

**spring() 默认配置是 `{ mass: 1, damping: 10, stiffness: 100 }`，有弹跳效果。**

四种标准预设，按场景选用：

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 平滑无弹跳（标题出现、内容淡入）—— 最常用
const smooth = spring({ frame, fps, config: { damping: 200 } });

// 快弹最小弹跳（UI 元素、卡片弹入）
const snappy = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });

// 明显弹跳（活泼动画、emoji、数字）
const bouncy = spring({ frame, fps, config: { damping: 8 } });

// 沉重缓慢（大标题、警示文字）
const heavy = spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 } });
```

### 带延迟的 spring（推荐用 delay 参数）

```tsx
// ✅ 推荐：用 delay 参数
const step2 = spring({ frame, fps, config: { damping: 200 }, delay: 25 });
const step3 = spring({ frame, fps, config: { damping: 200 }, delay: 50 });

// ⚠️ 也可以，但 delay 参数更简洁
const step2 = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 200 } });
```

### spring + interpolate 组合（映射到自定义范围）

```tsx
import { spring, interpolate } from 'remotion';

const progress = spring({ frame, fps, config: { damping: 200 } });

// 从左滑入（-200px → 0）
const x = interpolate(progress, [0, 1], [-200, 0]);

// 旋转进入
const rotate = interpolate(progress, [0, 1], [-15, 0]);

<div style={{ transform: `translateX(${x}px) rotate(${rotate}deg)` }} />
```

### 出入场合并（进入 + 退出）

```tsx
const { durationInFrames } = useVideoConfig();

const inAnim = spring({ frame, fps, config: { damping: 200 } });
const outAnim = spring({
  frame, fps,
  config: { damping: 200 },
  delay: durationInFrames - 1 * fps,  // 最后 1 秒开始退出
});

const scale = inAnim - outAnim;  // 进入弹出，退出缩回
```

---

## Interpolate 插值

```tsx
import { interpolate, Easing } from 'remotion';

// 基础线性（务必加 clamp 防止越界）
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// 加缓动（先慢后快再慢）
const y = interpolate(frame, [0, 30], [60, 0], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Bezier 曲线（最精细控制）
const scale = interpolate(frame, [0, 25], [0.8, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),  // Expo out
  extrapolateRight: 'clamp',
});
```

---

## 文字动效

### 打字机效果（标准实现）

**用 string slicing，不要用 per-character opacity。**

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

const CHAR_FRAMES = 2;  // 每 2 帧打一个字

export const Typewriter = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsToShow = Math.floor(frame / CHAR_FRAMES);
  const displayText = text.slice(0, charsToShow);

  // 光标闪烁
  const BLINK_FRAMES = 16;
  const cursorOpacity = interpolate(
    frame % BLINK_FRAMES,
    [0, BLINK_FRAMES / 2, BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span>
      {displayText}
      <span style={{ opacity: cursorOpacity }}>▌</span>
    </span>
  );
};
```

### 关键词高亮（spring 擦除效果）

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

// 用 scaleX 从左到右擦出高亮色块
export const WordHighlight = ({
  word,
  color,
  delay = 30,
  duration = 18,
}: {
  word: string;
  color: string;
  delay?: number;
  duration?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame, fps,
    config: { damping: 200 },
    delay,
    durationInFrames: duration,
  });
  const scaleX = Math.max(0, Math.min(1, progress));

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* 高亮色块从左向右擦出 */}
      <span style={{
        position: 'absolute',
        left: 0, right: 0, top: '50%',
        height: '1.05em',
        transform: `translateY(-50%) scaleX(${scaleX})`,
        transformOrigin: 'left center',
        backgroundColor: color,
        borderRadius: '0.15em',
        zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{word}</span>
    </span>
  );
};

// 使用示例
// <p>RAG 就是让 AI <WordHighlight word="查资料" color="#F97316" delay={20} /> 再说话</p>
```

---

## Sequence 时序规范

### premountFor 必须用 fps

```tsx
// ✅ 正确
<Sequence from={0} durationInFrames={210} premountFor={1 * fps}>
  <Scene1 />
</Sequence>

// ❌ 错误 - hardcode 30 在 fps 不同时会出错
<Sequence from={0} durationInFrames={210} premountFor={30}>
```

### 用 Series 简化顺序排列

```tsx
import { Series } from 'remotion';

// ✅ 推荐：Series 自动计算 from，不用手算帧数
<Series>
  <Series.Sequence durationInFrames={210} premountFor={fps}>
    <Scene1Hook />
  </Series.Sequence>
  <Series.Sequence durationInFrames={330} premountFor={fps}>
    <Scene2Content />
  </Series.Sequence>
</Series>

// ⚠️ 不推荐：手动算 from 容易出错
<Sequence from={0} durationInFrames={210}><Scene1 /></Sequence>
<Sequence from={210} durationInFrames={330}><Scene2 /></Sequence>
```

---

## 场景转场（TransitionSeries）

```bash
npx remotion add @remotion/transitions
```

```tsx
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

// Fade 淡入淡出（最常用）
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={210} premountFor={fps}>
    <Scene1Hook />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={330} premountFor={fps}>
    <Scene2Content />
  </TransitionSeries.Sequence>
</TransitionSeries>

// Slide 滑动（方向：from-left / from-right / from-top / from-bottom）
<TransitionSeries.Transition
  presentation={slide({ direction: 'from-bottom' })}
  timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
/>

// ⚠️ 注意：转场会缩短总时长
// 两段 60f + 一个 15f 转场 = 105f，不是 120f
```

---

## 字体加载（必须正确加载，否则渲染时用默认字体）

```bash
npx remotion add @remotion/google-fonts
```

```tsx
// ✅ 正确：在组件文件顶层调用 loadFont()，它会阻塞渲染直到字体就绪
import { loadFont } from '@remotion/google-fonts/DMSans';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700', '900'],
  subsets: ['latin'],
});

export const MyScene = () => {
  return (
    <div style={{ fontFamily }}>
      内容
    </div>
  );
};

// ❌ 错误：直接写字符串，渲染时会 fallback 到系统字体
style={{ fontFamily: 'DM Sans' }}
```

### 各主题推荐字体（google-fonts 包名）

| 主题 | 包名 | 使用 |
|------|------|------|
| Vercel 工业黑 | `@remotion/google-fonts/DMSans` | 标题+正文 |
| Stripe 现代数字 | `@remotion/google-fonts/SpaceGrotesk` | 标题+正文 |
| 摩登复古 | `@remotion/google-fonts/PlayfairDisplay` | 标题 |
| 工业橙 | `@remotion/google-fonts/DMSans` | 标题+正文 |
| 霓虹赛博 | `@remotion/google-fonts/SpaceMono` | 标题+正文 |
