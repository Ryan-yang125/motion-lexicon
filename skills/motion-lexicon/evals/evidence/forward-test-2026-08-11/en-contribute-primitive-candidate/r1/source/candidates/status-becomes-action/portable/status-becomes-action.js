const ACTIVE_STATES = new Set(["pending", "complete", "recovery"]);
const OPERABLE_STATES = new Set(["idle", "failure", "action-ready"]);

function numberFromData(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function after(delay, callback) {
  return window.setTimeout(callback, delay);
}

export class StatusBecomesAction {
  constructor(root) {
    this.root = root;
    this.control = root.querySelector(".status-action__control");
    this.live = root.querySelector(".status-action__live");
    this.state = root.dataset.state || "idle";
    this.version = 0;
    this.attempts = 0;
    this.timers = new Set();
    this.operationMs = numberFromData(root.dataset.operationMs, 600);
    this.confirmationMs = numberFromData(root.dataset.confirmationMs, 650);
    this.failuresBeforeSuccess = numberFromData(root.dataset.failuresBeforeSuccess, 0);

    if (!(this.control instanceof HTMLButtonElement) || !(this.live instanceof HTMLElement)) {
      throw new Error("StatusBecomesAction requires a native button and a live status region.");
    }

    this.handleActivate = this.handleActivate.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.control.addEventListener("click", this.handleActivate);
    this.control.addEventListener("keydown", this.handleKeydown);
    this.setState(this.state, "");
  }

  get copy() {
    return {
      idle: this.root.dataset.idleLabel || "Start",
      pending: this.root.dataset.pendingLabel || "Working…",
      complete: this.root.dataset.successLabel || "Complete",
      "action-ready": this.root.dataset.actionLabel || "Continue",
      failure: this.root.dataset.failureLabel || "Try again",
      recovery: this.root.dataset.pendingLabel || "Retrying…",
      next: this.root.dataset.terminalLabel || "Opened",
    };
  }

  clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  schedule(delay, callback) {
    const timer = after(delay, () => {
      this.timers.delete(timer);
      callback();
    });
    this.timers.add(timer);
  }

  announce(message) {
    this.live.textContent = message;
  }

  setState(state, announcement) {
    this.state = state;
    this.root.dataset.state = state;
    this.root.dataset.attempts = String(this.attempts);
    this.control.setAttribute("aria-label", this.copy[state]);
    this.control.setAttribute("aria-busy", state === "pending" ? "true" : "false");
    this.control.setAttribute(
      "aria-disabled",
      OPERABLE_STATES.has(state) ? "false" : "true",
    );
    if (announcement) this.announce(announcement);
    this.root.dispatchEvent(
      new CustomEvent("statusaction:statechange", {
        bubbles: true,
        detail: { state, attempts: this.attempts },
      }),
    );
  }

  handleActivate() {
    if (this.state === "action-ready") {
      this.invokeNextAction();
      return;
    }

    if (this.state === "idle" || this.state === "failure") {
      this.startOperation(this.state === "failure");
      return;
    }

    if (ACTIVE_STATES.has(this.state)) {
      this.root.dispatchEvent(
        new CustomEvent("statusaction:repeat", { bubbles: true }),
      );
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape" && ACTIVE_STATES.has(this.state)) {
      event.preventDefault();
      this.cancel();
    }
  }

  startOperation(isRetry) {
    this.version += 1;
    const currentVersion = this.version;
    this.clearTimers();

    if (isRetry) {
      this.setState("recovery", "Retry acknowledged.");
      this.schedule(80, () => this.beginPending(currentVersion));
      return;
    }

    this.beginPending(currentVersion);
  }

  beginPending(currentVersion) {
    if (currentVersion !== this.version) return;
    this.attempts += 1;
    this.setState("pending", this.root.dataset.pendingStatus || "Working.");
    this.schedule(this.operationMs, () => this.finishOperation(currentVersion));
  }

  finishOperation(currentVersion) {
    if (currentVersion !== this.version || this.state !== "pending") return;

    if (this.attempts <= this.failuresBeforeSuccess) {
      this.setState(
        "failure",
        this.root.dataset.failureStatus || "The operation failed. Try again.",
      );
      return;
    }

    this.setState("complete", this.root.dataset.successStatus || "Complete.");
    this.schedule(this.confirmationMs, () => {
      if (currentVersion !== this.version || this.state !== "complete") return;
      this.setState(
        "action-ready",
        this.root.dataset.readyStatus || "Complete. The next action is ready.",
      );
    });
  }

  cancel() {
    this.version += 1;
    this.clearTimers();
    this.setState("idle", "Operation canceled.");
  }

  invokeNextAction() {
    this.version += 1;
    this.clearTimers();
    this.setState(
      "next",
      this.root.dataset.terminalStatus || "The next action was invoked.",
    );
    this.root.dispatchEvent(
      new CustomEvent("statusaction:next", {
        bubbles: true,
        detail: { label: this.copy["action-ready"] },
      }),
    );
  }

  destroy() {
    this.version += 1;
    this.clearTimers();
    this.control.removeEventListener("click", this.handleActivate);
    this.control.removeEventListener("keydown", this.handleKeydown);
  }
}

document.querySelectorAll("[data-status-action]").forEach((root) => {
  const instance = new StatusBecomesAction(root);
  root.statusBecomesAction = instance;
});
