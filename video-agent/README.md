# Knowledge Video Agent

将任意概念或脚本自动转化为教学动画视频。输入一句话，输出一段带动画的 MP4 知识讲解视频。

**技术栈：** Azure OpenAI GPT-4 · Python · Remotion (React) · Unsplash

---

## 效果示例

输入：`"量子纠缠"`

输出：一段约 60 秒的教学视频，包含标题动画、知识要点卡片、步骤分解、流程图、配图解说等场景。

---

## 架构

```
concept (文字)
    │
    ▼
[Azure OpenAI GPT-4]  ←  storyboard_prompt.txt (教学设计规范)
    │  生成 storyboard.json（场景列表）
    ▼
[Asset Retriever]  ←  Unsplash API (自动搜图)
    │  下载配图 → video/public/assets/
    ▼
[Remotion Renderer]  ←  React 场景组件
    │  npx remotion render → MP4
    ▼
workspace/output/*.mp4
```

### 场景类型

| 类型 | 说明 | 时长 |
|------|------|------|
| `title` | 标题开场，背景配图 + 标题 + 副标题钩子句 | 4-5s |
| `bullet` | 编号卡片列表，展示关键特征/性质 | 8-12s |
| `split` | 左图右文，含类比或真实案例 | 8-12s |
| `image` | 全屏图片 Ken Burns 动效 + 洞察字幕 | 4-6s |
| `diagram` | 流程图/关系图，节点 + 动画箭头 | 10-14s |
| `step` | 彩色步骤卡片，分解过程/机制 | 10-14s |
| `outro` | 结尾总结，留下核心洞察 | 4-5s |

---

## 快速开始

### 1. 安装依赖

```bash
bash scripts/setup.sh
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```env
# Azure OpenAI（必填）
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Unsplash（可选，不填则使用占位图）
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

### 3. 生成视频

```bash
# 完整流程：生成脚本 → 下载配图 → 渲染 MP4
python -m orchestrator.main "解释神经网络如何学习"

# 仅生成脚本，不渲染（用于预览/调试）
python -m orchestrator.main --dry-run "光合作用原理"

# 指定输出路径
python -m orchestrator.main --output ./my_video.mp4 "量子计算入门"
```

视频保存在 `workspace/output/` 目录下。

### 4. 在浏览器中预览

```bash
cd video && npx remotion studio
```

打开 `http://localhost:3000` 可实时查看和调试场景。

---

## 目录结构

```
hackthon/
├── orchestrator/           # Python 主控逻辑
│   ├── main.py             # 入口，四步流水线
│   ├── claude_client.py    # Azure OpenAI 调用，生成 storyboard.json
│   ├── asset_retriever.py  # Unsplash 图片下载
│   ├── renderer.py         # 调用 Remotion CLI 渲染
│   ├── schemas.py          # Pydantic 数据模型（storyboard 契约）
│   └── prompts/
│       └── storyboard_prompt.txt  # 教学设计 prompt
│
├── video/                  # React/Remotion 渲染层
│   └── src/
│       ├── scenes/         # 7 种场景 React 组件
│       │   ├── TitleScene.tsx
│       │   ├── BulletScene.tsx
│       │   ├── SplitScene.tsx
│       │   ├── ImageScene.tsx
│       │   ├── DiagramScene.tsx
│       │   ├── StepScene.tsx
│       │   └── OutroScene.tsx
│       ├── compositions/
│       │   └── KnowledgeVideo.tsx  # 场景调度，读取 storyboard.json
│       ├── types.ts         # 共享类型定义
│       └── utils/
│           ├── springs.ts   # Remotion spring 动画配置
│           └── timing.ts    # 帧时间工具
│
├── workspace/              # 运行时产物
│   ├── storyboard.json     # 最近一次生成的脚本（参考用）
│   ├── assets/             # 下载的图片缓存
│   └── output/             # 渲染输出的 MP4
│
├── scripts/
│   └── setup.sh            # 一键安装脚本
└── requirements.txt
```

---

## 扩展开发

### 新增场景类型

1. 在 `video/src/types.ts` 的 `SceneType` 联合类型中添加新类型名
2. 在 `orchestrator/schemas.py` 的 `SceneType` 中添加
3. 创建 `video/src/scenes/YourScene.tsx`
4. 在 `video/src/compositions/KnowledgeVideo.tsx` 的 `SceneRouter` 中添加 case
5. 在 `storyboard_prompt.txt` 中说明新场景的用法和 JSON 格式

### 修改视觉风格

- 场景动画参数：`video/src/utils/springs.ts`
- 各场景布局和配色：`video/src/scenes/*.tsx`
- AI 生成的主题色由 prompt 控制，每个视频自动匹配主题情绪

### 替换 LLM

当前使用 Azure OpenAI。如需替换为其他 LLM，修改 `orchestrator/claude_client.py` 中的 `generate_storyboard()` 函数，保持返回 `Storyboard` 对象即可。

---

## 依赖

| 依赖 | 用途 |
|------|------|
| `openai` | Azure OpenAI API 客户端 |
| `pydantic` | storyboard JSON 校验 |
| `requests` | Unsplash 图片下载 |
| `python-dotenv` | 环境变量加载 |
| `remotion` | React 视频渲染框架 |
| `chromium` | Remotion 无头渲染所需 |
