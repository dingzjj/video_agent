---
name: video-producer
description: 接收 script.json，使用 Remotion 生成视频项目。使用 spring 动画、渐变背景、组件模板，输出美观的视频。
---

# 视频制作器

## 触发条件
- 用户说"制作视频" / "生成视频" / "用 Remotion 做视频"
- video-script-generator 完成后用户选择"制作视频"

## 输入
读取 `output/[主题名]/script.json`

## 核心原则
1. 优先用 `<Series>` 排列场景，不要手动硬算 from 帧数
2. 所有时间写法用 `1 * fps`，不要硬编码帧数
3. premountFor 必须写 `premountFor={1 * fps}`，不要写 `premountFor={30}`
4. 文字动画用 string slicing，不要用 per-character opacity
5. 用 style={} 写具体色值，用主题配色系统，不写蓝紫色
6. 使用 spring 动画，参考 animation-library.md 的四种标准预设
7. **CSS transitions 和 Tailwind `animate-*` / `transition-*` 类 FORBIDDEN**，Remotion 不渲染
8. 参考组件模板，不要从零开始
9. 使用 Phosphor Icons（@phosphor-icons/react），优先 `weight="duotone"`
10. 字体必须用 `@remotion/google-fonts` 的 `loadFont()` 加载，不要写裸字符串

## 工作流程

### Step 0: 读取 references（必读，顺序不能错）
1. `references/design-guide.md` → 确定主题配色（先看这个）
2. `references/animation-library.md` → spring 预设 + 文字动效 + 转场规则
3. `references/component-templates.md` → 直接复用的场景组件

### Step 1: 读取脚本
从 script.json 读取：
- meta（fps, width, height, duration）
- scenes（每个分镜的 startFrame, durationInFrames）

### Step 2: 生成项目结构
```
output/[主题名]/remotion/
├── src/
│   ├── Root.tsx
│   ├── Video.tsx
│   ├── scenes/
│   │   ├── TitleScene.tsx
│   │   ├── ContentScene.tsx
│   │   └── TakeawayScene.tsx
│   └── index.ts
├── package.json
├── remotion.config.ts
└── tailwind.config.js
```

### Step 3: 生成场景组件
**根据 visual.type 选择模板**：
- hook → TitleScene（渐变背景 + spring 缩放）
- content → ContentScene（typewriter + 滑入）
- takeaway → TakeawayScene（渐变背景 + 弹跳）

**必须使用 spring 动画**：
```tsx
const scale = spring({
  frame,
  fps,
  config: { damping: 100 },
});
```

**必须使用主题配色系统**（见 `references/design-guide.md`），**严禁蓝紫色渐变**：
```tsx
// 根据视频主题选择对应主题，用 style 而非 className 写具体色值
style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}
```

### Step 4: 生成 package.json
```json
{
  "name": "video-project",
  "scripts": {
    "start": "remotion studio",
    "render": "remotion render Video out/video.mp4"
  },
  "dependencies": {
    "remotion": "^4.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@phosphor-icons/react": "^2.1.7",
    "@remotion/google-fonts": "^4.0.0",
    "@remotion/transitions": "^4.0.0"
  },
  "devDependencies": {
    "@remotion/cli": "^4.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

### Step 5: 生成 tailwind.config.js
```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 交付口径
```
Remotion 项目已生成！

📁 位置：output/[主题名]/remotion/
🎨 特性：渐变背景 + spring 动画 + Tailwind CSS
🎬 预览：cd remotion && npm install && npm run start
🎥 渲染：npm run render

浏览器会自动打开 http://localhost:3000
```

## 美化清单
- [ ] 使用渐变背景（不用纯色）
- [ ] 使用 spring 动画（不用线性）
- [ ] 文字有 typewriter 效果
- [ ] 标题有缩放/弹跳动画
- [ ] 安全边距 px-12 或 px-20
- [ ] 字号层级清晰（text-6xl / text-4xl / text-2xl）

## 常见问题

**Q: 如何选择渐变配色？**
A: 根据视频主题从 `references/design-guide.md` 的五套主题中选一套，严格使用对应色值。技术类→Vercel黑，金融类→Stripe深，文化类→摩登复古，科普类→工业橙，赛博类→霓虹深色。

**Q: spring 参数如何调整？**
A: damping: 100（标准），stiffness: 200（快速），mass: 0.5（轻盈）。
