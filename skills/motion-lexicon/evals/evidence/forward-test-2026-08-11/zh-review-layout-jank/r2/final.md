## Motion review

### Critical

- **Observed:** “保存”切到“已保存”时按钮变宽，右侧操作随 flex 重新排版而横向抖动。
- **Cause:** 文案的固有宽度不同；`transition: all 0.5s` 又把宽度、间距等布局属性一并动画化，导致一次状态反馈变成整行重排。
- **Fix:** 保持按钮外框宽度恒定（或预留“已保存”的宽度），只切换内部文本的 `opacity/transform` 与颜色。不要动画 `width`、`margin`、`gap` 或 `all`。

### Important

- **Observed:** 成功反馈要等 0.5 秒，显得拖沓。
- **Cause:** 保存成功是即时确认，不是页面转场。
- **Fix:** 按下立即进入“保存中…”，成功后在 140–180ms 内完成文本/图标切换；颜色可过渡 120–160ms。

```css
.save-button {
  inline-size: 88px; /* 至少容纳“已保存” */
  transition:
    background-color 140ms ease,
    color 140ms ease,
    border-color 140ms ease;
}

.save-label {
  display: grid;
}

.save-label > span {
  grid-area: 1 / 1; /* 两份文案占同一个位置，不改变外框 */
  transition: opacity 160ms ease, transform 160ms cubic-bezier(.23, 1, .32, 1);
}

.save-label .idle { opacity: 1; transform: translateY(0); }
.save-label .done { opacity: 0; transform: translateY(4px); }

.save-button.is-saved .idle { opacity: 0; transform: translateY(-4px); }
.save-button.is-saved .done { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .save-button,
  .save-label > span { transition: none; }
}
```

```html
<button class="save-button is-saved" aria-describedby="save-status">
  <span class="save-label" aria-hidden="true">
    <span class="idle">保存</span>
    <span class="done">已保存</span>
  </span>
  <span class="sr-only">已保存</span>
</button>
<p id="save-status" aria-live="polite" class="sr-only">已保存</p>
```

## Revised beat plan

1. 点击：按钮立即呈现按压态，并禁用或进入“保存中”以防重复提交。
2. 成功：外框不动，内部“保存”淡出上移，“已保存”淡入归位；可加一个小勾图标。
3. 停留：成功态保留约 1–2 秒，再恢复“保存”；若“已保存”是持久状态，则无需自动恢复。
4. 失败：保持按钮位置与宽度，改为“重试”或展示邻近错误说明，不使用抖动动画。

核心原则：**状态可以变，几何不要变**。`transition: all` 应直接移除。