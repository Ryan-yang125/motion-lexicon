假设编辑器有工具栏“保存”按钮和就近状态文本。核心策略是：连续点击不会堆积请求，而是合并为“当前请求 + 最后一份最新内容”；过期响应不得覆盖最新状态。

```json
{
  "version": "2.0",
  "locale": "zh",
  "intent": {
    "productGoal": "让编辑器的异步保存结果可见、可恢复，并避免重复提交。",
    "userIntent": "保存当前修改，并在网络失败后继续掌控内容。",
    "feeling": "笃定、不断线"
  },
  "scope": {
    "surface": "编辑器工具栏的保存按钮与文档保存状态",
    "framework": "未指定；适用于 Web 编辑器",
    "input": ["pointer", "keyboard", "touch"]
  },
  "stateGraph": {
    "initial": "dirty",
    "states": [
      { "id": "clean", "label": "已保存", "role": "initial" },
      { "id": "dirty", "label": "有未保存修改", "role": "engaged" },
      { "id": "saving", "label": "正在保存", "role": "pending" },
      { "id": "queued", "label": "保存中，已合并最新修改", "role": "pending" },
      { "id": "saved", "label": "已保存", "role": "success" },
      { "id": "failed", "label": "保存失败", "role": "failure" },
      { "id": "retrying", "label": "正在重试", "role": "recovery" }
    ],
    "transitions": [
      { "event": "edit", "from": "clean", "to": "dirty", "interrupt": "replace" },
      { "event": "save", "from": "dirty", "to": "saving", "interrupt": "replace" },
      { "event": "save-again", "from": "saving", "to": "queued", "interrupt": "queue" },
      { "event": "save-again", "from": "queued", "to": "queued", "interrupt": "settle" },
      { "event": "current-succeeds", "from": "queued", "to": "saving", "interrupt": "replace" },
      { "event": "current-fails", "from": "queued", "to": "saving", "interrupt": "replace" },
      { "event": "latest-succeeds", "from": "saving", "to": "saved", "interrupt": "settle" },
      { "event": "latest-fails", "from": "saving", "to": "failed", "interrupt": "settle" },
      { "event": "retry", "from": "failed", "to": "retrying", "interrupt": "replace" },
      { "event": "retry-again", "from": "retrying", "to": "retrying", "interrupt": "settle" },
      { "event": "retry-succeeds", "from": "retrying", "to": "saved", "interrupt": "settle" },
      { "event": "retry-fails", "from": "retrying", "to": "failed", "interrupt": "settle" },
      { "event": "edit", "from": "failed", "to": "dirty", "interrupt": "replace" },
      { "event": "acknowledge", "from": "saved", "to": "clean", "interrupt": "settle" }
    ]
  },
  "actors": [
    { "id": "save-trigger", "role": "primary", "kind": "trigger", "element": "保存按钮" },
    { "id": "save-status", "role": "supporting", "kind": "status", "element": "工具栏保存状态" },
    { "id": "document-record", "role": "supporting", "kind": "record", "element": "当前文档记录" }
  ],
  "beats": [
    {
      "id": "press-save",
      "at": 0,
      "actor": "save-trigger",
      "purpose": "orient",
      "primitive": "press-tap-feedback",
      "from": "可保存",
      "to": "保存中",
      "durationMs": 140,
      "easing": "feedback",
      "properties": ["transform", "color"]
    },
    {
      "id": "show-saving",
      "at": 0,
      "actor": "save-status",
      "purpose": "preserve-continuity",
      "primitive": "text-morph",
      "from": "有未保存修改",
      "to": "正在保存",
      "durationMs": 160,
      "easing": "arrive",
      "properties": ["opacity", "transform", "color"]
    },
    {
      "id": "show-queued",
      "at": "on:save-again",
      "actor": "save-status",
      "purpose": "preserve-continuity",
      "primitive": "crossfade",
      "from": "正在保存",
      "to": "正在保存，已更新",
      "durationMs": 160,
      "easing": "arrive",
      "properties": ["opacity", "transform"]
    },
    {
      "id": "confirm-latest-save",
      "at": "after:latest-succeeds",
      "actor": "save-status",
      "purpose": "confirm",
      "primitive": "crossfade",
      "from": "正在保存",
      "to": "已保存",
      "durationMs": 200,
      "easing": "arrive",
      "properties": ["opacity", "transform", "color"]
    },
    {
      "id": "reveal-retry",
      "at": "after:latest-fails",
      "actor": "save-status",
      "purpose": "recover",
      "primitive": "crossfade",
      "from": "正在保存",
      "to": "保存失败，重试",
      "durationMs": 180,
      "easing": "arrive",
      "properties": ["opacity", "transform", "color"]
    }
  ],
  "accessibility": {
    "reducedMotion": "不位移或缩放；立即替换状态文字与图标，仅保留 100ms 内淡入。",
    "focus": "保存、失败、重试都保持焦点在原保存控件；只在用户按 Tab 时进入重试按钮。",
    "aria": "状态区 aria-live=polite；仅播报最新意图的“正在保存 / 已保存 / 保存失败，可重试”，不播报被合并或过期请求。",
    "keyboard": "Enter 与 Space 触发保存或重试；保存中再次触发只合并；Escape 不取消已经发送的请求。"
  },
  "delivery": {
    "formats": ["prompt"],
    "integration": "保存服务维护单调递增的 intentVersion 和 requestId；只有当前 requestId 的响应可提交 UI。"
  },
  "provenance": {
    "status": "draft",
    "foundations": ["press-tap-feedback", "text-morph", "crossfade"],
    "moments": ["Save confirmation", "Sync recovery"],
    "confidence": "high",
    "evidence": "基于异步保存、失败恢复和重复点击的编辑器交互需求。"
  }
}
```

交互落点：

- 首次点击立即显示“正在保存”，按钮尺寸和位置不变。
- 保存中再次点击显示“正在保存，已更新”；仅保留最后一次内容快照，不为每次点击额外发请求。
- 当前请求结束后，如有合并内容，直接继续保存，不短暂闪出“已保存”。
- 只有最新快照保存成功，才显示“已保存”；失败则在同一位置显示“保存失败 · 重试”，内容始终保留。
- 每次请求使用递增 `requestId`；任何旧响应直接丢弃，避免旧成功/失败覆盖新状态。

蓝图已通过校验：`validate-motion-blueprint.mjs /tmp/editor-save-blueprint.json`。