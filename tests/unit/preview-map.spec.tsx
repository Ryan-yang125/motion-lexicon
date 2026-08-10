// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeferredPreview } from "@/registry/preview-map";

let intersectionCallback: IntersectionObserverCallback;

class IntersectionObserverStub {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "420px 0px";
  thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
}

function StatefulPreview() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((value) => value + 1)}>Count {count}</button>;
}

function setIntersecting(isIntersecting: boolean) {
  act(() => {
    intersectionCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DeferredPreview", () => {
  it("keeps a heavy interactive preview mounted after its first intersection", () => {
    const { container } = render(
      <DeferredPreview id="heavy-demo" deferred heavy>
        <StatefulPreview />
      </DeferredPreview>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelector(".registry-preview-loading")).toBeInTheDocument();

    setIntersecting(true);
    const button = screen.getByRole("button", { name: "Count 0" });
    button.focus();
    fireEvent.click(button);
    expect(button).toHaveTextContent("Count 1");

    setIntersecting(false);
    expect(screen.getByRole("button", { name: "Count 1" })).toBe(button);
    expect(button).toHaveFocus();
  });

  it("keeps a never-visible deferred preview on its placeholder", () => {
    const { container } = render(
      <DeferredPreview id="heavy-demo" deferred heavy>
        <StatefulPreview />
      </DeferredPreview>,
    );

    setIntersecting(false);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelector(".registry-preview-loading")).toBeInTheDocument();
  });
});
