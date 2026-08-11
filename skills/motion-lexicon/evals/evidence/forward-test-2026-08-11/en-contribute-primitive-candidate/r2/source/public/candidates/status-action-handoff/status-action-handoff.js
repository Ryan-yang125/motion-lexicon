const instances = new WeakMap();

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const copyFor = (root, key, fallback = "") => root.dataset[key] || fallback;

class StatusActionHandoff {
  constructor(root) {
    this.root = root;
    this.action = root.querySelector("[data-action]");
    this.operationLabel = root.querySelector("[data-operation-label]");
    this.nextLabel = root.querySelector("[data-next-label]");
    this.status = root.querySelector("[data-status]");
    this.result = root.querySelector("[data-result]");
    this.timer = 0;
    this.requestVersion = 0;
    this.hasFailed = false;

    if (!this.action || !this.operationLabel || !this.nextLabel || !this.status || !this.result) {
      throw new Error("status-action-handoff: required data hooks are missing");
    }

    this.onActivate = this.onActivate.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.action.addEventListener("click", this.onActivate);
    this.action.addEventListener("keydown", this.onKeyDown);
    this.setState("idle", copyFor(root, "idleStatus", "Ready."));
  }

  get state() {
    return this.root.dataset.state || "idle";
  }

  setState(state, message) {
    this.root.dataset.state = state;
    this.status.textContent = message;
    this.root.dataset.requestVersion = String(this.requestVersion);

    const labels = {
      idle: copyFor(this.root, "idleLabel", "Start"),
      pending: copyFor(this.root, "pendingLabel", "Working…"),
      failure: copyFor(this.root, "retryLabel", "Try again"),
      recovering: copyFor(this.root, "recoveringLabel", "Retrying…"),
    };

    if (labels[state]) this.operationLabel.textContent = labels[state];
    const nextActionIsCurrent = state === "ready" || state === "opened";
    const accessibleLabel = nextActionIsCurrent
      ? copyFor(this.root, "nextLabel", "Continue")
      : labels[state] || copyFor(this.root, "idleLabel", "Start");

    this.action.setAttribute("aria-label", accessibleLabel);
    this.action.setAttribute("aria-disabled", state === "pending" || state === "recovering" ? "true" : "false");

    this.root.dispatchEvent(
      new CustomEvent("status-action:statechange", {
        bubbles: true,
        detail: { state, requestVersion: this.requestVersion },
      }),
    );
  }

  onActivate() {
    if (this.state === "pending" || this.state === "recovering") {
      this.status.textContent = copyFor(this.root, "repeatStatus", "The operation is already in progress.");
      return;
    }

    if (this.state === "ready" || this.state === "opened") {
      this.openResult();
      return;
    }

    if (this.state === "failure") {
      this.setState("recovering", copyFor(this.root, "recoveringStatus", "Retry accepted."));
      window.setTimeout(() => this.startOperation(), prefersReducedMotion() ? 0 : 120);
      return;
    }

    this.startOperation();
  }

  onKeyDown(event) {
    if (event.key === "Escape" && this.state === "pending") {
      event.preventDefault();
      this.cancel();
    }
  }

  startOperation() {
    window.clearTimeout(this.timer);
    this.requestVersion += 1;
    const version = this.requestVersion;
    this.setState("pending", copyFor(this.root, "pendingStatus", "Working…"));

    const delay = Number(this.root.dataset.delay || 640);
    this.timer = window.setTimeout(() => {
      if (version !== this.requestVersion) return;
      const shouldFail = this.root.dataset.failFirst === "true" && !this.hasFailed;
      if (shouldFail) {
        this.hasFailed = true;
        this.setState("failure", copyFor(this.root, "failureStatus", "The operation failed. Try again."));
        return;
      }

      this.setState("ready", copyFor(this.root, "readyStatus", "Complete. The next action is ready."));
    }, delay);
  }

  cancel() {
    window.clearTimeout(this.timer);
    this.requestVersion += 1;
    this.setState("idle", copyFor(this.root, "cancelStatus", "Cancelled. Ready to try again."));
    this.action.focus({ preventScroll: true });
  }

  openResult() {
    this.result.textContent = copyFor(this.root, "result", "The next step is open.");
    this.result.closest("[data-result-well]")?.setAttribute("data-revealed", "true");
    this.setState("opened", copyFor(this.root, "openedStatus", "The next step is open."));
  }

  destroy() {
    window.clearTimeout(this.timer);
    this.action.removeEventListener("click", this.onActivate);
    this.action.removeEventListener("keydown", this.onKeyDown);
    instances.delete(this.root);
  }
}

export function initStatusActionHandoffs(scope = document) {
  return [...scope.querySelectorAll("[data-status-action]")].map((root) => {
    if (!instances.has(root)) instances.set(root, new StatusActionHandoff(root));
    return instances.get(root);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initStatusActionHandoffs(), { once: true });
} else {
  initStatusActionHandoffs();
}
