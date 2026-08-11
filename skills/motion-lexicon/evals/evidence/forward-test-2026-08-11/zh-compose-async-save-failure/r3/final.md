已设计为“单飞保存 + 最新版本合并”：连续点击不会制造并发请求；保存期间若内容有新改动，只会在当前请求结束后补存一次最新版本。网络错误自动重试两次，最终失败提供明确的“重试”入口；过期响应一律丢弃。

```json
{
  "version": "2.0",
  "locale": "zh",
  "intent": {
    "productGoal": "让编辑器保存过程可信、可恢复且不产生重复写入。",
    "userIntent": "保存当前最新内容，并清楚知道它是否已落库。",
    "feeling": "确定、可控"
  },
  "scope": {
    "surface": "编辑器工具栏与文档状态区",
    "framework": "未指定",
    "input": ["pointer", "keyboard", "touch"]
  },
  "stateGraph": {
    "initial": "ready",
    "states": [
      {"id": "ready", "label": "可保存", "role": "initial"},
      {"id": "saving", "label": "正在保存", "role": "pending"},
      {"id": "queued", "label": "已合并最新修改", "role": "engaged"},
      {"id": "retrying", "label": "正在重试", "role": "recovery"},
      {"id": "saved", "label": "已保存", "role": "success"},
      {"id": "failed", "label": "保存失败", "role": "failure"}
    ],
    "transitions": [
      {"event": "save", "from": "ready", "to": "saving", "interrupt": "replace"},
      {"event": "save-again-same-revision", "from": "saving", "to": "saving", "interrupt": "settle"},
      {"event": "save-latest-revision", "from": "saving", "to": "queued", "interrupt": "queue"},
      {"event": "request-succeeds", "from": "saving", "to": "saved", "interrupt": "settle"},
      {"event": "request-succeeds-with-queue", "from": "queued", "to": "saving", "interrupt": "replace"},
      {"event": "transient-error", "from": "saving", "to": "retrying", "interrupt": "settle"},
      {"event": "retry-now-or-backoff", "from": "retrying", "to": "saving", "interrupt": "replace"},
      {"event": "retry-limit-reached", "from": "retrying", "to": "failed", "interrupt": "settle"},
      {"event": "retry", "from": "failed", "to": "saving", "interrupt": "replace"},
      {"event": "edit", "from": "saved", "to": "ready", "interrupt": "replace"}
    ]
  },
  "actors": [
    {"id": "save-control", "role": "primary", "kind": "trigger", "element": "保存按钮"},
    {"id": "save-status", "role": "supporting", "kind": "status", "element": "按钮旁保存状态"},
    {"id": "document-record", "role": "supporting", "kind": "record", "element": "文档最近保存时间"}
  ],
  "beats": [
    {"id": "press", "at": 0, "actor": "save-control", "purpose": "orient", "primitive": "press-tap-feedback", "from": "ready", "to": "saving", "durationMs": 120, "easing": "feedback", "properties": ["transform", "color"]},
    {"id": "pending", "at": 0, "actor": "save-status", "purpose": "preserve-continuity", "primitive": "text-morph", "from": "可保存", "to": "正在保存…", "durationMs": 180, "easing": "arrive", "properties": ["opacity", "transform"]},
    {"id": "coalesce", "at": "repeat-press", "actor": "save-status", "purpose": "preserve-continuity", "primitive": "text-morph", "from": "正在保存…", "to": "已合并最新修改", "durationMs": 180, "easing": "arrive", "properties": ["opacity", "transform"]},
    {"id": "success", "at": "request-succeeds", "actor": "save-status", "purpose": "confirm", "primitive": "crossfade", "from": "正在保存…", "to": "已保存 刚刚", "durationMs": 220, "easing": "arrive", "properties": ["opacity", "transform"]},
    {"id": "failure", "at": "retry-limit-reached", "actor": "save-status", "purpose": "recover", "primitive": "crossfade", "from": "正在重试", "to": "保存失败：网络连接异常；重试", "durationMs": 180, "easing": "arrive", "properties": ["opacity", "transform", "color"]}
  ],
  "accessibility": {
    "reducedMotion": "关闭位移，仅用即时文本与颜色更新；不省略保存、排队或失败信息。",
    "focus": "保存时焦点留在保存按钮；失败后不抢焦点，按 Enter 或 Space 可重试。",
    "aria": "状态区使用 aria-live=polite；最终失败用 role=alert 一次播报，重复点击不重复播报。",
    "keyboard": "Enter/Space 触发保存；保存中再次触发仅合并意图；Esc 不取消已发出的保存请求。"
  },
  "delivery": {
    "formats": ["prompt"],
    "integration": "以单飞请求、版本号和最新快照队列接入现有保存 API。"
  },
  "provenance": {
    "status": "draft",
    "foundations": ["press-tap-feedback", "text-morph", "crossfade"],
    "moments": ["Save confirmation", "Sync recovery"],
    "confidence": "high",
    "evidence": "保存确认与同步恢复的已发布场景。"
  }
}
```

实现要点：

- 每次保存携带递增 `intentVersion` 与内容快照；仅当前版本响应能更新 UI。
- 同版本连点只显示“正在保存”，不重发请求。
- 有新内容时显示“已合并最新修改”；当前请求结束后立即保存最新快照。
- 网络错误按 0.5s、1.5s 自动重试两次；仍失败则显示原因和“重试”。手动重试使用最新快照。
- 蓝图已通过校验：`validate-motion-blueprint.mjs /tmp/editor-save-blueprint.json`（exit 0）。