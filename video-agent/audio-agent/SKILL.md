# Audio Agent — 配音合成器

读取分镜稿，生成每个场景的口播文案，并通过 ElevenLabs TTS 合成音频文件。

---

## 功能说明

Audio Agent 负责视频创作的**第二阶段**：

1. 从当前任务的 `storyboard.json` 读取所有场景内容
2. 调用 Azure OpenAI 为每个场景生成自然语言口播稿（中文，约 4-5 字/秒节奏）
3. 调用 ElevenLabs API 将每段文案合成为独立 MP3 文件
4. 用 ffmpeg 将所有场景音频按顺序拼接为完整的 `voiceover.mp3`

> **依赖**: 须先完成 Script Agent（storyboard.json 必须存在）

---

## 核心文件

| 文件 | 作用 |
|------|------|
| `agents/voiceover_agent.py` | VoiceoverAgent 主逻辑：生成口播稿、调用 TTS、合并音频 |
| `orchestrator/claude_client.py` | `generate_voiceover_script()` / `refine_voiceover_script()` |
| `orchestrator/tts_client.py` | ElevenLabs SDK 封装 + ffmpeg 音频拼接/混合操作 |
| `orchestrator/schemas.py` | `VoiceoverScript`、`SceneNarration` Pydantic 模型 |
| `orchestrator/prompts/voiceover_prompt.txt` | 口播生成系统提示词（场景节奏、语言风格规范）|

---

## 使用方法

### 单独运行（仅生成配音）

```bash
cd /data/dzj/hackthon/video_agent/video-agent

# 为当前任务生成配音（需先运行 script）
python main.py voiceover

# 修改当前任务的口播稿
python main.py voiceover --suggestion "语气更活泼，少用书面语"

# 对指定任务生成配音
python main.py voiceover --task task_20260328_222753
```

### 跳过配音（静音视频）

```bash
python main.py all "概念" --skip-voiceover   # 完整流水线，跳过配音阶段
python main.py video --no-audio               # 渲染阶段不混入音频
```

---

## 输出产物

```
workspace/tasks/{task_id}/
├── voiceover_script.json        # 每个场景的口播文案
└── audio/
    ├── scene_0.mp3              # 场景0的独立音频
    ├── scene_1.mp3              # 场景1的独立音频
    ├── ...
    └── voiceover.mp3            # 所有场景拼接后的完整音频
```

---

## 口播稿 JSON 结构

```json
{
  "language": "zh-CN",
  "scenes": [
    {
      "scene_id": "scene_0",
      "text": "当两个粒子发生纠缠，无论相距多远，测量其中一个，另一个会瞬间响应——这就是量子纠缠。"
    },
    {
      "scene_id": "scene_1",
      "text": "量子纠缠有三个令人震惊的特点：粒子可以跨越任意距离保持关联；测量一个粒子会瞬间影响另一个；爱因斯坦将这称为鬼魅般的超距作用。"
    }
    // ...
  ]
}
```

---

## 口播风格规范（来自 voiceover_prompt.txt）

| 场景类型 | 口播要求 |
|---------|---------|
| `title` | 1句引人入胜的开场钩子 |
| `bullet` | 2-3句流畅叙述（不要读成列表格式）|
| `split` | 2-3句聚焦核心洞见（呼应画面和文字）|
| `image` | 1-2句氛围感描述或感性点评 |
| `diagram` | 逐步讲解关系（点名关键节点）|
| `step` | 每个步骤一句自然语言说明 |
| `outro` | 1-2句有力的收尾金句 |

**节奏基准**：中文 4-5字/秒，英文 3词/秒，配合场景 `duration_seconds` 控制字数

---

## 环境变量

```env
# 必填：Azure OpenAI（生成口播文案）
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2025-04-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# 选填：ElevenLabs（TTS 合成，不填则跳过音频合成）
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # 默认：Rachel（支持多语言）
```

### ElevenLabs 音频参数

| 参数 | 值 |
|------|---|
| 模型 | `eleven_multilingual_v2` |
| 采样率 | 44100 Hz |
| 码率 | 128 kbps |
| 格式 | MP3 |

---

## 工作流程图

```
输入：workspace/tasks/{id}/storyboard.json
    ↓
claude_client.py → Azure OpenAI GPT-4
    ↓ (生成每个场景的口播文案)
Pydantic 校验 → VoiceoverScript 对象
    ↓
写入 voiceover_script.json
    ↓
tts_client.py → ElevenLabs API
    ↓ (每个场景独立合成 MP3)
scene_0.mp3, scene_1.mp3, ...
    ↓
ffmpeg → 按场景顺序拼接
    ↓
输出：audio/voiceover.mp3
    ↓
更新 task.json 阶段状态 voiceover=completed
    ↓ 标记下游 video=stale
```

---

## 常见问题

**Q: ElevenLabs 未配置时会怎样？**
- Audio Agent 会跳过 TTS 合成阶段，仅生成 `voiceover_script.json`
- Video Agent 渲染时自动生成静音视频

**Q: 如何更换音色？**
- 在 `.env` 中修改 `ELEVENLABS_VOICE_ID`
- ElevenLabs 控制台可查看所有可用 Voice ID

**Q: 如何调整口播语速？**
- 修改 `orchestrator/prompts/voiceover_prompt.txt` 中的字数控制指引
- 或在 `--suggestion` 中直接说明："语速放慢，每句话增加停顿"
