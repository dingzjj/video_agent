# Script Agent — 脚本生成器

将文字概念转化为结构化视频分镜（storyboard），并自动抓取配图。

---

## 功能说明

Script Agent 负责视频创作的**第一阶段**：

1. 调用 Azure OpenAI (GPT-4) 根据概念生成 JSON 格式的分镜稿（storyboard）
2. 为每个场景通过 Unsplash API 搜索并下载配图（无 API Key 时降级为 picsum 占位图）
3. 将生成的 `storyboard.json` 写入当前任务目录，并同步到 `video/public/` 供 Remotion 读取

---

## 核心文件

| 文件 | 作用 |
|------|------|
| `agents/script_agent.py` | ScriptAgent 主逻辑：生成分镜、抓图、写文件 |
| `orchestrator/claude_client.py` | Azure OpenAI 封装：`generate_storyboard()` / `refine_storyboard()` |
| `orchestrator/asset_retriever.py` | Unsplash 图片搜索与下载，失败自动降级 |
| `orchestrator/schemas.py` | Pydantic 数据模型：`Storyboard`、`Scene`、`Theme` 等 |
| `orchestrator/prompts/storyboard_prompt.txt` | GPT-4 系统提示词（场景类型规则、JSON Schema、教育质量标准） |

---

## 使用方法

### 单独运行（仅生成脚本）

```bash
cd /data/dzj/hackthon/video_agent/video-agent

# 新概念 → 生成分镜
python main.py script "量子纠缠的原理与应用"

# 对当前任务的分镜提出修改意见
python main.py script --suggestion "增加更多实际案例，减少抽象概念"

# 对指定任务修改
python main.py script --task task_20260328_222753 --suggestion "将第3个场景改为图表类型"
```

### 作为完整流水线的一部分

```bash
python main.py all "量子计算入门"          # script → voiceover → video
python main.py all --skip-voiceover "概念"  # script → video（跳过配音）
```

---

## 输出产物

```
workspace/tasks/{task_id}/
├── storyboard.json              # 主输出：8-10个场景的完整分镜
├── storyboard_iter_1.json       # 修改历史（每次refinement保存一个版本）
└── assets/
    ├── scene_0_*.jpg            # 每个需要图片的场景下载的配图
    ├── scene_2_*.jpg
    └── ...

video/public/
├── storyboard.json              # 同步副本（Remotion 读取此文件渲染）
└── assets/                      # 同步的图片资源
```

---

## 分镜 JSON 结构

```json
{
  "title": "量子纠缠：超距作用的秘密",
  "total_duration_seconds": 75,
  "fps": 30,
  "resolution": {"width": 1920, "height": 1080},
  "theme": {
    "primary_color": "#1E3A5F",
    "accent_color": "#4CAF50",
    "background_color": "#0D1B2A",
    "font_family": "Inter",
    "text_color": "#FFFFFF"
  },
  "scenes": [
    {
      "id": "scene_0",
      "type": "title",
      "duration_seconds": 4,
      "animation": "fade_zoom_in",
      "title": "量子纠缠",
      "subtitle": "两个粒子如何跨越宇宙瞬间通信？",
      "image_query": "quantum physics particles"
    },
    {
      "id": "scene_1",
      "type": "bullet",
      "duration_seconds": 10,
      "animation": "stagger_slide_up",
      "heading": "三个关键事实",
      "bullets": ["粒子可以跨越任意距离保持关联", "测量一个粒子会瞬间影响另一个", "爱因斯坦称之为"鬼魅般的超距作用""]
    }
    // ... 更多场景
  ]
}
```

### 支持的场景类型

| type | 适用内容 | 时长 |
|------|---------|------|
| `title` | 开场标题+副标题+背景图 | 4-5s |
| `bullet` | 要点列表（2-4条，每条≤20字）| 8-12s |
| `split` | 左图右文，适合举例说明 | 8-12s |
| `image` | 全屏大图+说明文字（Ken Burns 效果）| 4-6s |
| `diagram` | 流程图（2-4个节点+连线+标签）| 10-14s |
| `step` | 步骤卡片（2-4步，每步≤25字）| 10-14s |
| `outro` | 结尾总结金句 | 4-5s |

### 支持的动画类型

`fade_zoom_in` · `stagger_slide_up` · `slide_in_right` · `scale_bounce` · `type_reveal` · `draw_in` · `float_up`

---

## 环境变量

```env
# 必填：Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2025-04-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# 选填：Unsplash（不填则使用 picsum 占位图）
UNSPLASH_ACCESS_KEY=your_unsplash_client_id
```

---

## 工作流程图

```
输入：概念文字（或已有分镜 + 修改意见）
    ↓
claude_client.py → Azure OpenAI GPT-4
    ↓ (JSON with response_format=json_object)
Pydantic 校验 → Storyboard 对象
    ↓
asset_retriever.py → Unsplash API → 下载 JPG
    ↓ (fallback → picsum.photos)
写入 workspace/tasks/{id}/storyboard.json
    ↓
同步到 video/public/storyboard.json
    ↓
更新 task.json 阶段状态 script=completed
    ↓ 标记下游 voiceover/video=stale
输出：storyboard.json 路径
```
