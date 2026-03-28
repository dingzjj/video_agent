# AI 视频内容创作 Agent

> 进化酒馆 Hackathon 2026-03-28~29 · 赛道 01 Agentic 内容创作

输入一个概念或 URL，自动生成结构化视频脚本，渲染为带动画的 MP4 教学视频，并自动评分优化。

---

## 目录结构与分工

```
0328Hackthon/
├── README.md                      ← 本文件
├── CLAUDE.md                      ← 项目全局指引（AI Agent 工作流）
├── video-script-agent/            ← suansuan 负责：脚本生成 + Remotion 渲染 + EvoMap 接入
│   ├── output/                    ← 已生成的视频项目（RAG原理、产品开发工作流等）
│   ├── evomap/                    ← EvoMap 节点凭证 + 心跳脚本
│   ├── remotion-best-practices/   ← Remotion 最佳实践文档
│   └── docs/                      ← 项目文档
└── video-agent-dingzjj/           ← dingzjj 负责：多 Agent 架构 + 视频渲染流水线
    ├── agents/                    ← VideoGenerationAgent / VideoReviewAgent / OrchestratorAgent
    ├── orchestrator/              ← GPT-4 调用、图片获取、Remotion 渲染、Pydantic schema
    ├── video/                     ← React/Remotion 场景组件（7 种场景类型）
    ├── workspace/                 ← 运行时产物（storyboard.json、图片缓存、MP4）
    ├── main.py                    ← 主入口
    └── README.md                  ← 详细使用说明
```

---

## 三步工作流

```
概念/URL
   │
   ▼
[1] video-script-generator   →  script.json（画面+字幕+口播结构化脚本）
   │
   ▼
[2] video-producer           →  Remotion 视频项目（React 组件 + 动画）
   │
   ▼
[3] video-reviewer           →  评分报告 + 代码级自动修复
```

**方法论融合：**
- 得到品控标准（挑战定义 + 感性材料 ≥ 60%）
- 影视飓风 HKRR 理论（快乐 / 知识 / 共鸣 / 节奏）
- 何同学叙事结构（Hook → Journey → Payoff）

---

## 快速开始

### suansuan 的脚本生成器（Claude Code Skills）

```bash
# 生成视频脚本
/video-script-generator   # 输入概念/URL → 生成 output/[主题]/script.json

# 制作视频
/video-producer           # 读取 script.json → 生成 Remotion 项目

# 评分优化
/video-reviewer           # 对视频评分并自动修复
```

### dingzjj 的多 Agent 流水线

```bash
cd video-agent-dingzjj
bash scripts/setup.sh

# 一句话生成视频
python -m orchestrator.main "解释神经网络如何学习"

# 仅生成脚本（预览）
python -m orchestrator.main --dry-run "RAG原理"
```

---

## EvoMap 接入

- **平台**：[evomap.ai](https://evomap.ai)
- **node_id**：`node_442a7105e543e48f`
- **协议**：GEP-A2A v1.0.0
- **已发布**：Gene + Capsule + EvolutionEvent（声乐和声/合唱合成 Top10 错误）

心跳保活：
```bash
bash video-script-agent/evomap/heartbeat.sh
```

---

## 待优化项

### 核心功能
- [ ] **两套方案融合**：suansuan 的 script.json 格式与 dingzjj 的 storyboard.json 格式对齐，打通完整流水线
- [ ] **EvoMap 任务自动领取**：接入 `/a2a/fetch` + `/task/claim`，实现自动循环执行
- [ ] **视频评分闭环**：video-reviewer 的修复建议自动回流到下一轮生成

### 视频质量
- [ ] **口播音频合成**：当前只有画面，接入 TTS 生成配音
- [ ] **动效多样性**：减少重复的卡片堆叠布局，增加更多视觉叙事场景
- [ ] **中文字体**：确保 Remotion 渲染时中文字体正确加载

### 工程化
- [ ] **统一 LLM 配置**：dingzjj 用 Azure OpenAI，suansuan 用 Claude — 统一或支持切换
- [ ] **`.gitignore` 完善**：`__pycache__`、`node_modules`、`.env` 等不应提交
- [ ] **环境变量统一**：合并两边的 `.env` 配置，提供统一的 `.env.example`
- [ ] **Demo 脚本**：一键运行完整演示流程，现场备用

---

## 团队

| 成员 | 负责模块 |
|------|---------|
| suansuan | 视频脚本生成、Remotion 最佳实践、EvoMap 节点接入、技能工作流 |
| dingzjj | 多 Agent 架构、GPT-4 调用、Remotion 场景组件、渲染流水线 |

---

**提交截止：2026-03-29 16:00**
