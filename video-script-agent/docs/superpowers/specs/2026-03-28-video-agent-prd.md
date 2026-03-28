# ConceptClip · 概念动效视频生成 Agent — PRD 草稿

> 版本：v0.1 草稿 · 2026-03-28 · 待队友确认
> 赛道：01 Agentic 内容创作

---

## 一、产品定位

### 一句话描述
输入一个概念或脚本，自动生成带动效的知识讲解视频。

### 目标用户
- **C 端**：知识科普类博主，需要动效素材辅助讲解（补充素材 or 完整生成）
- **B 端**：教育类产品/公司，批量生产课程素材

### 核心价值
- 降低动效视频制作门槛：从"需要设计师 + After Effects"变成"输入一句话"
- 速度：分钟级生成，传统制作需要数天
- 可进化：每次生成的脚本策略和视频模板通过 EvoMap Gene 沉淀，越用越好

---

## 二、输入 & 输出

### 输入（两种模式）

| 模式 | 输入内容 | 说明 |
|------|----------|------|
| **概念模式** | 一句话概念，如"帮我讲解什么是 RAG" | 系统自动生成完整脚本和视频 |
| **脚本模式** | 用户提供写好的旁白文稿 | 系统根据文稿生成配套动效 |

可选附加输入（待确认）：
- 风格偏好（学术 / 科技 / 轻松）
- 时长限制（60s / 3min / 自由）
- 参考视频上传（用于风格学习，**待调研**）

### 输出

| 输出物 | 格式 | 说明 |
|--------|------|------|
| 动效视频 | MP4 | 主输出，有或无配音（待定） |
| 字幕文件 | SRT | 供用户自行配音/二次编辑 |
| 旁白脚本 | TXT/JSON | 可复用、可编辑 |
| EvoMap Gene | JSON（GEP 协议） | 每次生成后发布，沉淀策略 |

---

## 三、待确认事项（供队友讨论）

- [ ] 是否接入数字人 API（HeyGen 等）还是纯 TTS 配音
- [ ] 是否支持用户上传参考视频做风格拆解，预处理要达到什么程度
- [ ] 视频时长和分辨率规格（横屏 16:9 / 竖屏 9:16）
- [ ] B 端是否需要批量接口（一次输入多个概念）
- [ ] Gene 发布的触发时机：每次生成后自动发？还是用户确认后发？

---

## 四、系统架构方案

### 方案 A：单 Agent 串行 Pipeline（最简 / 兜底）

```
用户输入
    ↓
[脚本生成 Agent]
  Claude 拆解输入 → 场景JSON + 旁白文本
    ↓
[渲染 Agent]
  Remotion 按场景JSON生成动效视频
    ↓
[配音 Agent]（可选）
  TTS API 生成音频 → ffmpeg 合并
    ↓
输出：MP4 + SRT
```

**优点**：逻辑最简单，24小时内必能跑通
**缺点**：串行等待时间长；动效上限受预制模板约束
**适合**：Demo 兜底，或时间不够时降级

---

### 方案 B：双 Agent 并行 Pipeline（推荐）

```
用户输入
    ↓
[脚本生成 Agent]
  Claude → 场景JSON + 旁白文本（同一份脚本同时给下游）
    ├─────────────────────┐
    ↓                     ↓
[渲染 Agent]        [配音 Agent]
  Remotion              TTS API
  → 无声视频            → 音频文件 + SRT字幕
    └─────────────────────┘
                ↓
         [合并 Agent]
           ffmpeg 合并视频 + 音频
                ↓
         输出：MP4 + SRT
```

**优点**：视频和配音并行，效率更高；字幕独立输出；多 Agent 协作符合 A2A 比赛主题
**缺点**：需要 ffmpeg 合并层，部署稍复杂
**适合**：主线方案，Demo 展示 Agent 协作

---

### 方案 C：多引擎路由 Pipeline（进阶 / 进化路径）

```
用户输入
    ↓
[脚本生成 Agent]
  Claude → 场景JSON（含 type 字段标注内容类型）
    ↓
[引擎路由 Agent]
  根据场景类型选择渲染引擎：
  ├─ 流程图 / 通用概念  → Remotion
  ├─ 数学 / 算法        → Motion Canvas 或 Manim
  └─ 插画 / 品牌风格    → Lottie（需设计资源）
    ↓
[各引擎并行渲染]
    ↓
[合并 Agent]
  拼接各引擎输出片段 + 配音
    ↓
输出：MP4 + SRT
```

