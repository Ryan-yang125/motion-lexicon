## Motion review

### Critical

- **现象：** “保存”→“已保存”改变了按钮的固有宽度，右侧操作被挤开再回流，形成横向抖动。
- **原因：** 这是布局重排，不是普通的视觉动画；`transition: all 0.5s` 还会尝试过渡宽度等不该参与的属性。
- **修复：** 让按钮在所有状态下保持同一几何尺寸：设定 `min-inline-size`（按最长文案预留），或把文案放入固定宽度的内部槽位。不要动画 `width`。

```css
.save-button {
  min-inline-size: 6em; /* 按“已保存”及本地化最长文案校准 */
  transition:
    background-color 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}

.save-button__label {
  display: inline-grid;
  place-items: center;
  min-inline-size: 3em;
}
```

### Important

- **现象：** 保存反馈要等 0.5 秒，显得迟钝。
- **原因：** 0.5 秒适合较明显的上下文切换，不适合一次局部成功确认。
- **修复：** 点击后立即进入 pending（禁用、spinner 或“保存中”），成功后在原位做 140–180ms 的文本淡变/图标切换。主角只应是保存按钮，右侧操作保持静止。

```css
@media (prefers-reduced-motion: reduce) {
  .save-button { transition: none; }
}
```

### Polish

- **避免** `transition: all`：它会把意外变化也纳入动画，增加重排与调试成本。
- 若“已保存”只是短暂确认，建议 1–2 秒后恢复“保存”；若它是持久状态，用勾选图标和颜色即可，仍保持按钮宽度不变。
- 结果用简短的 `aria-live="polite"` 状态播报；保存期间保持焦点留在按钮，键盘用户不会丢失操作位置。

## Revised beat plan

1. 按下：120ms 的按压反馈，按钮尺寸不变。  
2. 请求中：立即显示“保存中”或加载图标，禁用重复提交。  
3. 成功：原位 160ms 文案/勾选图标切换为“已保存”，不移动任何相邻操作。  
4. 减弱动效：直接切换状态，保留颜色、文案与语义反馈。