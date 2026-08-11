已完成。由于工作区没有现有编辑器项目，交付为可直接打开的交互原型：[index.html](/private/tmp/ml-v420-recorded-pr6ha4/zh-compose-async-save-failure-r1/work/index.html:185)。

- 保存中重复点击会合并，不创建并发请求。
- 保存期间继续编辑会自动接力保存最新版本。
- 失败后内容保留，原位显示原因与“重试”。
- 响应以请求版本校验，过期结果不会覆盖新状态。
- 包含键盘、ARIA 状态播报和减少动态效果支持。
- 实际接入时替换 [saveDocument](/private/tmp/ml-v420-recorded-pr6ha4/zh-compose-async-save-failure-r1/work/index.html:270) 即可。

已验证：状态蓝图校验通过；内联 JavaScript 语法检查通过。蓝图文件：[save-moment.blueprint.json](/private/tmp/ml-v420-recorded-pr6ha4/zh-compose-async-save-failure-r1/work/save-moment.blueprint.json:1)。

```json
{
  "version": "2.0",
  "locale": "zh",
  "intent": {
    "productGoal": "让编辑器保存结果、失败原因与恢复路径始终清晰可见。",
    "userIntent": "保存当前改动，即使连续点击或网络波动也不丢失最新内容。",
    "feeling": "稳定、有掌控感"
  },
  "scope": {
    "surface": "编辑器顶部保存区",
    "framework": "HTML、CSS、JavaScript",
    "input": ["pointer", "keyboard", "touch"]
  },
  "stateGraph": {
    "initial": "idle",
    "states": [
      { "id": "idle", "label": "有未保存改动", "role": "initial" },
      { "id": "saving", "label": "正在保存", "role": "pending" },
      { "id": "saved", "label": "已保存", "role": "success" },
      { "id": "failed", "label": "保存失败，可重试", "role": "failure" },
      { "id": "queued", "label": "等待保存最新改动", "role": "recovery" }
    ],
    "transitions": [
      { "event": "save", "from": "idle", "to": "saving", "interrupt": "replace" },
      { "event": "repeat-save", "from": "saving", "to": "saving", "interrupt": "queue" },
      { "event": "newer-change", "from": "saving", "to": "queued", "interrupt": "queue" },
      { "event": "latest-save-success", "from": "saving", "to": "saved", "interrupt": "settle" },
      { "event": "stale-save-success", "from": "queued", "to": "saving", "interrupt": "replace" },
      { "event": "save-failure", "from": "saving", "to": "failed", "interrupt": "settle" },
      { "event": "retry", "from": "failed", "to": "saving", "interrupt": "replace" }
    ]
  },
  "actors": [
    { "id": "save-control", "role": "primary", "kind": "trigger", "element": "保存按钮" },
    { "id": "save-status", "role": "supporting", "kind": "status", "element": "保存状态提示" },
    { "id": "draft-record", "role": "supporting", "kind": "record", "element": "草稿更新时间" }
  ],
  "beats": [
    { "id": "press", "at": 0, "actor": "save-control", "purpose": "orient", "primitive": "press-tap-feedback", "from": "ready", "to": "pending", "durationMs": 150, "easing": "feedback", "properties": ["transform", "color"] },
    { "id": "pending-status", "at": 0, "actor": "save-status", "purpose": "preserve-continuity", "primitive": "text-morph", "from": "dirty", "to": "saving", "durationMs": 220, "easing": "arrive", "properties": ["opacity", "transform"] },
    { "id": "result", "at": "after:request", "actor": "save-status", "purpose": "confirm", "primitive": "crossfade", "from": "saving", "to": "saved-or-failed", "durationMs": 220, "easing": "arrive", "properties": ["opacity", "transform", "color"] },
    { "id": "retry", "at": "after:failure", "actor": "save-control", "purpose": "recover", "primitive": "press-tap-feedback", "from": "failed", "to": "saving", "durationMs": 150, "easing": "feedback", "properties": ["transform", "color"] }
  ],
  "accessibility": {
    "reducedMotion": "减少动态效果时立即切换状态，仅保留极短淡入。",
    "focus": "保存、成功与失败后均保留触发按钮焦点；重试不会夺走焦点。",
    "aria": "状态区使用 polite；失败改用 assertive，并在失败时暴露重试按钮。",
    "keyboard": "按钮可用 Enter 或 Space 激活；保存中重复激活会合并，不产生并发请求。"
  },
  "delivery": {
    "formats": ["html", "css", "js"],
    "integration": "替换 saveDocument 函数为实际 API，保留版本号和单请求队列策略。"
  },
  "provenance": {
    "status": "draft",
    "foundations": ["press-tap-feedback", "text-morph", "crossfade"],
    "moments": ["Save confirmation", "Sync recovery"],
    "confidence": "high",
    "evidence": "基于编辑器异步保存、失败恢复和快速重复触发场景。"
  }
}
```