# Video Agent — 视频渲染器

读取分镜稿，通过 Remotion (React) 渲染为 MP4 视频，可选混入配音音轨。

---

## 功能说明

Video Agent 负责视频创作的**第三阶段**：

1. 将任务目录中的 `storyboard.json` 同步到 `video/public/`（Remotion 的静态资源目录）
2. 调用 `npx remotion render KnowledgeVideo` 启动无头 Chromium 渲染，输出静音 MP4
3. 若 `voiceover.mp3` 存在，调用 ffmpeg 将音频混入视频（保留视频编码，AAC 音频）
4. 将最终 `video.mp4` 保存到任务目录

> **依赖**: 须先完成 Script Agent（storyboard.json 必须存在）；混音须先完成 Audio Agent

---

## 核心文件

| 文件 | 作用 |
|------|------|
| `agents/video_render_agent.py` | VideoRenderAgent 主逻辑：同步文件、调用渲染、混音 |
| `orchestrator/renderer.py` | Remotion CLI 封装：`npx remotion render` 调用、帧数估算 |
| `orchestrator/tts_client.py` | `merge_audio_into_video()`：ffmpeg 音视频合并 |
| `video/` | Remotion React 项目（完整源码）|
| `video/src/compositions/KnowledgeVideo.tsx` | 主合成：SceneRouter 按类型分派场景组件 |
| `video/src/scenes/*.tsx` | 7 种场景组件（TitleScene, BulletScene 等）|
| `video/src/utils/springs.ts` | Remotion spring 动画预设 |

---

## 使用方法

### 单独运行（仅渲染视频）

```bash
cd /data/dzj/hackthon/video_agent/video-agent

# 渲染当前任务（自动混入配音，若存在）
python main.py video

# 渲染但不混入音频
python main.py video --no-audio

# 渲染指定任务
python main.py video --task task_20260328_222753
```

### Remotion 预览（浏览器实时预览）

```bash
cd /data/dzj/hackthon/video_agent/video-agent/video
npm install       # 首次需要安装依赖
npx remotion studio   # 浏览器打开 http://localhost:3000
```

### 直接调用 Remotion CLI

```bash
cd /data/dzj/hackthon/video_agent/video-agent/video
npx remotion render KnowledgeVideo ../workspace/output.mp4
```

---

## 输出产物

```
workspace/tasks/{task_id}/
└── video.mp4                    # 最终输出（含音轨，若有配音）

video/public/
├── storyboard.json              # 渲染时读取的分镜数据
└── assets/                      # 场景配图（渲染时加载）
```

---

## Remotion React 项目结构

```
video/
├── package.json                 # Node 依赖（Remotion 4.0、React 18）
├── remotion.config.ts           # Remotion 配置
├── src/
│   ├── index.ts                 # 入口：注册合成
│   ├── Root.tsx                 # 根合成：读取 storyboard.json，计算帧数
│   ├── types.ts                 # TypeScript 类型（镜像 Python Pydantic 模型）
│   ├── compositions/
│   │   └── KnowledgeVideo.tsx   # 主合成：SceneRouter + 场景帧偏移计算
│   ├── scenes/
│   │   ├── TitleScene.tsx       # 开场标题（4-5s）
│   │   ├── BulletScene.tsx      # 要点列表（stagger 动画，8-12s）
│   │   ├── SplitScene.tsx       # 左图右文（8-12s）
│   │   ├── ImageScene.tsx       # 全屏大图（Ken Burns 缩放，4-6s）
│   │   ├── DiagramScene.tsx     # 流程图（节点+箭头动画，10-14s）
│   │   ├── StepScene.tsx        # 步骤卡片（10-14s）
│   │   └── OutroScene.tsx       # 结尾（4-5s）
│   └── utils/
│       ├── springs.ts           # Spring 动画配置（Remotion useSpring 预设）
│       ├── timing.ts            # 帧/秒换算工具函数
│       └── fonts.ts             # Google Fonts 集成
└── public/
    ├── storyboard.json          # 运行时读取（由 Python 同步）
    └── assets/                  # 场景图片（由 ScriptAgent 同步）
```

---

## 渲染参数

| 参数 | 值 |
|------|---|
| 分辨率 | 1920×1080 |
| 帧率 | 30 fps |
| 场景过渡 | 15帧 淡入淡出 |
| 渲染并发 | 2（`--concurrency=2`）|
| 浏览器 | Chromium headless（`--no-sandbox`）|
| 视频编码 | H.264（Remotion 默认）|
| 音频编码 | AAC（ffmpeg 混音）|

---

## 渲染工作流程图

```
输入：workspace/tasks/{id}/storyboard.json
    ↓
同步到 video/public/storyboard.json
同步到 video/public/assets/（图片）
    ↓
npx remotion render KnowledgeVideo
    ↓
Root.tsx 读取 storyboard.json
    ↓ calculateMetadata() 计算总帧数
KnowledgeVideo.tsx 按场景分派组件
    ↓
7种场景组件各自渲染
（Spring动画 + 主题色 + 配图）
    ↓
Chromium headless 逐帧截图
    ↓
输出：silent_video.mp4
    ↓（若 voiceover.mp3 存在）
ffmpeg -i silent.mp4 -i voiceover.mp3
      -c:v copy -c:a aac -shortest
    ↓
输出：workspace/tasks/{id}/video.mp4
    ↓
更新 task.json 阶段状态 video=completed
```

---

## 场景动画说明

每种场景组件实现独立的进场动画：

| 场景 | 动画效果 |
|------|---------|
| TitleScene | 标题淡入缩放 + 副标题上滑 |
| BulletScene | 要点逐条交错滑入（stagger） |
| SplitScene | 左侧图片滑入 + 右侧文字渐显 |
| ImageScene | Ken Burns 缓慢放大效果 |
| DiagramScene | 节点依次弹出 + 连线逐渐绘出 |
| StepScene | 步骤卡片逐一弹入 |
| OutroScene | 文字淡入 + 轻微缩放 |

---

## 环境依赖

```bash
# Node.js & Remotion
cd video && npm install

# 系统依赖（Ubuntu/Debian）
sudo apt-get install chromium-browser ffmpeg

# 验证
npx remotion --version
ffmpeg -version
```

---

## 常见问题

**Q: 渲染时报 "Chromium not found"？**
```bash
# 安装 Chromium
sudo apt-get install chromium-browser
# 或指定路径
export CHROMIUM_EXECUTABLE=/usr/bin/chromium
```

**Q: 渲染速度很慢？**
- 默认并发为 2，可在 `orchestrator/renderer.py` 中调整 `--concurrency`
- 场景数量越多渲染时间越长，每秒约需 1-3 秒渲染时间

**Q: 音视频对不上？**
- 检查 `voiceover.mp3` 总时长是否与视频时长接近
- ffmpeg 使用 `-shortest` flag，以较短的流为准截断
- 可通过 `--no-audio` 先验证纯视频效果
