# Video Agent — AI 视频生成系统

将一个文字概念自动转化为完整的带配音 MP4 视频。由三个独立 Agent 串联组成流水线。

---

## 功能模块目录

| 模块 | 目录 | 功能 |
|------|------|------|
| **Script Agent** | `script-agent/` | 概念 → 结构化分镜稿 + 配图下载 |
| **Audio Agent** | `audio-agent/` | 分镜稿 → 口播文案 + TTS 音频合成 |
| **Video Agent** | `video-agent/` | 分镜稿 + 音频 → Remotion 渲染 MP4 |

每个模块的详细使用说明见各目录下的 `SKILL.md`：
- [`script-agent/SKILL.md`](script-agent/SKILL.md) — 脚本生成器完整文档
- [`audio-agent/SKILL.md`](audio-agent/SKILL.md) — 配音合成器完整文档
- [`video-agent/SKILL.md`](video-agent/SKILL.md) — 视频渲染器完整文档

---

## 快速开始

### 环境配置

```bash
# 1. 复制并填写环境变量
cp .env.example .env
# 编辑 .env，填入 Azure OpenAI 凭证（必填）和 ElevenLabs/Unsplash（选填）

# 2. 安装 Python 依赖
pip install -r requirements.txt

# 3. 安装 Node 依赖（视频渲染）
cd video && npm install && cd ..

# 4. 确认系统依赖
ffmpeg -version
chromium-browser --version   # 或 chromium --version
```

### 一键完整流水线

```bash
cd /data/dzj/hackthon/video_agent/video-agent

python main.py all "量子纠缠的原理与应用"
# 输出：workspace/tasks/{task_id}/video.mp4
```

### 分步运行

```bash
# Step 1: 生成分镜稿（→ storyboard.json + 配图）
python main.py script "人工智能如何改变医疗"

# Step 2: 生成配音（→ voiceover_script.json + 音频 MP3）
python main.py voiceover

# Step 3: 渲染视频（→ video.mp4，自动混入配音）
python main.py video
```

---

## 完整 CLI 参考

```bash
python main.py <subcommand> [options] [concept]

# 子命令
script   "概念"          # 仅生成分镜稿
voiceover                 # 仅生成配音（需先运行 script）
video                     # 仅渲染视频（需先运行 script）
all      "概念"          # 完整流水线（script → voiceover → video）
list                      # 列出所有历史任务

# 常用选项
--task TASK_ID            # 指定操作某个历史任务（不指定则用当前任务）
--suggestion "文字"       # 对当前阶段提出修改意见（触发 LLM 二次优化）
--skip-voiceover          # （all 命令）跳过配音阶段，直接渲染静音视频
--no-audio                # （video/all 命令）渲染时不混入音频
```

### 使用示例

```bash
# 新建任务
python main.py all "区块链技术入门"

# 修改当前任务的分镜
python main.py script --suggestion "第3个场景改为流程图，展示共识机制"

# 重新渲染（已有分镜，跳过 LLM 调用）
python main.py video

# 查看所有任务
python main.py list
```

---

## 整体数据流

```
输入：文字概念
    ↓
┌─────────────────────────────────┐
│  Script Agent (script-agent/)   │
│  Azure OpenAI → 生成分镜 JSON   │
│  Unsplash → 下载配图            │
│  → storyboard.json              │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  Audio Agent (audio-agent/)     │
│  Azure OpenAI → 生成口播文案    │
│  ElevenLabs → TTS 合成 MP3      │
│  ffmpeg → 拼接 voiceover.mp3   │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  Video Agent (video-agent/)     │
│  Remotion React → 渲染画面      │
│  ffmpeg → 混入音轨              │
│  → video.mp4                    │
└──────────────┬──────────────────┘
               ↓
输出：workspace/tasks/{task_id}/video.mp4
```

---

## 任务管理

系统使用 JSON 注册表追踪所有任务和阶段状态：

```
workspace/
├── task.json                        # 任务注册表（当前任务 + 所有历史）
└── tasks/
    └── task_20260328_222753/        # 每个任务的独立目录
        ├── storyboard.json          # 分镜稿
        ├── voiceover_script.json    # 口播文案
        ├── audio/
        │   ├── scene_*.mp3          # 各场景音频
        │   └── voiceover.mp3        # 合并音频
        └── video.mp4                # 最终输出
```

**阶段状态**：`pending` → `running` → `completed`（上游修改后下游自动标记为 `stale`）

---

## 环境变量一览

```env
# 必填：驱动分镜生成和口播文案
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2025-04-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# 选填：高质量配图（不填则使用占位图）
UNSPLASH_ACCESS_KEY=your_unsplash_client_id

# 选填：语音合成（不填则生成静音视频）
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # 默认 Rachel
```

---

## 系统依赖

| 依赖 | 用途 | 是否必须 |
|------|------|---------|
| Python 3.10+ | 运行所有 Agent | 必须 |
| Node.js 18+ / npm | Remotion 视频渲染 | 必须 |
| ffmpeg | 音视频合并 | 必须（有配音时）|
| Chromium | Remotion headless 渲染 | 必须 |
| Azure OpenAI | 分镜生成 + 口播文案 | 必须 |
| Unsplash API | 配图搜索 | 选填 |
| ElevenLabs API | TTS 语音合成 | 选填 |
