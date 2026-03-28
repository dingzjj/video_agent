# 脚本输出格式规范

## 输出文件：script.json

```json
{
  "meta": {
    "title": "视频标题",
    "challenge": "挑战定义（谁+场景+问题）",
    "duration": 60,
    "fps": 30,
    "width": 1080,
    "height": 1920,
    "sceneCount": 8
  },
  "scenes": [
    {
      "id": 1,
      "timeRange": "0-8",
      "startFrame": 0,
      "durationInFrames": 240,
      "type": "hook",
      "visual": {
        "type": "text-overlay",
        "content": "画面上显示的文字",
        "background": "背景描述",
        "animation": "动画效果"
      },
      "subtitle": "字幕文本（精简版）",
      "voiceover": "口播内容（完整版，口语化）"
    }
  ]
}
```

## visual 字段说明

### type 类型
- `text-overlay`: 纯文字叠加
- `split-screen`: 左右分屏对比
- `diagram`: 关系图/流程图
- `highlight`: 高亮标注
- `transition`: 过渡动画

### content
画面上实际显示的内容（文字/图形描述）

### background
**不要写具体色值**，只描述氛围关键词，由 video-producer 根据主题配色系统统一处理。
可用词汇：「深色警示」「高亮强调」「清爽对比」「暖调复古」「极简留白」「赛博深色」

### animation
进入/退出动画效果

## subtitle vs voiceover 区别

**subtitle（字幕）**：
- 精简版，每行 ≤15 字
- 只保留核心信息
- 用户快速扫一眼能看懂

**voiceover（口播）**：
- 完整版，口语化表达
- 包含连接词、语气词
- 补充字幕中省略的细节

## 示例

```json
{
  "id": 2,
  "timeRange": "8-20",
  "type": "content",
  "visual": {
    "type": "diagram",
    "content": "用户提问 → RAG检索 → 上下文注入 → AI回答",
    "background": "高亮强调",
    "animation": "从左到右依次出现"
  },
  "subtitle": "RAG = 检索 + 推理",
  "voiceover": "RAG 的工作流程其实很简单，就是先检索相关文档，然后把这些内容注入到 AI 的上下文里，最后生成回答"
}
```
