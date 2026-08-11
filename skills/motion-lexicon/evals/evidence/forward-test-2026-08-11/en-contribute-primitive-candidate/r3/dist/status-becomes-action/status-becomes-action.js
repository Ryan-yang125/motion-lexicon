const labels = {
  idle: ["↑", "Generate export", "Export will include 24 selected orders.", "Ready to create an export."],
  pending: ["◌", "Preparing export…", "Collecting the selected orders.", "Preparing export. Press Escape to cancel."],
  ready: ["↓", "Download export", "Export-24-orders.csv is ready.", "Export ready. Download export is now available."],
  failure: ["↻", "Try again", "The export was not created.", "Export failed. Try again is available."],
  recovery: ["◌", "Retrying export…", "Starting a fresh export request.", "Retrying export."],
  terminal: ["✓", "Create another export", "Export-24-orders.csv was handed to your browser.", "Download started. Create another export is available."]
};

/**
 * Mount the primitive. `operation` receives an AbortSignal and returns a result.
 * `nextAction` receives that result after completion. Both callbacks are product-owned.
 */
export function createStatusAction(root, { operation = demoOperation, nextAction = demoNextAction } = {}) {
  const button = root.querySelector("[data-action]");
  const label = root.querySelector("[data-label]");
  const icon = root.querySelector("[data-icon]");
  const record = root.querySelector("[data-record]");
  const message = root.querySelector("[data-message]");
  let controller = null;
  let intentVersion = 0;
  let result = null;

  const animateReplacement = (element, state) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isFailure = state === "failure";
    element.getAnimations().forEach((animation) => animation.cancel());
    element.animate(
      [
        { opacity: 0.25, transform: `translateY(${isFailure ? "-4px" : "8px"}) scale(.98)` },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ],
      {
        duration: isFailure ? 150 : state === "pending" ? 160 : element === record ? 180 : 240,
        easing: "cubic-bezier(.23, 1, .32, 1)",
        fill: "none"
      }
    );
  };

  const setState = (state) => {
    const [nextIcon, nextLabel, nextRecord, nextMessage] = labels[state];
    root.dataset.state = state;
    icon.textContent = nextIcon;
    label.textContent = nextLabel;
    record.textContent = nextRecord;
    message.textContent = nextMessage;
    animateReplacement(label, state);
    animateReplacement(record, state);
  };

  const begin = async (isRetry = false) => {
    controller?.abort();
    const localVersion = ++intentVersion;
    controller = new AbortController();
    setState(isRetry ? "recovery" : "pending");
    if (isRetry) await new Promise((resolve) => setTimeout(resolve, 1));
    setState("pending");
    try {
      const nextResult = await operation({ signal: controller.signal, intentVersion: localVersion });
      if (localVersion !== intentVersion || controller.signal.aborted) return;
      result = nextResult;
      setState("ready");
    } catch (error) {
      if (localVersion !== intentVersion || controller.signal.aborted) return;
      setState("failure");
    }
  };

  button.addEventListener("click", async () => {
    const state = root.dataset.state;
    if (state === "ready") {
      const localVersion = ++intentVersion;
      setState("terminal");
      await nextAction(result);
      if (localVersion !== intentVersion) return;
      return;
    }
    if (state === "terminal") return begin();
    begin(state === "failure");
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.dataset.state === "pending") {
      controller?.abort();
      ++intentVersion;
      setState("idle");
      button.focus();
    }
  });

  return { begin, destroy: () => controller?.abort() };
}

function demoOperation({ signal, intentVersion }) {
  const failOnce = new URLSearchParams(window.location.search).get("outcome") === "fail-once" && intentVersion === 1;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => failOnce ? reject(new Error("Demo failure")) : resolve({ filename: "Export-24-orders.csv" }), 360);
    signal.addEventListener("abort", () => { window.clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });
}

function demoNextAction() { return Promise.resolve(); }

document.querySelectorAll("[data-status-action]").forEach((root) => createStatusAction(root));
