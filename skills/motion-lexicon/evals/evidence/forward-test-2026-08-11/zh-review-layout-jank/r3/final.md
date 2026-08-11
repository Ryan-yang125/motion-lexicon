## Motion review

### Critical

- **Observed:** “保存”→“已保存”改变了按钮宽度，右侧操作随 flex 布局重排而抖动。
- **Cause:** 状态文案参与布局，且 `transition: all .5s` 连宽度、间距等布局属性也一起过渡。
- **Fix:** 按钮预留最大状态文案的宽度（或固定宽度）；不要动画 `width`。右侧操作放在不受按钮内容宽度影响的稳定区域。

### Important

- **Observed:** 保存反馈显得迟缓、像整块 UI 在移动。
- **Cause:** 0.5s 对一次确认反馈过长，`all` 还会触发不必要的 layout/paint。
- **Fix:** 只 transition 明确的视觉属性，例如 `background-color`、`color`、`box-shadow`、`transform`、`opacity`；成功反馈建议 140–180ms。

```css
.saveButton {
  min-inline-size: 5.5em; /* 按“保存中 / 已保存”等最长文案预留 */
  transition:
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease,
    transform 120ms ease;
}

.saveButton:active {
  transform: scale(.98);
}
```

若要做文字过渡，让新旧文案在同一个固定宽度的文字层中交叉淡入淡出，不要让它们依次撑开按钮。

### Polish

- 保存开始应立即进入“保存中”或 loading 状态并禁用重复提交；成功后显示“已保存”，再按产品需要恢复“保存”。
- 结果用附近的 `aria-live="polite"` 简短播报；键盘焦点始终留在按钮上。
- `prefers-reduced-motion` 下直接切换状态，或只保留极短淡入。

## Revised beat plan

1. 点击：按钮轻微按压，立刻进入稳定尺寸的 pending 状态。  
2. 成功：按钮原地换色，文案在固定文字区域内淡切到“已保存”。  
3. 右侧操作：位置完全不变；不参与任何宽度或布局动画。  

核心原则：把“状态变化”留在按钮内部，用 `transform/opacity/color` 表达；不要让按钮尺寸成为动画主体。