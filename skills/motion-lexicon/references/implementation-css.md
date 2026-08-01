# Portable implementation with HTML, CSS, and JavaScript

Use this reference for a production handoff. The default delivery is semantic
HTML, CSS custom properties, and small event-driven JavaScript. Adapt the state
model to the requested framework without changing its behavior.

## Structure

```html
<section class="moment" data-state="idle" aria-labelledby="moment-title">
  <button class="moment__action" type="button" aria-describedby="moment-status">
    Save changes
  </button>
  <p class="moment__status" id="moment-status" aria-live="polite"></p>
</section>
```

- Keep a native button, link, input, or dialog control when the product event
  maps to one.
- Use `data-state` for the source of truth. Derive classes and animation from
  that state.
- Reserve status width and height with a wrapper or a stable layout region.
- Use a single stable element for the primary actor when identity continues.

## Tokens

```css
.moment {
  --motion-arrive: 240ms;
  --motion-leave: 150ms;
  --motion-feedback: 150ms;
  --ease-arrive: cubic-bezier(.23, 1, .32, 1);
  --ease-leave: cubic-bezier(.4, 0, 1, 1);
  --ease-feedback: cubic-bezier(.2, .8, .2, 1);
}
```

Use these tokens as a default. Let a progress bar or upload indicator use a
measured duration connected to product state.

## State transition pattern

```css
.moment__status {
  min-block-size: 1.25rem;
  opacity: 0;
  transform: translateY(8px) scale(.97);
  transition:
    opacity var(--motion-arrive) var(--ease-arrive),
    transform var(--motion-arrive) var(--ease-arrive);
}

.moment[data-state="success"] .moment__status {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.moment[data-state="leaving"] .moment__status {
  opacity: 0;
  transform: translateY(-4px) scale(.98);
  transition-duration: var(--motion-leave);
  transition-timing-function: var(--ease-leave);
}
```

Use a visual proxy when the component's height changes. Animate the proxy's
transform while the reserved wrapper accommodates the final content.

## Event-driven JavaScript

```js
const moment = document.querySelector('.moment');
const action = moment.querySelector('.moment__action');
const status = moment.querySelector('.moment__status');

const setState = (state, message) => {
  moment.dataset.state = state;
  status.textContent = message;
};

action.addEventListener('click', async () => {
  setState('pending', 'Saving…');
  await saveChanges();
  setState('success', 'Saved');
});
```

When a second action arrives, update `data-state` immediately and cancel or
reverse any Web Animations API handle held by the component. Keep the visible
state aligned with the latest user intent.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .moment *,
  .moment *::before,
  .moment *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
```

Keep the final state, status message, focus sequence, and recovery action in
place. A short opacity crossfade is useful where it helps orientation.

## Framework adaptation

- **React:** store the state graph in component state or a state machine; drive
  DOM attributes from that value; clean up animation handles in effects.
- **Vue and Svelte:** bind `data-state` to a reactive value and preserve the
  same state names and interruption policy.
- **Web Animations API:** keep a handle for each primary actor and call
  `cancel()`, `reverse()`, or `finish()` according to the Blueprint's
  interruption rule.

Keep interaction state separate from visual classes so test code can assert the
product result directly.
