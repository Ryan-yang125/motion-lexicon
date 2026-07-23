export type MotionRuntimeConfig = {
  id: string;
  duration: number;
  distance: number;
  resistance: number;
  position: number;
  stiffness: number;
  damping: number;
  mass: number;
  velocity: number;
  rippleSize: number;
  rippleOpacity: number;
  dragScale: number;
  autoplay?: boolean;
};

type MotionRuntimeMount = (
  root: HTMLElement,
  config: MotionRuntimeConfig
) => () => void;

function prefersReducedMotion(root: HTMLElement) {
  return root.closest(".force-reduced-motion") !== null ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function observeReducedMotion(root: HTMLElement, onChange: (reduced: boolean) => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const notify = () => onChange(prefersReducedMotion(root));
  media.addEventListener("change", notify);

  const observer = typeof MutationObserver === "undefined"
    ? null
    : new MutationObserver(notify);
  let ancestor: HTMLElement | null = root;
  while (observer && ancestor) {
    observer.observe(ancestor, { attributes: true, attributeFilter: ["class"] });
    ancestor = ancestor.parentElement;
  }

  return () => {
    media.removeEventListener("change", notify);
    observer?.disconnect();
  };
}

function mountReplayRuntime(root: HTMLElement) {
  const replay = root.querySelector<HTMLButtonElement>("[data-motion-replay]")!;
  if (!replay) return () => undefined;

  function restart() {
    for (const animation of root.getAnimations({ subtree: true })) {
      animation.cancel();
      animation.currentTime = 0;
      void animation.play();
    }
  }

  replay.addEventListener("click", restart);
  return () => {
    replay.removeEventListener("click", restart);
    for (const animation of root.getAnimations({ subtree: true })) {
      if (animation.playState === "paused") void animation.play();
    }
  };
}

function mountPauseRuntime(root: HTMLElement) {
  const button = root.querySelector<HTMLButtonElement>("[data-motion-pause]")!;
  const label = root.querySelector<HTMLElement>("[data-motion-pause-label]")!;
  if (!button || !label) return () => undefined;
  button.disabled = false;
  button.removeAttribute("aria-disabled");
  let paused = false;

  function toggle() {
    paused = !paused;
    for (const animation of root.getAnimations({ subtree: true })) {
      if (paused) animation.pause();
      else void animation.play();
    }
    button.setAttribute("aria-pressed", String(paused));
    label.textContent = paused
      ? button.dataset.resumeLabel || "Resume motion"
      : button.dataset.pauseLabel || "Pause motion";
    root.dispatchEvent(new CustomEvent(paused ? "motion:pause" : "motion:resume", { bubbles: true }));
  }

  button.addEventListener("click", toggle);
  return () => {
    button.removeEventListener("click", toggle);
    for (const animation of root.getAnimations({ subtree: true })) {
      if (animation.playState === "paused") void animation.play();
    }
    paused = false;
    button.setAttribute("aria-pressed", "false");
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
    label.textContent = button.dataset.pauseLabel || "Pause motion";
  };
}

function mountRippleRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const button = root.querySelector<HTMLButtonElement>("[data-ripple-button]")!;
  if (!button) return () => undefined;
  const active = new Set<Animation>();

  function showRipple(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    const bounds = button.getBoundingClientRect();
    const ink = document.createElement("span");
    ink.className = "motion-ripple-ink";
    ink.setAttribute("aria-hidden", "true");
    ink.style.left = `${event.clientX - bounds.left}px`;
    ink.style.top = `${event.clientY - bounds.top}px`;
    button.append(ink);

    const reduced = prefersReducedMotion(root);
    const diameter = Math.hypot(bounds.width, bounds.height) * 2;
    const finalScale = Math.max(1, diameter / 12) * Math.max(0.55, config.rippleSize / 220);
    const startOpacity = Math.min(0.5, Math.max(0.08, config.rippleOpacity / 100));
    const animation = ink.animate(
      reduced
        ? [{ opacity: startOpacity }, { opacity: 0 }]
        : [
            { opacity: startOpacity, transform: "translate(-50%, -50%) scale(0.95)" },
            { opacity: 0, transform: `translate(-50%, -50%) scale(${finalScale})` }
          ],
      {
        duration: Math.min(160, Math.max(100, config.duration || 160)),
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards"
      }
    );
    active.add(animation);
    animation.addEventListener("finish", () => {
      active.delete(animation);
      ink.remove();
    }, { once: true });
    animation.addEventListener("cancel", () => {
      active.delete(animation);
      ink.remove();
    }, { once: true });
  }

  button.addEventListener("pointerdown", showRipple);
  return () => {
    button.removeEventListener("pointerdown", showRipple);
    for (const animation of active) animation.cancel();
    for (const ink of button.querySelectorAll(".motion-ripple-ink")) ink.remove();
  };
}

function mountHoldRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const button = root.querySelector<HTMLButtonElement>("[data-hold-button]")!;
  const progress = root.querySelector<HTMLElement>("[data-hold-progress]")!;
  const label = root.querySelector<HTMLElement>("[data-hold-label]")!;
  const status = root.querySelector<HTMLElement>("[data-motion-status]");
  if (!button || !progress || !label) return () => undefined;

  const initialLabel = button.dataset.idleLabel || label.textContent || "Confirm";
  const initialStatus = status?.textContent || "";
  let activePointer: number | null = null;
  let progressAnimation: Animation | null = null;
  let releaseAnimation: Animation | null = null;
  let reducedTimer = 0;
  let completed = false;
  let keyboardActive = false;
  let holdDeadline = 0;

  function setStatus(message: string) {
    if (status) status.textContent = message;
  }

  function clearProgressWork() {
    window.clearTimeout(reducedTimer);
    reducedTimer = 0;
    progressAnimation?.cancel();
    progressAnimation = null;
    releaseAnimation?.cancel();
    releaseAnimation = null;
  }

  function resetVisual() {
    completed = false;
    button.dataset.state = "idle";
    button.setAttribute("aria-pressed", "false");
    label.textContent = initialLabel;
    progress.style.clipPath = "inset(0 100% 0 0)";
    progress.style.opacity = "";
  }

  function complete() {
    if (completed) return;
    clearProgressWork();
    completed = true;
    keyboardActive = false;
    if (activePointer !== null && button.hasPointerCapture(activePointer)) {
      button.releasePointerCapture(activePointer);
    }
    activePointer = null;
    holdDeadline = 0;
    progress.style.clipPath = "inset(0 0 0 0)";
    progress.style.opacity = "";
    button.dataset.state = "complete";
    button.setAttribute("aria-pressed", "true");
    label.textContent = button.dataset.completeLabel || "Confirmed";
    setStatus(button.dataset.completeLabel || "Confirmed");
    button.dispatchEvent(new CustomEvent("motion:confirm", { bubbles: true }));
  }

  function cancel() {
    if (completed) return;
    const currentClip = getComputedStyle(progress).clipPath;
    clearProgressWork();
    if (activePointer !== null && button.hasPointerCapture(activePointer)) {
      button.releasePointerCapture(activePointer);
    }
    activePointer = null;
    keyboardActive = false;
    holdDeadline = 0;
    button.dataset.state = "idle";
    button.setAttribute("aria-pressed", "false");
    label.textContent = initialLabel;
    if (prefersReducedMotion(root)) {
      progress.style.clipPath = "inset(0 100% 0 0)";
      progress.style.opacity = "";
    } else {
      progress.style.clipPath = currentClip;
      releaseAnimation = progress.animate(
        [
          { clipPath: currentClip, opacity: 1 },
          { clipPath: "inset(0 100% 0 0)", opacity: 0.55 }
        ],
        {
          duration: 160,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards"
        }
      );
      releaseAnimation.addEventListener("finish", () => {
        releaseAnimation = null;
        progress.style.clipPath = "inset(0 100% 0 0)";
        progress.style.opacity = "";
      }, { once: true });
    }
    setStatus(button.dataset.cancelLabel || "Cancelled");
    button.dispatchEvent(new CustomEvent("motion:cancel", { bubbles: true }));
  }

  function runProgressForCurrentPreference() {
    if (completed || (activePointer === null && !keyboardActive)) return;
    window.clearTimeout(reducedTimer);
    reducedTimer = 0;
    progressAnimation?.cancel();
    progressAnimation = null;
    releaseAnimation?.cancel();
    releaseAnimation = null;

    const totalDuration = Math.max(1, config.duration);
    const remaining = Math.max(0, holdDeadline - performance.now());
    const progressValue = Math.min(1, Math.max(0, 1 - remaining / totalDuration));
    button.dataset.state = "holding";
    button.setAttribute("aria-pressed", "false");
    label.textContent = button.dataset.holdMessage || "Hold to confirm";
    setStatus(button.dataset.holdMessage || "Hold to confirm");

    if (remaining === 0) {
      complete();
      return;
    }
    if (prefersReducedMotion(root)) {
      progress.style.clipPath = "inset(0 75% 0 0)";
      progress.style.opacity = "0.55";
      reducedTimer = window.setTimeout(complete, remaining);
      return;
    }
    progress.style.opacity = "";
    progressAnimation = progress.animate(
      [
        { clipPath: `inset(0 ${(1 - progressValue) * 100}% 0 0)` },
        { clipPath: "inset(0 0 0 0)" }
      ],
      { duration: remaining, easing: "linear", fill: "forwards" }
    );
    progressAnimation.addEventListener("finish", complete, { once: true });
  }

  function startProgress() {
    holdDeadline = performance.now() + Math.max(1, config.duration);
    runProgressForCurrentPreference();
  }

  function begin(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || activePointer !== null || keyboardActive) return;
    if (completed) resetVisual();
    activePointer = event.pointerId;
    button.setPointerCapture(event.pointerId);
    startProgress();
  }

  function end(event: PointerEvent) {
    if (event.pointerId !== activePointer) return;
    if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
    if (!completed) cancel();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (event.repeat || keyboardActive || activePointer !== null) return;
    if (completed) resetVisual();
    keyboardActive = true;
    startProgress();
  }

  function onKeyUp(event: KeyboardEvent) {
    if ((event.key !== "Enter" && event.key !== " ") || !keyboardActive) return;
    event.preventDefault();
    keyboardActive = false;
    if (!completed) cancel();
  }

  function onBlur() {
    if (!keyboardActive || completed) return;
    cancel();
  }

  const stopObservingReducedMotion = observeReducedMotion(root, () => {
    runProgressForCurrentPreference();
  });

  button.addEventListener("pointerdown", begin);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("keydown", onKeyDown);
  button.addEventListener("keyup", onKeyUp);
  button.addEventListener("blur", onBlur);
  return () => {
    stopObservingReducedMotion();
    clearProgressWork();
    if (activePointer !== null && button.hasPointerCapture(activePointer)) {
      button.releasePointerCapture(activePointer);
    }
    activePointer = null;
    keyboardActive = false;
    holdDeadline = 0;
    resetVisual();
    setStatus(initialStatus);
    button.removeEventListener("pointerdown", begin);
    button.removeEventListener("pointerup", end);
    button.removeEventListener("pointercancel", end);
    button.removeEventListener("keydown", onKeyDown);
    button.removeEventListener("keyup", onKeyUp);
    button.removeEventListener("blur", onBlur);
  };
}

function mountDragRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const list = root.querySelector<HTMLElement>("[data-reorder-list]")!;
  const status = root.querySelector<HTMLElement>("[data-motion-status]");
  if (!list) return () => undefined;
  const items = Array.from(list.querySelectorAll<HTMLElement>("[data-reorder-item]"));
  const initialStatus = status?.textContent || "";
  const landingAnimations = new Set<Animation>();

  let activePointer: number | null = null;
  let activeItem: HTMLElement | null = null;
  let placeholder: HTMLLIElement | null = null;
  let startX = 0;
  let startY = 0;
  let baseRect: DOMRect | null = null;
  let pointerOriginalNext: ChildNode | null = null;
  let dropTarget: HTMLElement | null = null;
  let keyboardItem: HTMLElement | null = null;
  let keyboardStartIndex = -1;

  function announce(message: string) {
    if (status) status.textContent = message;
  }

  function clearDropTarget() {
    dropTarget?.classList.remove("is-drop-target");
    dropTarget = null;
  }

  function resetFixedStyles(item: HTMLElement) {
    item.classList.remove("is-dragging");
    item.style.position = "";
    item.style.inset = "";
    item.style.width = "";
    item.style.height = "";
    item.style.zIndex = "";
    item.style.pointerEvents = "";
    item.style.transform = "";
    item.style.opacity = "";
  }

  function beginPointer(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || activePointer !== null) return;
    const item = event.currentTarget as HTMLElement;
    const rect = item.getBoundingClientRect();
    activePointer = event.pointerId;
    activeItem = item;
    startX = event.clientX;
    startY = event.clientY;
    baseRect = rect;
    pointerOriginalNext = item.nextSibling;
    placeholder = document.createElement("li");
    placeholder.className = "motion-drop-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.style.height = `${rect.height}px`;
    list.insertBefore(placeholder, item);
    root.append(item);
    item.classList.add("is-dragging");
    Object.assign(item.style, {
      position: "fixed",
      inset: `${rect.top}px auto auto ${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: "10",
      pointerEvents: "none",
      opacity: "0.94",
      transform: "translate3d(0, 0, 0)"
    });
    root.setPointerCapture(event.pointerId);
    announce(item.dataset.pickupLabel || "Item picked up");
  }

  function movePointer(event: PointerEvent) {
    if (event.pointerId !== activePointer || !activeItem || !placeholder || !baseRect) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    activeItem.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${Math.max(1, config.dragScale / 100)})`;
    const underPointer = document.elementFromPoint(event.clientX, event.clientY);
    const candidate = underPointer?.closest<HTMLElement>("[data-reorder-item]");
    if (!candidate || candidate === activeItem || candidate.parentElement !== list) return;
    clearDropTarget();
    dropTarget = candidate;
    candidate.classList.add("is-drop-target");
    const targetRect = candidate.getBoundingClientRect();
    if (event.clientY < targetRect.top + targetRect.height / 2) {
      list.insertBefore(placeholder, candidate);
    } else {
      list.insertBefore(placeholder, candidate.nextSibling);
    }
  }

  function finishActivePointer(cancelled = false) {
    if (activePointer === null || !activeItem || !placeholder) return;
    if (root.hasPointerCapture(activePointer)) root.releasePointerCapture(activePointer);
    const item = activeItem;
    const from = item.getBoundingClientRect();
    if (cancelled) list.insertBefore(placeholder, pointerOriginalNext);
    placeholder.replaceWith(item);
    resetFixedStyles(item);
    const to = item.getBoundingClientRect();
    if (!cancelled) {
      const landing = item.animate(
        [
          { transform: `translate3d(${from.left - to.left}px, ${from.top - to.top}px, 0)`, opacity: 0.94 },
          { transform: "translate3d(0, 0, 0)", opacity: 1 }
        ],
        {
          duration: Math.min(180, config.duration || 180),
          easing: "cubic-bezier(0.23, 1, 0.32, 1)"
        }
      );
      landingAnimations.add(landing);
      const forgetLanding = () => landingAnimations.delete(landing);
      landing.addEventListener("finish", forgetLanding, { once: true });
      landing.addEventListener("cancel", forgetLanding, { once: true });
      announce(item.dataset.dropLabel || "Item moved");
      item.dispatchEvent(new CustomEvent("motion:reorder", {
        bubbles: true,
        detail: { order: Array.from(list.querySelectorAll("[data-reorder-item]")).indexOf(item) }
      }));
    } else {
      announce(item.dataset.cancelLabel || "Move cancelled");
    }
    clearDropTarget();
    activePointer = null;
    activeItem = null;
    placeholder = null;
    baseRect = null;
    pointerOriginalNext = null;
    item.focus();
  }

  function finishPointer(event: PointerEvent, cancelled = false) {
    if (event.pointerId !== activePointer) return;
    finishActivePointer(cancelled);
  }

  function onKeyDown(event: KeyboardEvent) {
    const item = event.currentTarget as HTMLElement;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (keyboardItem === item) {
        keyboardItem.classList.remove("is-keyboard-dragging");
        keyboardItem.setAttribute("aria-grabbed", "false");
        announce(item.dataset.dropLabel || "Item moved");
        keyboardItem = null;
        keyboardStartIndex = -1;
      } else if (!keyboardItem) {
        keyboardItem = item;
        keyboardStartIndex = Array.from(list.querySelectorAll("[data-reorder-item]")).indexOf(item);
        item.classList.add("is-keyboard-dragging");
        item.setAttribute("aria-grabbed", "true");
        announce(item.dataset.pickupLabel || "Item picked up");
      }
      return;
    }
    if (keyboardItem !== item) return;
    if (event.key === "Escape") {
      event.preventDefault();
      const siblings = Array.from(list.querySelectorAll<HTMLElement>("[data-reorder-item]"))
        .filter((candidate) => candidate !== item);
      list.insertBefore(item, siblings[keyboardStartIndex] || null);
      item.classList.remove("is-keyboard-dragging");
      item.setAttribute("aria-grabbed", "false");
      announce(item.dataset.cancelLabel || "Move cancelled");
      keyboardItem = null;
      keyboardStartIndex = -1;
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const siblings = Array.from(list.querySelectorAll<HTMLElement>("[data-reorder-item]"));
    const index = siblings.indexOf(item);
    const nextIndex = event.key === "ArrowUp" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= siblings.length) return;
    if (event.key === "ArrowUp") list.insertBefore(item, siblings[nextIndex]);
    else list.insertBefore(item, siblings[nextIndex].nextSibling);
    announce(item.dataset.moveLabel || `Position ${nextIndex + 1}`);
  }

  function cancelPointer(event: PointerEvent) {
    finishPointer(event, true);
  }

  function cancelWithEscape(event: KeyboardEvent) {
    if (event.key !== "Escape" || activePointer === null) return;
    event.preventDefault();
    finishActivePointer(true);
  }

  for (const item of items) {
    item.addEventListener("pointerdown", beginPointer);
    item.addEventListener("keydown", onKeyDown);
  }
  root.addEventListener("pointermove", movePointer);
  root.addEventListener("pointerup", finishPointer);
  root.addEventListener("pointercancel", cancelPointer);
  root.ownerDocument.addEventListener("keydown", cancelWithEscape);

  return () => {
    for (const item of items) {
      item.removeEventListener("pointerdown", beginPointer);
      item.removeEventListener("keydown", onKeyDown);
    }
    root.removeEventListener("pointermove", movePointer);
    root.removeEventListener("pointerup", finishPointer);
    root.removeEventListener("pointercancel", cancelPointer);
    root.ownerDocument.removeEventListener("keydown", cancelWithEscape);
    for (const animation of landingAnimations) animation.cancel();
    clearDropTarget();
    if (activeItem && placeholder) {
      if (activePointer !== null && root.hasPointerCapture(activePointer)) {
        root.releasePointerCapture(activePointer);
      }
      list.insertBefore(placeholder, pointerOriginalNext);
      placeholder.replaceWith(activeItem);
      resetFixedStyles(activeItem);
    }
    if (keyboardItem && keyboardStartIndex >= 0) {
      const siblings = Array.from(list.querySelectorAll<HTMLElement>("[data-reorder-item]"))
        .filter((candidate) => candidate !== keyboardItem);
      list.insertBefore(keyboardItem, siblings[keyboardStartIndex] || null);
    }
    for (const item of items) {
      resetFixedStyles(item);
      item.classList.remove("is-drop-target", "is-keyboard-dragging");
      item.setAttribute("aria-grabbed", "false");
    }
    placeholder?.remove();
    activePointer = null;
    activeItem = null;
    placeholder = null;
    pointerOriginalNext = null;
    keyboardItem = null;
    keyboardStartIndex = -1;
    if (status) status.textContent = initialStatus;
  };
}

function mountSwipeRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const target = root.querySelector<HTMLElement>("[data-swipe-target]")!;
  const undo = root.querySelector<HTMLButtonElement>("[data-swipe-undo]")!;
  const dismissButton = root.querySelector<HTMLButtonElement>("[data-swipe-dismiss]");
  const status = root.querySelector<HTMLElement>("[data-motion-status]");
  if (!target || !undo) return () => undefined;

  const initialStatus = status?.textContent || "";
  const targetInitiallyHidden = target.hidden;
  const undoInitiallyHidden = undo.hidden;
  const dismissInitiallyHidden = dismissButton?.hidden ?? false;
  const initialAriaHidden = target.getAttribute("aria-hidden");
  let activePointer: number | null = null;
  let startX = 0;
  let startTime = 0;
  let rawDistance = 0;
  let activeAnimation: Animation | null = null;

  function announce(message: string) {
    if (status) status.textContent = message;
  }

  function clearInline() {
    target.style.transform = "";
    target.style.opacity = "";
  }

  function begin(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || activePointer !== null || target.hidden) return;
    activeAnimation?.cancel();
    activeAnimation = null;
    activePointer = event.pointerId;
    startX = event.clientX;
    startTime = performance.now();
    rawDistance = 0;
    target.setPointerCapture(event.pointerId);
    target.classList.add("is-dragging");
  }

  function move(event: PointerEvent) {
    if (event.pointerId !== activePointer) return;
    rawDistance = event.clientX - startX;
    const resistance = Math.min(0.9, Math.max(0.1, config.resistance / 100));
    const response = 1 - resistance;
    const damped = Math.sign(rawDistance) * Math.pow(Math.abs(rawDistance), 0.9) * response;
    const progress = Math.min(1, Math.abs(damped) / Math.max(1, config.distance));
    if (!prefersReducedMotion(root)) target.style.transform = `translate3d(${damped}px, 0, 0)`;
    target.style.opacity = String(1 - progress * 0.5);
  }

  function settle() {
    const transform = getComputedStyle(target).transform;
    const opacity = getComputedStyle(target).opacity;
    activeAnimation?.cancel();
    activeAnimation = target.animate(
      prefersReducedMotion(root)
        ? [{ opacity }, { opacity: 1 }]
        : [
            { transform, opacity },
            { transform: "translate3d(0, 0, 0)", opacity: 1 }
          ],
      {
        duration: 180,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards"
      }
    );
    activeAnimation.addEventListener("finish", () => {
      activeAnimation = null;
      clearInline();
    }, { once: true });
  }

  function dismiss(direction: number, keyboard = false) {
    const finish = () => {
      activeAnimation = null;
      target.hidden = true;
      target.classList.add("is-dismissed");
      target.setAttribute("aria-hidden", "true");
      if (dismissButton) dismissButton.hidden = true;
      undo.hidden = false;
      clearInline();
      announce(target.dataset.dismissLabel || "Item dismissed");
      target.dispatchEvent(new CustomEvent("motion:dismiss", { bubbles: true }));
      if (keyboard) undo.focus();
    };
    if (keyboard) {
      finish();
      return;
    }
    const currentTransform = getComputedStyle(target).transform;
    const currentOpacity = getComputedStyle(target).opacity;
    const exit = direction * Math.max(root.clientWidth, config.distance * 2);
    activeAnimation?.cancel();
    activeAnimation = target.animate(
      prefersReducedMotion(root)
        ? [{ opacity: currentOpacity }, { opacity: 0 }]
        : [
            { transform: currentTransform, opacity: currentOpacity },
            { transform: `translate3d(${exit}px, 0, 0)`, opacity: 0 }
          ],
      {
        duration: 200,
        easing: "cubic-bezier(0.32, 0.72, 0, 1)",
        fill: "forwards"
      }
    );
    activeAnimation.addEventListener("finish", finish, { once: true });
  }

  function end(event: PointerEvent) {
    if (event.pointerId !== activePointer) return;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    target.classList.remove("is-dragging");
    const elapsed = Math.max(1, performance.now() - startTime);
    const velocity = Math.abs(rawDistance) / elapsed;
    const threshold = Math.min(96, Math.max(48, config.distance * 0.6));
    const shouldDismiss = Math.abs(rawDistance) >= threshold || velocity > 0.11;
    const direction = rawDistance === 0 ? 1 : Math.sign(rawDistance);
    activePointer = null;
    if (shouldDismiss) dismiss(direction);
    else settle();
  }

  function cancel(event: PointerEvent) {
    if (event.pointerId !== activePointer) return;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    activePointer = null;
    target.classList.remove("is-dragging");
    settle();
  }

  function restore() {
    activeAnimation?.cancel();
    target.hidden = false;
    target.classList.remove("is-dismissed");
    target.removeAttribute("aria-hidden");
    undo.hidden = true;
    if (dismissButton) dismissButton.hidden = false;
    if (prefersReducedMotion(root)) {
      activeAnimation = target.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 160,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)"
      });
    } else {
      const offset = Math.max(root.clientWidth, config.distance * 2);
      activeAnimation = target.animate(
        [
          { transform: `translate3d(${offset}px, 0, 0)`, opacity: 0 },
          { transform: "translate3d(0, 0, 0)", opacity: 1 }
        ],
        {
          duration: 200,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)"
        }
      );
    }
    announce(undo.dataset.restoreLabel || "Item restored");
    target.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    event.preventDefault();
    dismiss(event.key === "Delete" ? 1 : -1, true);
  }

  function dismissFromControl(event: MouseEvent) {
    dismiss(1, event.detail === 0);
  }

  target.addEventListener("pointerdown", begin);
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", cancel);
  target.addEventListener("keydown", onKeyDown);
  dismissButton?.addEventListener("click", dismissFromControl);
  undo.addEventListener("click", restore);
  return () => {
    activeAnimation?.cancel();
    activeAnimation = null;
    if (activePointer !== null && target.hasPointerCapture(activePointer)) {
      target.releasePointerCapture(activePointer);
    }
    activePointer = null;
    rawDistance = 0;
    clearInline();
    target.classList.remove("is-dragging", "is-dismissed");
    target.hidden = targetInitiallyHidden;
    if (initialAriaHidden === null) target.removeAttribute("aria-hidden");
    else target.setAttribute("aria-hidden", initialAriaHidden);
    undo.hidden = undoInitiallyHidden;
    if (dismissButton) dismissButton.hidden = dismissInitiallyHidden;
    if (status) status.textContent = initialStatus;
    target.removeEventListener("pointerdown", begin);
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", end);
    target.removeEventListener("pointercancel", cancel);
    target.removeEventListener("keydown", onKeyDown);
    dismissButton?.removeEventListener("click", dismissFromControl);
    undo.removeEventListener("click", restore);
  };
}

function mountComparisonRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const comparison = root.querySelector<HTMLElement>("[data-comparison]")!;
  const after = root.querySelector<HTMLElement>("[data-comparison-after]")!;
  const divider = root.querySelector<HTMLElement>("[data-comparison-divider]")!;
  const input = root.querySelector<HTMLInputElement>("[data-comparison-input]")!;
  if (!comparison || !after || !divider || !input) return () => undefined;
  const initialValue = input.value;
  const initialClipPath = after.style.clipPath;
  const initialDividerTransform = divider.style.transform;
  const initialValueText = input.getAttribute("aria-valuetext");

  function update() {
    const value = Math.min(100, Math.max(0, Number(input.value || config.position)));
    after.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    divider.style.transform = `translate3d(${comparison.clientWidth * value / 100}px, 0, 0)`;
    input.setAttribute("aria-valuetext", `${Math.round(value)}%`);
  }

  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
  input.addEventListener("input", update);
  observer?.observe(comparison);
  update();
  return () => {
    input.removeEventListener("input", update);
    observer?.disconnect();
    input.value = initialValue;
    after.style.clipPath = initialClipPath;
    divider.style.transform = initialDividerTransform;
    if (initialValueText === null) input.removeAttribute("aria-valuetext");
    else input.setAttribute("aria-valuetext", initialValueText);
  };
}

function mountSpringRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const target = root.querySelector<HTMLElement>("[data-spring-target]")!;
  const replay = root.querySelector<HTMLButtonElement>("[data-motion-replay]")!;
  if (!target || !replay) return () => undefined;

  const initialTransform = target.style.transform;
  const initialOpacity = target.style.opacity;
  let frame = 0;
  let fade: Animation | null = null;
  let springPosition = config.distance;
  let springVelocity = config.velocity * 10;
  let springTarget = 0;
  let previous = 0;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    fade?.cancel();
    fade = null;
  }

  function settleForReducedMotion(showFeedback: boolean) {
    stop();
    springPosition = 0;
    springVelocity = 0;
    springTarget = 0;
    target.style.transform = "";
    target.style.opacity = "";
    if (showFeedback) {
      fade = target.animate([{ opacity: 0.72 }, { opacity: 1 }], {
        duration: 160,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)"
      });
      fade.addEventListener("finish", () => {
        fade = null;
      }, { once: true });
    }
  }

  function play() {
    if (prefersReducedMotion(root)) {
      settleForReducedMotion(true);
      return;
    }
    fade?.cancel();
    fade = null;
    const stiffness = Math.max(1, config.stiffness);
    const damping = Math.max(0, config.damping);
    const mass = Math.max(0.1, config.mass);
    const amplitude = Math.max(1, Math.abs(config.distance));
    if (frame) {
      springTarget = Math.abs(springTarget) < 0.01 ? config.distance : 0;
      return;
    }
    if (Math.abs(springPosition) < 0.08) {
      springPosition = config.distance;
      springVelocity = config.velocity * 10;
      springTarget = 0;
    } else if (Math.abs(springPosition - config.distance) < 0.08) {
      springTarget = 0;
    }
    previous = performance.now();
    target.style.opacity = "0.72";

    function step(now: number) {
      if (prefersReducedMotion(root)) {
        settleForReducedMotion(true);
        return;
      }
      const elapsed = Math.min(0.032, Math.max(0.001, (now - previous) / 1000));
      previous = now;
      const displacement = springPosition - springTarget;
      const acceleration = (-stiffness * displacement - damping * springVelocity) / mass;
      springVelocity += acceleration * elapsed;
      springPosition += springVelocity * elapsed;
      const progress = Math.min(1, Math.abs(displacement) / amplitude);
      target.style.transform = `translate3d(0, ${springPosition.toFixed(3)}px, 0) scale(${(1 - progress * 0.06).toFixed(4)})`;
      target.style.opacity = String(1 - progress * 0.28);
      if (Math.abs(displacement) < 0.08 && Math.abs(springVelocity) < 0.08) {
        springPosition = springTarget;
        springVelocity = 0;
        target.style.transform = springTarget === 0 ? "" : `translate3d(0, ${springTarget}px, 0)`;
        target.style.opacity = "";
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
  }

  replay.addEventListener("click", play);
  target.addEventListener("click", play);
  const stopObservingReducedMotion = observeReducedMotion(root, (reduced) => {
    if (reduced && frame) settleForReducedMotion(true);
    if (!reduced && fade) {
      fade.cancel();
      fade = null;
      target.style.opacity = "";
    }
  });
  if (config.autoplay) play();
  return () => {
    stopObservingReducedMotion();
    stop();
    replay.removeEventListener("click", play);
    target.removeEventListener("click", play);
    springPosition = config.distance;
    springVelocity = config.velocity * 10;
    springTarget = 0;
    target.style.transform = initialTransform;
    target.style.opacity = initialOpacity;
  };
}

// Copy exports use checked-in JavaScript source instead of serializing compiled
// functions. This keeps the snippets stable across tsc, Vite, tsx, and minifiers.
const copiedRuntimeHelpers = String.raw`
    const cleanups = [];
    const addCleanup = (callback) => cleanups.push(callback);
    const cleanup = () => {
      for (let index = cleanups.length - 1; index >= 0; index -= 1) {
        try { cleanups[index](); } catch { /* keep cleanup reentrant */ }
      }
      cleanups.length = 0;
    };
    const on = (target, type, listener, options) => {
      target.addEventListener(type, listener, options);
      addCleanup(() => target.removeEventListener(type, listener, options));
    };
    const reduced = () => root.closest(".force-reduced-motion") !== null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const watchReduced = (callback) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const notify = () => callback(reduced());
      media.addEventListener("change", notify);
      const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(notify);
      let ancestor = root;
      while (observer && ancestor) {
        observer.observe(ancestor, { attributes: true, attributeFilter: ["class"] });
        ancestor = ancestor.parentElement;
      }
      addCleanup(() => {
        media.removeEventListener("change", notify);
        if (observer) observer.disconnect();
      });
    };
`;

const copiedReplayRuntime = String.raw`
    const replay = root.querySelector("[data-motion-replay]");
    if (!replay) return cleanup;
    const restart = () => {
      root.getAnimations({ subtree: true }).forEach((animation) => {
        animation.cancel();
        animation.currentTime = 0;
        animation.play();
      });
    };
    addCleanup(() => root.getAnimations({ subtree: true }).forEach((animation) => {
      if (animation.playState === "paused") animation.play();
    }));
    on(replay, "click", restart);
    return cleanup;
`;

const copiedPauseRuntime = String.raw`
    const button = root.querySelector("[data-motion-pause]");
    const label = root.querySelector("[data-motion-pause-label]");
    if (!button || !label) return cleanup;
    button.disabled = false;
    button.removeAttribute("aria-disabled");
    let paused = false;
    const toggle = () => {
      paused = !paused;
      root.getAnimations({ subtree: true }).forEach((animation) => paused ? animation.pause() : animation.play());
      button.setAttribute("aria-pressed", String(paused));
      label.textContent = paused
        ? button.dataset.resumeLabel || "Resume motion"
        : button.dataset.pauseLabel || "Pause motion";
      root.dispatchEvent(new CustomEvent(paused ? "motion:pause" : "motion:resume", { bubbles: true }));
    };
    addCleanup(() => {
      root.getAnimations({ subtree: true }).forEach((animation) => {
        if (animation.playState === "paused") animation.play();
      });
      paused = false;
      button.setAttribute("aria-pressed", "false");
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
      label.textContent = button.dataset.pauseLabel || "Pause motion";
    });
    on(button, "click", toggle);
    return cleanup;
`;

const copiedRippleRuntime = String.raw`
    const button = root.querySelector("[data-ripple-button]");
    if (!button) return cleanup;
    const active = new Set();
    const show = (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      const bounds = button.getBoundingClientRect();
      const ink = document.createElement("span");
      ink.className = "motion-ripple-ink";
      ink.setAttribute("aria-hidden", "true");
      ink.style.left = String(event.clientX - bounds.left) + "px";
      ink.style.top = String(event.clientY - bounds.top) + "px";
      button.append(ink);
      const diameter = Math.hypot(bounds.width, bounds.height) * 2;
      const scale = Math.max(1, diameter / 12) * Math.max(0.55, config.rippleSize / 220);
      const opacity = Math.min(0.5, Math.max(0.08, config.rippleOpacity / 100));
      const animation = ink.animate(
        reduced()
          ? [{ opacity }, { opacity: 0 }]
          : [
              { opacity, transform: "translate(-50%, -50%) scale(0.95)" },
              { opacity: 0, transform: "translate(-50%, -50%) scale(" + String(scale) + ")" }
            ],
        { duration: Math.min(160, Math.max(100, config.duration || 160)), easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      );
      active.add(animation);
      const remove = () => { active.delete(animation); ink.remove(); };
      animation.addEventListener("finish", remove, { once: true });
      animation.addEventListener("cancel", remove, { once: true });
    };
    addCleanup(() => {
      active.forEach((animation) => animation.cancel());
      button.querySelectorAll(".motion-ripple-ink").forEach((ink) => ink.remove());
    });
    on(button, "pointerdown", show);
    return cleanup;
`;

const copiedComparisonRuntime = String.raw`
    const comparison = root.querySelector("[data-comparison]");
    const after = root.querySelector("[data-comparison-after]");
    const divider = root.querySelector("[data-comparison-divider]");
    const input = root.querySelector("[data-comparison-input]");
    if (!comparison || !after || !divider || !input) return cleanup;
    const initial = {
      value: input.value,
      clipPath: after.style.clipPath,
      transform: divider.style.transform,
      valueText: input.getAttribute("aria-valuetext")
    };
    const update = () => {
      const value = Math.min(100, Math.max(0, Number(input.value || config.position)));
      after.style.clipPath = "inset(0 " + String(100 - value) + "% 0 0)";
      divider.style.transform = "translate3d(" + String(comparison.clientWidth * value / 100) + "px, 0, 0)";
      input.setAttribute("aria-valuetext", String(Math.round(value)) + "%");
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    addCleanup(() => {
      if (observer) observer.disconnect();
      input.value = initial.value;
      after.style.clipPath = initial.clipPath;
      divider.style.transform = initial.transform;
      if (initial.valueText === null) input.removeAttribute("aria-valuetext");
      else input.setAttribute("aria-valuetext", initial.valueText);
    });
    on(input, "input", update);
    if (observer) observer.observe(comparison);
    update();
    return cleanup;
`;

const copiedHoldRuntime = String.raw`
    const button = root.querySelector("[data-hold-button]");
    const progress = root.querySelector("[data-hold-progress]");
    const label = root.querySelector("[data-hold-label]");
    const status = root.querySelector("[data-motion-status]");
    if (!button || !progress || !label) return cleanup;
    const initialLabel = button.dataset.idleLabel || label.textContent || "Confirm";
    const initialStatus = status ? status.textContent : "";
    let pointerId = null;
    let keyboard = false;
    let completed = false;
    let deadline = 0;
    let timer = 0;
    let progressAnimation = null;
    let releaseAnimation = null;
    const setStatus = (message) => { if (status) status.textContent = message; };
    const clearWork = () => {
      window.clearTimeout(timer);
      timer = 0;
      if (progressAnimation) progressAnimation.cancel();
      if (releaseAnimation) releaseAnimation.cancel();
      progressAnimation = null;
      releaseAnimation = null;
    };
    const resetVisual = () => {
      completed = false;
      button.dataset.state = "idle";
      button.setAttribute("aria-pressed", "false");
      label.textContent = initialLabel;
      progress.style.clipPath = "inset(0 100% 0 0)";
      progress.style.opacity = "";
    };
    const canonical = () => {
      clearWork();
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      pointerId = null;
      keyboard = false;
      deadline = 0;
      resetVisual();
      setStatus(initialStatus || "");
    };
    addCleanup(canonical);
    const complete = () => {
      if (completed) return;
      clearWork();
      completed = true;
      keyboard = false;
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      pointerId = null;
      deadline = 0;
      progress.style.clipPath = "inset(0 0 0 0)";
      progress.style.opacity = "";
      button.dataset.state = "complete";
      button.setAttribute("aria-pressed", "true");
      label.textContent = button.dataset.completeLabel || "Confirmed";
      setStatus(button.dataset.completeLabel || "Confirmed");
      button.dispatchEvent(new CustomEvent("motion:confirm", { bubbles: true }));
    };
    const cancelHold = () => {
      if (completed) return;
      const clip = getComputedStyle(progress).clipPath;
      clearWork();
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      pointerId = null;
      keyboard = false;
      deadline = 0;
      button.dataset.state = "idle";
      button.setAttribute("aria-pressed", "false");
      label.textContent = initialLabel;
      if (reduced()) {
        progress.style.clipPath = "inset(0 100% 0 0)";
        progress.style.opacity = "";
      } else {
        progress.style.clipPath = clip;
        releaseAnimation = progress.animate(
          [{ clipPath: clip, opacity: 1 }, { clipPath: "inset(0 100% 0 0)", opacity: 0.55 }],
          { duration: 160, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
        );
        releaseAnimation.addEventListener("finish", () => {
          releaseAnimation = null;
          progress.style.clipPath = "inset(0 100% 0 0)";
          progress.style.opacity = "";
        }, { once: true });
      }
      setStatus(button.dataset.cancelLabel || "Cancelled");
      button.dispatchEvent(new CustomEvent("motion:cancel", { bubbles: true }));
    };
    const run = () => {
      if (completed || (pointerId === null && !keyboard)) return;
      window.clearTimeout(timer);
      timer = 0;
      if (progressAnimation) progressAnimation.cancel();
      if (releaseAnimation) releaseAnimation.cancel();
      progressAnimation = null;
      releaseAnimation = null;
      const total = Math.max(1, config.duration);
      const remaining = Math.max(0, deadline - performance.now());
      const value = Math.min(1, Math.max(0, 1 - remaining / total));
      button.dataset.state = "holding";
      button.setAttribute("aria-pressed", "false");
      label.textContent = button.dataset.holdMessage || "Hold to confirm";
      setStatus(button.dataset.holdMessage || "Hold to confirm");
      if (remaining === 0) { complete(); return; }
      if (reduced()) {
        progress.style.clipPath = "inset(0 75% 0 0)";
        progress.style.opacity = "0.55";
        timer = window.setTimeout(complete, remaining);
        return;
      }
      progress.style.opacity = "";
      progressAnimation = progress.animate(
        [
          { clipPath: "inset(0 " + String((1 - value) * 100) + "% 0 0)" },
          { clipPath: "inset(0 0 0 0)" }
        ],
        { duration: remaining, easing: "linear", fill: "forwards" }
      );
      progressAnimation.addEventListener("finish", complete, { once: true });
    };
    const start = () => { deadline = performance.now() + Math.max(1, config.duration); run(); };
    const pointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || pointerId !== null || keyboard) return;
      if (completed) resetVisual();
      pointerId = event.pointerId;
      button.setPointerCapture(event.pointerId);
      start();
    };
    const pointerEnd = (event) => {
      if (event.pointerId !== pointerId) return;
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      if (!completed) cancelHold();
    };
    const keyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (event.repeat || keyboard || pointerId !== null) return;
      if (completed) resetVisual();
      keyboard = true;
      start();
    };
    const keyUp = (event) => {
      if ((event.key !== "Enter" && event.key !== " ") || !keyboard) return;
      event.preventDefault();
      keyboard = false;
      if (!completed) cancelHold();
    };
    const blur = () => { if (keyboard && !completed) cancelHold(); };
    watchReduced(run);
    on(button, "pointerdown", pointerDown);
    on(button, "pointerup", pointerEnd);
    on(button, "pointercancel", pointerEnd);
    on(button, "keydown", keyDown);
    on(button, "keyup", keyUp);
    on(button, "blur", blur);
    return cleanup;
`;

const copiedDragRuntime = String.raw`
    const list = root.querySelector("[data-reorder-list]");
    const status = root.querySelector("[data-motion-status]");
    if (!list) return cleanup;
    const items = Array.from(list.querySelectorAll("[data-reorder-item]"));
    const initialStatus = status ? status.textContent : "";
    const animations = new Set();
    let pointerId = null;
    let activeItem = null;
    let placeholder = null;
    let originalNext = null;
    let dropTarget = null;
    let startX = 0;
    let startY = 0;
    let keyboardItem = null;
    let keyboardStart = -1;
    const announce = (message) => { if (status) status.textContent = message; };
    const resetStyles = (item) => {
      item.classList.remove("is-dragging");
      ["position", "inset", "width", "height", "zIndex", "pointerEvents", "transform", "opacity"].forEach((property) => {
        item.style[property] = "";
      });
    };
    const clearTarget = () => {
      if (dropTarget) dropTarget.classList.remove("is-drop-target");
      dropTarget = null;
    };
    const finish = (cancelled) => {
      if (pointerId === null || !activeItem || !placeholder) return;
      if (root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
      const item = activeItem;
      const from = item.getBoundingClientRect();
      if (cancelled) list.insertBefore(placeholder, originalNext);
      placeholder.replaceWith(item);
      resetStyles(item);
      const to = item.getBoundingClientRect();
      if (cancelled) {
        announce(item.dataset.cancelLabel || "Move cancelled");
      } else {
        const animation = item.animate(
          [
            { transform: "translate3d(" + String(from.left - to.left) + "px, " + String(from.top - to.top) + "px, 0)", opacity: 0.94 },
            { transform: "translate3d(0, 0, 0)", opacity: 1 }
          ],
          { duration: Math.min(180, config.duration || 180), easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
        animations.add(animation);
        const forget = () => animations.delete(animation);
        animation.addEventListener("finish", forget, { once: true });
        animation.addEventListener("cancel", forget, { once: true });
        announce(item.dataset.dropLabel || "Item moved");
        item.dispatchEvent(new CustomEvent("motion:reorder", {
          bubbles: true,
          detail: { order: Array.from(list.querySelectorAll("[data-reorder-item]")).indexOf(item) }
        }));
      }
      clearTarget();
      pointerId = null;
      activeItem = null;
      placeholder = null;
      originalNext = null;
      item.focus();
    };
    const canonical = () => {
      animations.forEach((animation) => animation.cancel());
      clearTarget();
      if (activeItem && placeholder) {
        if (pointerId !== null && root.hasPointerCapture(pointerId)) root.releasePointerCapture(pointerId);
        list.insertBefore(placeholder, originalNext);
        placeholder.replaceWith(activeItem);
        resetStyles(activeItem);
      }
      if (keyboardItem && keyboardStart >= 0) {
        const siblings = Array.from(list.querySelectorAll("[data-reorder-item]")).filter((item) => item !== keyboardItem);
        list.insertBefore(keyboardItem, siblings[keyboardStart] || null);
      }
      items.forEach((item) => {
        resetStyles(item);
        item.classList.remove("is-drop-target", "is-keyboard-dragging");
        item.setAttribute("aria-grabbed", "false");
      });
      if (placeholder) placeholder.remove();
      pointerId = null;
      activeItem = null;
      placeholder = null;
      originalNext = null;
      keyboardItem = null;
      keyboardStart = -1;
      if (status) status.textContent = initialStatus || "";
    };
    addCleanup(canonical);
    const pointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || pointerId !== null) return;
      const item = event.currentTarget;
      const rect = item.getBoundingClientRect();
      pointerId = event.pointerId;
      activeItem = item;
      originalNext = item.nextSibling;
      startX = event.clientX;
      startY = event.clientY;
      placeholder = document.createElement("li");
      placeholder.className = "motion-drop-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.style.height = String(rect.height) + "px";
      list.insertBefore(placeholder, item);
      root.append(item);
      item.classList.add("is-dragging");
      Object.assign(item.style, {
        position: "fixed",
        inset: String(rect.top) + "px auto auto " + String(rect.left) + "px",
        width: String(rect.width) + "px",
        height: String(rect.height) + "px",
        zIndex: "10",
        pointerEvents: "none",
        opacity: "0.94",
        transform: "translate3d(0, 0, 0)"
      });
      root.setPointerCapture(event.pointerId);
      announce(item.dataset.pickupLabel || "Item picked up");
    };
    const pointerMove = (event) => {
      if (event.pointerId !== pointerId || !activeItem || !placeholder) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      activeItem.style.transform = "translate3d(" + String(dx) + "px, " + String(dy) + "px, 0) scale(" + String(Math.max(1, config.dragScale / 100)) + ")";
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const candidate = element ? element.closest("[data-reorder-item]") : null;
      if (!candidate || candidate === activeItem || candidate.parentElement !== list) return;
      clearTarget();
      dropTarget = candidate;
      candidate.classList.add("is-drop-target");
      const rect = candidate.getBoundingClientRect();
      list.insertBefore(placeholder, event.clientY < rect.top + rect.height / 2 ? candidate : candidate.nextSibling);
    };
    const pointerUp = (event) => { if (event.pointerId === pointerId) finish(false); };
    const pointerCancel = (event) => { if (event.pointerId === pointerId) finish(true); };
    const rootKeyDown = (event) => {
      if (event.key === "Escape" && pointerId !== null) { event.preventDefault(); finish(true); }
    };
    const itemKeyDown = (event) => {
      const item = event.currentTarget;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (keyboardItem === item) {
          item.classList.remove("is-keyboard-dragging");
          item.setAttribute("aria-grabbed", "false");
          announce(item.dataset.dropLabel || "Item moved");
          keyboardItem = null;
          keyboardStart = -1;
        } else if (!keyboardItem) {
          keyboardItem = item;
          keyboardStart = Array.from(list.querySelectorAll("[data-reorder-item]")).indexOf(item);
          item.classList.add("is-keyboard-dragging");
          item.setAttribute("aria-grabbed", "true");
          announce(item.dataset.pickupLabel || "Item picked up");
        }
        return;
      }
      if (keyboardItem !== item) return;
      if (event.key === "Escape") {
        event.preventDefault();
        const siblings = Array.from(list.querySelectorAll("[data-reorder-item]")).filter((candidate) => candidate !== item);
        list.insertBefore(item, siblings[keyboardStart] || null);
        item.classList.remove("is-keyboard-dragging");
        item.setAttribute("aria-grabbed", "false");
        announce(item.dataset.cancelLabel || "Move cancelled");
        keyboardItem = null;
        keyboardStart = -1;
        return;
      }
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      const siblings = Array.from(list.querySelectorAll("[data-reorder-item]"));
      const index = siblings.indexOf(item);
      const next = event.key === "ArrowUp" ? index - 1 : index + 1;
      if (next < 0 || next >= siblings.length) return;
      list.insertBefore(item, event.key === "ArrowUp" ? siblings[next] : siblings[next].nextSibling);
      announce(item.dataset.moveLabel || "Position " + String(next + 1));
    };
    items.forEach((item) => {
      on(item, "pointerdown", pointerDown);
      on(item, "keydown", itemKeyDown);
    });
    on(root, "pointermove", pointerMove);
    on(root, "pointerup", pointerUp);
    on(root, "pointercancel", pointerCancel);
    on(root.ownerDocument, "keydown", rootKeyDown);
    return cleanup;
`;

const copiedSwipeRuntime = String.raw`
    const target = root.querySelector("[data-swipe-target]");
    const undo = root.querySelector("[data-swipe-undo]");
    const dismissButton = root.querySelector("[data-swipe-dismiss]");
    const status = root.querySelector("[data-motion-status]");
    if (!target || !undo) return cleanup;
    const initial = {
      status: status ? status.textContent : "",
      targetHidden: target.hidden,
      undoHidden: undo.hidden,
      dismissHidden: dismissButton ? dismissButton.hidden : false,
      ariaHidden: target.getAttribute("aria-hidden")
    };
    let pointerId = null;
    let startX = 0;
    let startTime = 0;
    let rawDistance = 0;
    let activeAnimation = null;
    const announce = (message) => { if (status) status.textContent = message; };
    const clearInline = () => { target.style.transform = ""; target.style.opacity = ""; };
    const canonical = () => {
      if (activeAnimation) activeAnimation.cancel();
      activeAnimation = null;
      if (pointerId !== null && target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
      pointerId = null;
      rawDistance = 0;
      clearInline();
      target.classList.remove("is-dragging", "is-dismissed");
      target.hidden = initial.targetHidden;
      if (initial.ariaHidden === null) target.removeAttribute("aria-hidden");
      else target.setAttribute("aria-hidden", initial.ariaHidden);
      undo.hidden = initial.undoHidden;
      if (dismissButton) dismissButton.hidden = initial.dismissHidden;
      if (status) status.textContent = initial.status || "";
    };
    addCleanup(canonical);
    const settle = () => {
      const transform = getComputedStyle(target).transform;
      const opacity = getComputedStyle(target).opacity;
      if (activeAnimation) activeAnimation.cancel();
      activeAnimation = target.animate(
        reduced()
          ? [{ opacity }, { opacity: 1 }]
          : [{ transform, opacity }, { transform: "translate3d(0, 0, 0)", opacity: 1 }],
        { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      );
      activeAnimation.addEventListener("finish", () => { activeAnimation = null; clearInline(); }, { once: true });
    };
    const dismiss = (direction, keyboard) => {
      const finish = () => {
        activeAnimation = null;
        target.hidden = true;
        target.classList.add("is-dismissed");
        target.setAttribute("aria-hidden", "true");
        if (dismissButton) dismissButton.hidden = true;
        undo.hidden = false;
        clearInline();
        announce(target.dataset.dismissLabel || "Item dismissed");
        target.dispatchEvent(new CustomEvent("motion:dismiss", { bubbles: true }));
        if (keyboard) undo.focus();
      };
      if (keyboard) { finish(); return; }
      const transform = getComputedStyle(target).transform;
      const opacity = getComputedStyle(target).opacity;
      const exit = direction * Math.max(root.clientWidth, config.distance * 2);
      if (activeAnimation) activeAnimation.cancel();
      activeAnimation = target.animate(
        reduced()
          ? [{ opacity }, { opacity: 0 }]
          : [{ transform, opacity }, { transform: "translate3d(" + String(exit) + "px, 0, 0)", opacity: 0 }],
        { duration: 200, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" }
      );
      activeAnimation.addEventListener("finish", finish, { once: true });
    };
    const pointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || pointerId !== null || target.hidden) return;
      if (activeAnimation) activeAnimation.cancel();
      activeAnimation = null;
      pointerId = event.pointerId;
      startX = event.clientX;
      startTime = performance.now();
      rawDistance = 0;
      target.setPointerCapture(event.pointerId);
      target.classList.add("is-dragging");
    };
    const pointerMove = (event) => {
      if (event.pointerId !== pointerId) return;
      rawDistance = event.clientX - startX;
      const resistance = Math.min(0.9, Math.max(0.1, config.resistance / 100));
      const damped = Math.sign(rawDistance) * Math.pow(Math.abs(rawDistance), 0.9) * (1 - resistance);
      const progress = Math.min(1, Math.abs(damped) / Math.max(1, config.distance));
      if (!reduced()) target.style.transform = "translate3d(" + String(damped) + "px, 0, 0)";
      target.style.opacity = String(1 - progress * 0.5);
    };
    const pointerUp = (event) => {
      if (event.pointerId !== pointerId) return;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      target.classList.remove("is-dragging");
      const velocity = Math.abs(rawDistance) / Math.max(1, performance.now() - startTime);
      const threshold = Math.min(96, Math.max(48, config.distance * 0.6));
      const shouldDismiss = Math.abs(rawDistance) >= threshold || velocity > 0.11;
      const direction = rawDistance === 0 ? 1 : Math.sign(rawDistance);
      pointerId = null;
      if (shouldDismiss) dismiss(direction, false);
      else settle();
    };
    const pointerCancel = (event) => {
      if (event.pointerId !== pointerId) return;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      pointerId = null;
      target.classList.remove("is-dragging");
      settle();
    };
    const keyDown = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      event.preventDefault();
      dismiss(event.key === "Delete" ? 1 : -1, true);
    };
    const dismissControl = (event) => dismiss(1, event.detail === 0);
    const restore = () => {
      if (activeAnimation) activeAnimation.cancel();
      target.hidden = false;
      target.classList.remove("is-dismissed");
      target.removeAttribute("aria-hidden");
      undo.hidden = true;
      if (dismissButton) dismissButton.hidden = false;
      const offset = Math.max(root.clientWidth, config.distance * 2);
      activeAnimation = target.animate(
        reduced()
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ transform: "translate3d(" + String(offset) + "px, 0, 0)", opacity: 0 }, { transform: "translate3d(0, 0, 0)", opacity: 1 }],
        { duration: reduced() ? 160 : 200, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }
      );
      announce(undo.dataset.restoreLabel || "Item restored");
      target.focus();
    };
    on(target, "pointerdown", pointerDown);
    on(target, "pointermove", pointerMove);
    on(target, "pointerup", pointerUp);
    on(target, "pointercancel", pointerCancel);
    on(target, "keydown", keyDown);
    if (dismissButton) on(dismissButton, "click", dismissControl);
    on(undo, "click", restore);
    return cleanup;
`;

const copiedSpringRuntime = String.raw`
    const target = root.querySelector("[data-spring-target]");
    const replay = root.querySelector("[data-motion-replay]");
    if (!target || !replay) return cleanup;
    const initialTransform = target.style.transform;
    const initialOpacity = target.style.opacity;
    let frame = 0;
    let fade = null;
    let position = config.distance;
    let velocity = config.velocity * 10;
    let springTarget = 0;
    let previous = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (fade) fade.cancel();
      fade = null;
    };
    const settleReduced = (feedback) => {
      stop();
      position = 0;
      velocity = 0;
      springTarget = 0;
      target.style.transform = "";
      target.style.opacity = "";
      if (feedback) {
        fade = target.animate([{ opacity: 0.72 }, { opacity: 1 }], {
          duration: 160,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
        fade.addEventListener("finish", () => { fade = null; }, { once: true });
      }
    };
    const play = () => {
      if (reduced()) { settleReduced(true); return; }
      if (fade) fade.cancel();
      fade = null;
      const stiffness = Math.max(1, config.stiffness);
      const damping = Math.max(0, config.damping);
      const mass = Math.max(0.1, config.mass);
      const amplitude = Math.max(1, Math.abs(config.distance));
      if (frame) {
        springTarget = Math.abs(springTarget) < 0.01 ? config.distance : 0;
        return;
      }
      if (Math.abs(position) < 0.08) {
        position = config.distance;
        velocity = config.velocity * 10;
        springTarget = 0;
      } else if (Math.abs(position - config.distance) < 0.08) {
        springTarget = 0;
      }
      previous = performance.now();
      target.style.opacity = "0.72";
      const step = (now) => {
        if (reduced()) { settleReduced(true); return; }
        const elapsed = Math.min(0.032, Math.max(0.001, (now - previous) / 1000));
        previous = now;
        const displacement = position - springTarget;
        const acceleration = (-stiffness * displacement - damping * velocity) / mass;
        velocity += acceleration * elapsed;
        position += velocity * elapsed;
        const progress = Math.min(1, Math.abs(displacement) / amplitude);
        target.style.transform = "translate3d(0, " + position.toFixed(3) + "px, 0) scale(" + (1 - progress * 0.06).toFixed(4) + ")";
        target.style.opacity = String(1 - progress * 0.28);
        if (Math.abs(displacement) < 0.08 && Math.abs(velocity) < 0.08) {
          position = springTarget;
          velocity = 0;
          target.style.transform = springTarget === 0 ? "" : "translate3d(0, " + String(springTarget) + "px, 0)";
          target.style.opacity = "";
          frame = 0;
          return;
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    addCleanup(() => {
      stop();
      position = config.distance;
      velocity = config.velocity * 10;
      springTarget = 0;
      target.style.transform = initialTransform;
      target.style.opacity = initialOpacity;
    });
    watchReduced((value) => {
      if (value && frame) settleReduced(true);
      if (!value && fade) {
        fade.cancel();
        fade = null;
        target.style.opacity = "";
      }
    });
    on(replay, "click", play);
    on(target, "click", play);
    if (config.autoplay) play();
    return cleanup;
`;

const copiedRuntimeBodyById: Readonly<Record<string, string>> = {
  "drag-to-reorder": copiedDragRuntime,
  "swipe-to-dismiss": copiedSwipeRuntime,
  "before-after-slider": copiedComparisonRuntime,
  ripple: copiedRippleRuntime,
  "hold-to-confirm": copiedHoldRuntime,
  spring: copiedSpringRuntime,
  crossfade: copiedReplayRuntime,
  morph: copiedReplayRuntime,
  "direction-aware-transition": copiedReplayRuntime,
  "page-transition": copiedReplayRuntime,
  "text-morph": copiedReplayRuntime,
  "number-ticker": copiedReplayRuntime,
  "3d-tilt-flip": copiedReplayRuntime,
  loop: copiedPauseRuntime,
  marquee: copiedPauseRuntime,
  orbit: copiedPauseRuntime,
  "idle-animation": copiedPauseRuntime,
  "skeleton-shimmer": copiedPauseRuntime,
  easing: copiedPauseRuntime
};

const runtimeById: Readonly<Record<string, MotionRuntimeMount>> = {
  "drag-to-reorder": mountDragRuntime,
  "swipe-to-dismiss": mountSwipeRuntime,
  "before-after-slider": mountComparisonRuntime,
  ripple: mountRippleRuntime,
  "hold-to-confirm": mountHoldRuntime,
  spring: mountSpringRuntime,
  crossfade: mountReplayRuntime,
  morph: mountReplayRuntime,
  "direction-aware-transition": mountReplayRuntime,
  "page-transition": mountReplayRuntime,
  "text-morph": mountReplayRuntime,
  "number-ticker": mountReplayRuntime,
  "3d-tilt-flip": mountReplayRuntime,
  loop: mountPauseRuntime,
  marquee: mountPauseRuntime,
  orbit: mountPauseRuntime,
  "idle-animation": mountPauseRuntime,
  "skeleton-shimmer": mountPauseRuntime,
  easing: mountPauseRuntime
};

export function hasMotionRuntime(id: string) {
  return Boolean(runtimeById[id]);
}

export function mountMotionRuntime(root: HTMLElement, config: MotionRuntimeConfig) {
  const mount = runtimeById[config.id];
  return mount ? mount(root, config) : () => undefined;
}

export function buildMotionRuntimeSource(config: MotionRuntimeConfig) {
  const body = copiedRuntimeBodyById[config.id];
  if (!body) return "";
  const selector = `[data-motion="${config.id}"]`;
  return `(() => {
  const config = ${JSON.stringify({ ...config, autoplay: false }, null, 2)};
  const mount = (root, config) => {
${copiedRuntimeHelpers}${body}  };
  document.querySelectorAll(${JSON.stringify(selector)}).forEach((root) => {
    const cleanupKey = "__motionLexiconCleanup";
    if (typeof root[cleanupKey] === "function") root[cleanupKey]();
    root[cleanupKey] = mount(root, config);
  });
})();`;
}