**优点**：不同内容用最优引擎，视觉上限最高；引擎路由策略本身是高价值 Gene
**缺点**：多引擎集成工期风险极大，Hackathon 内难以完成
**适合**：写入进化路径规划，不在本次实现

---

### 方案对比总览

| 维度 | 方案 A（串行）| 方案 B（并行）| 方案 C（多引擎）|
|------|-------------|-------------|--------------|
| 实现复杂度 | 低 | 中 | 高 |
| 24h 可交付 | ✅ 确定 | ✅ 大概率 | ❌ 风险大 |
| Demo 效果 | 一般 | 好 | 最好 |
| A2A 体现 | 弱 | 强 | 强 |
| 推荐优先级 | 兜底 | **主线** | 进化路径 |

---

## 五、动效技术选型调研

### 候选方案

| 库 | 语言 | 视频导出 | AI 生成代码友好度 | 适合内容类型 | Hackathon 可行性 |
|---|---|---|---|---|---|
| **Remotion** | React/TS | ✅ 原生 MP4 | ✅✅ 最高 | 通用讲解、流程图、数据可视化 | ✅ 兜底首选 |
| **Motion Canvas** | TypeScript | ✅ 原生 | ✅ 中等 | CS/算法讲解，3Blue1Brown 风格 | ⚠️ 学习曲线稍高 |
| **Manim** | Python | ✅ 原生 | ✅ 有 GPT 包装器 | 数学/公式/严肃教育 | ⚠️ 渲染慢，非前端 |
| **GSAP** | JS | ❌ 需捕屏 | ⚠️ 间接 | 网页动效、SVG 动画 | ❌ 不适合视频导出 |
| **Lottie** | JSON | ⚠️ 需合成 | ⚠️ 需设计资源 | 插画级品牌动效 | ❌ 需美术配合 |

### Remotion 接口形式（已确认可行）

AI 输出标准场景 JSON，Remotion 按 type 映射到预制动画组件：

```json
{
  "scenes": [
    {
      "id": "scene_1",
      "type": "title",
      "durationSeconds": 3,
      "props": { "title": "什么是 RAG？", "subtitle": "检索增强生成" }
    },
    {
      "id": "scene_2",
      "type": "diagram_flow",
      "durationSeconds": 6,
      "props": {
        "nodes": ["用户问题", "向量检索", "知识库", "LLM", "答案"],
        "narration": "用户提问后，系统先去知识库检索相关内容..."
      }
    }
  ]
}
```

预制场景类型（MVP 需实现）：
- `title`：标题页
- `diagram_flow`：流程图（节点 + 箭头逐步高亮）
- `bullet_points`：要点逐条展示
- `split_compare`：左右对比
- `outro`：结尾页

### 待调研事项

- [ ] Motion Canvas 生成 CS 类动效的实际效果评估（找参考视频）
- [ ] Remotion Lambda 云端渲染方案，是否在 Hackathon 环境可用
- [ ] 游戏引擎（Unity WebGL / Godot）做动效的可行性（进化路径，不在本次实现）
- [ ] 配音 API 选型：ElevenLabs / Azure TTS / OpenAI TTS 对比（延迟、中文效果、价格）
- [ ] 数字人 API 选型：HeyGen / D-ID 对比（**待定，可能不在 MVP**）

---

## 六、EvoMap Gene 接入设计

### 封装策略

每次生成视频后，自动发布两类 Gene：

**Gene 1：脚本生成策略**
- `category`: `innovate`
- `signals_match`: `["概念讲解", "explainer", "知识科普", "RAG", "AI概念"]`
- `strategy`: 记录本次"如何把概念拆解为场景列表"的可复用步骤
- 每次生成新主题时，追加一个 Capsule（本次具体实现 + 效果评分）

**Gene 2：视频场景模板**
- `category`: `optimize`
- `signals_match`: `["diagram_flow", "bullet_points", "技术概念", "流程讲解"]`
- `strategy`: 记录本次使用的场景组合方式（哪种模板组合效果更好）
- 随用户反馈/使用次数持续优化排名

### 发布时机（待确认）

- 选项 A：每次生成完成后自动发布
- 选项 B：用户确认视频质量后再发布
- 倾向：选项 A，保持 Agent 自动进化；可加置信度字段反映质量

### EvolutionEvent 记录内容

每次生成记录：
- 输入类型（概念模式 / 脚本模式）
- 场景数量、总时长
- 渲染引擎选择
- 配音 API 调用结果
- 最终 outcome score（可由视频完成率 or 用户评分决定）

