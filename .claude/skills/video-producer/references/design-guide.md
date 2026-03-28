# Remotion 设计美化指南

## ⚠️ 铁律（违反即返工）

### 禁止蓝紫色渐变
- 禁止：`from-blue-500 to-purple-600`、`#6366f1`、`#8b5cf6` 等
- 必须：从以下五套主题中选一套，使用 `style={}` 写具体色值

### 禁止"AI味"布局
这些是 AI 生成 PPT 的典型特征，必须避免：
- ❌ 一屏放三张相同结构的卡片（图标+标题+描述）
- ❌ 所有场景背景颜色相同（全黑到底）
- ❌ 每屏信息超过 2 个核心点
- ❌ 低透明度卡片背景（`rgba(color, 0.06)`）—— 不纯不透，最难看
- ❌ 所有场景用同一种布局结构

### 必须做到
- ✅ **每屏只传递 1 个核心信息**，宁可信息少，不要信息密
- ✅ **背景要有节奏变化**：奇数场景纯黑，偶数场景用主题深色彩背景交替
- ✅ **字号要大**：主标题最少 80px，重点词最少 100px
- ✅ **颜色要决断**：要么大胆用纯色块（opacity > 0.15），要么完全不用背景色
- ✅ **布局要有变化**：大字场景 → 卡片场景 → 大字场景，交替出现，给眼睛节奏感

### 背景交替规则
```
Scene 1 (Hook)      → 纯黑 #000000，强调色光晕
Scene 2 (对比)      → 主题彩色深背景（如深红/深蓝各半）
Scene 3 (类比)      → 纯黑，大字为主
Scene 4 (流程)      → 主题强调色深背景（如 #0a1628）
Scene 5 (场景)      → 纯黑，对比布局
Scene 6 (结论)      → 主题强调色背景（如 #0f0a00）
Scene 7 (Payoff)    → 纯黑，极简大字
```

---

## 五套配色主题

### 1. Vercel 工业黑（技术/AI/代码类）
**适用**：RAG、大模型、开发工具、技术科普

```
背景：#000000 → #111111（极暗渐变）
主文字：#FFFFFF
辅助文字：#888888
强调色A：#FFFFFF（反转高亮）
强调色B：#0070F3（Electric Blue，仅点缀用）
卡片背景：rgba(255,255,255,0.05)
卡片边框：rgba(255,255,255,0.1)
装饰光晕：rgba(0,112,243,0.15)
```

### 2. Stripe 现代数字（金融/商业/SaaS类）
**适用**：稳定币、区块链、商业分析、投资科普

```
背景：#0A2540 → #0d2f4f（深海蓝，非紫）
主文字：#FFFFFF
辅助文字：rgba(255,255,255,0.6)
强调色A：#00D4FF（青色）
强调色B：#635BFF（靛蓝，仅用于图标点缀）
卡片背景：rgba(255,255,255,0.07)
卡片边框：rgba(0,212,255,0.2)
装饰光晕：rgba(0,212,255,0.1)
```

### 3. 摩登复古（人文/历史/书评/纪录片类）
**适用**：文化解读、历史、书单、慢内容

```
背景：#1C1917 → #292524（深暖灰）
主文字：#F5F0E8（米白）
辅助文字：#A8A29E
强调色A：#F97316（暖橙）
强调色B：#84CC16（草绿点缀）
卡片背景：rgba(245,240,232,0.06)
卡片边框：rgba(249,115,22,0.25)
装饰光晕：rgba(249,115,22,0.12)
```

### 4. 工业橙（科普/教育/产品类）
**适用**：原理讲解、产品介绍、How-to 教程

```
背景：#0F0A00 → #1A1200（极暗暖黑）
主文字：#FFFFFF
辅助文字：rgba(255,255,255,0.65)
强调色A：#F97316（橙）
强调色B：#FDE68A（金黄）
卡片背景：rgba(249,115,22,0.08)
卡片边框：rgba(249,115,22,0.3)
装饰光晕：rgba(249,115,22,0.15)
```