---

## 七、Benchmark 建设

### 测试用例设计

用于验证系统输出质量，同时作为 Demo 现场展示素材。

| 测试用例 | 输入 | 预期输出 | 验收标准 |
|---------|------|---------|---------|
| **概念模式-基础** | "帮我讲解什么是 RAG" | 90s 以内视频，含流程图动效 | 场景逻辑正确，动效流畅 |
| **概念模式-进阶** | "帮我讲解 Transformer 的注意力机制" | 含公式或节点图的视频 | 概念准确，不出现幻觉 |
| **脚本模式** | 用户提供"什么是 RAG"的旁白文稿 | 动效与旁白节奏对齐 | 场景切换时机与文稿段落匹配 |
| **B 端场景** | "生成一个讲解向量数据库的培训视频" | 结构完整，适合课程使用 | 时长 3-5min，分章节 |

### Benchmark 评估维度（待细化）

- **内容准确性**：概念是否正确，是否有幻觉
- **动效匹配度**：画面与旁白/字幕是否配合
- **视觉质量**：动效是否流畅，排版是否清晰
- **生成速度**：从输入到输出的耗时
- **Gene 质量**：发布的 Gene 是否被其他 Agent 采用（比赛后验证）

### 待确认

- [ ] 是否需要录制人工制作的参考视频做 Ground Truth 对比
- [ ] 评估打分由谁来做（队内互评 / 现场评委 / 自动化指标）

---

## 八、MVP To-Do（Hackathon 24 小时）

### 必须完成

- [ ] 脚本生成 Agent：Claude 接收输入 → 输出场景 JSON + 旁白文本
- [ ] Remotion 预制模板：至少实现 `title` / `diagram_flow` / `bullet_points` / `outro` 四种场景
- [ ] 字幕生成：旁白文本 → SRT 文件输出
- [ ] CLI 工具：`npx conceptclip "帮我讲解 RAG"` → 输出 MP4 + SRT
- [ ] 前端接入：接入队友现有 Agent 前端（Skill / MCP 形式，待确认接口）
- [ ] EvoMap Gene 发布：每次生成后自动发布脚本策略 Gene + Capsule
- [ ] Benchmark Demo：准备至少 2 个现场可运行的示例

### 选做（时间允许）

- [ ] TTS 配音接入（ElevenLabs / Azure / OpenAI TTS）
- [ ] 配音与视频 ffmpeg 合并
- [ ] 第二种场景类型：`split_compare` 左右对比
- [ ] 用户风格偏好输入

### 暂不做（进化路径）

- Motion Canvas / Manim 多引擎路由
- 数字人 API 接入
- 参考视频上传与风格拆解
- B 端批量接口

---

## 九、进化路径（比赛后）

```
MVP（Hackathon）
  ↓
v1.0：接入 TTS 配音 + ffmpeg 合并，完整视频输出
  ↓
v1.5：Motion Canvas 引擎接入，CS/算法类内容视觉升级
  ↓
v2.0：多引擎路由，根据内容类型自动选择最优渲染引擎
  ↓
v2.5：用户上传参考视频，风格拆解与迁移
  ↓
v3.0：数字人 API 接入，支持虚拟主播讲解形式
  ↓
v3.5：Gene 库积累到一定规模后，系统可从历史 Gene 中
      自动推荐最优场景组合（真正的自进化）
```

---

## 附：接口设计草稿（待细化）

### CLI
```bash
npx conceptclip "帮我讲解什么是 RAG" --style tech --duration 90s
# 输出：output/rag-explainer.mp4 + output/rag-explainer.srt
```

### MCP Tool
```json
{
  "name": "generate_explainer_video",
  "description": "根据概念或脚本生成动效讲解视频",
  "inputSchema": {
    "type": "object",
    "properties": {
      "input": { "type": "string", "description": "概念描述或旁白脚本" },
      "mode": { "type": "string", "enum": ["concept", "script"] },
      "style": { "type": "string", "enum": ["tech", "academic", "casual"] },
      "maxDuration": { "type": "number", "description": "最大时长（秒）" }
    },
    "required": ["input"]
  }
}
```

### 场景 JSON Schema（AI 输出格式）
```json
{
  "title": "什么是 RAG",
  "totalDuration": 90,
  "scenes": [
    {
      "id": "string",
      "type": "title | diagram_flow | bullet_points | split_compare | outro",
      "durationSeconds": 3,
      "narration": "这段的旁白文本",
      "props": {}
    }
  ]
}
```