### 5. 霓虹赛博（游戏/数码/动感类）
**适用**：游戏解说、数码评测、赛博风格

```
背景：#050814 → #0B0E1A（极深蓝黑）
主文字：#FFFFFF
辅助文字：rgba(255,255,255,0.6)
强调色A：#00FBFF（荧光青）
强调色B：#FF007F（霓虹粉）
卡片背景：rgba(0,251,255,0.05)
卡片边框：rgba(0,251,255,0.2)
装饰光晕：rgba(0,251,255,0.1)
```

---

## 主题选择规则

| 视频主题关键词 | 推荐主题 |
|---|---|
| AI、代码、技术、模型、RAG | Vercel 工业黑 |
| 金融、区块链、稳定币、投资 | Stripe 现代数字 |
| 历史、文化、书评、人文 | 摩登复古 |
| 科普、原理、教程、产品 | 工业橙 |
| 游戏、数码、赛博、动感 | 霓虹赛博 |

---

## 字体系统

### 推荐字体组合（按主题）
```css
/* Vercel 工业黑 / 工业橙 */
font-family: 'DM Sans', 'Inter', sans-serif;

/* Stripe 现代数字 */
font-family: 'Space Grotesk', 'Inter', sans-serif;

/* 摩登复古 */
font-family: 'Playfair Display', 'Georgia', serif;  /* 标题 */
font-family: 'DM Sans', sans-serif;                 /* 正文 */

/* 霓虹赛博 */
font-family: 'Chakra Petch', 'Space Mono', monospace;
```

### 字号层级（1080×1920 竖屏）
- 超大冲击标题：`fontSize: 96-120px`，`fontWeight: 900`
- 大标题：`fontSize: 64-80px`，`fontWeight: 800`
- 副标题：`fontSize: 40-48px`，`fontWeight: 700`
- 正文说明：`fontSize: 28-32px`，`fontWeight: 400`
- 小标注：`fontSize: 22-26px`，`fontWeight: 500`

---

## 装饰元素规范

### 光晕装饰（必用）
```tsx
// 每个场景至少放 1-2 个光晕，增加景深感
<div style={{
  position: 'absolute',
  top: 200, left: -100,
  width: 400, height: 400,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)',
  pointerEvents: 'none',
}} />
```

### 卡片组件
```tsx
// 统一卡片风格：毛玻璃 + 细描边
<div style={{
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 24,
  padding: '36px 48px',
  backdropFilter: 'blur(12px)',
}} />
```

### 强调标签（Badge）
```tsx
<div style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(强调色,0.15)',
  border: '1.5px solid rgba(强调色,0.35)',
  borderRadius: 999,
  padding: '10px 28px',
  fontSize: 26,
  fontWeight: 700,
  color: '强调色',
}} />
```

---

## Icon 使用规范（Phosphor Icons）

### 安装
```bash
npm install @phosphor-icons/react
```

### 引入方式
```tsx
import { Lightning, Brain, MagnifyingGlass, CheckCircle, Warning } from '@phosphor-icons/react';
```

### 使用规则
- **默认用 `Regular` weight**（标准线条）
- **重点强调用 `Duotone`**（双色，视觉层次更丰富）
- **极简场景用 `Light`**（细线条，高级感）
- 尺寸：主图标 `64-96px`，配套图标 `36-48px`
- 颜色跟随当前主题强调色

```tsx
// Regular
<Lightning size={72} color="#F97316" />

// Duotone（推荐用于重点场景）
<Lightning size={72} weight="duotone" color="#F97316" />

// Light（用于装饰性图标）
<Brain size={48} weight="light" color="rgba(255,255,255,0.4)" />
```

---

## 安全边距
- 左右：`padding: '0 80px'`（手机竖屏标准）
- 上下：顶部 80-100px，底部 80-100px 留给品牌/字幕

## 品牌底条（可选）
```tsx
// 每个视频结尾场景底部加渐变条，增强品牌感
<div style={{
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  height: 6,
  background: 'linear-gradient(90deg, 强调色A, 强调色B)',
}} />
```
