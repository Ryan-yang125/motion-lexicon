// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeReveal } from "@/registry/components/theme-reveal";

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
};

const deferred = (): Deferred => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((accept, decline) => {
    resolve = accept;
    reject = decline;
  });
  return { promise, resolve, reject };
};

let reduced = false;

beforeEach(() => {
  reduced = false;
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: reduced,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: undefined,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: undefined,
  });
});

describe("ThemeReveal", () => {
  it("locks duplicate activation until a direct theme change completes", async () => {
    const first = deferred();
    const second = deferred();
    const onThemeChange = vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    render(<ThemeReveal theme="light" onThemeChange={onThemeChange} />);
    const trigger = screen.getByRole("button", { name: "Use dark theme" });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(trigger).toBeEnabled();
    expect(trigger).toHaveAttribute("aria-busy", "true");
    expect(trigger).toHaveAttribute("aria-disabled", "true");

    trigger.focus();
    expect(trigger).toHaveFocus();

    await act(async () => { first.resolve(); });

    await waitFor(() => expect(trigger).not.toHaveAttribute("aria-busy"));
    expect(trigger).toHaveFocus();
    expect(trigger).not.toHaveAttribute("aria-busy");
    expect(trigger).not.toHaveAttribute("aria-disabled");

    fireEvent.click(trigger);
    expect(onThemeChange).toHaveBeenCalledTimes(2);
    await act(async () => { second.resolve(); });
  });

  it("uses the same lock when reduced motion bypasses View Transitions", async () => {
    reduced = true;
    const change = deferred();
    const onThemeChange = vi.fn(() => change.promise);
    const startViewTransition = vi.fn();
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });
    render(<ThemeReveal theme="dark" onThemeChange={onThemeChange} />);
    const trigger = screen.getByRole("button", { name: "Use light theme" });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(trigger).toBeEnabled();
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    await act(async () => { change.resolve(); });
    await waitFor(() => expect(trigger).not.toHaveAttribute("aria-disabled"));
  });

  it("holds the lock through the View Transition and restores it afterward", async () => {
    const change = deferred();
    const finished = deferred();
    const onThemeChange = vi.fn(() => change.promise);
    const animate = vi.fn();
    Object.defineProperty(document.documentElement, "animate", {
      configurable: true,
      value: animate,
    });
    const startViewTransition = vi.fn((update: () => void | Promise<void>) => {
      void update();
      return { ready: Promise.resolve(), finished: finished.promise };
    });
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });
    render(<ThemeReveal theme="light" onThemeChange={onThemeChange} />);
    const trigger = screen.getByRole("button", { name: "Use dark theme" });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(trigger).toBeEnabled();
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    await act(async () => { change.resolve(); });
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    await act(async () => { finished.resolve(); });
    await waitFor(() => expect(trigger).not.toHaveAttribute("aria-disabled"));
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("restores activation after an async theme change rejects", async () => {
    const change = deferred();
    const onThemeChange = vi.fn(() => change.promise);
    const onError = vi.fn();
    render(<ThemeReveal theme="light" onThemeChange={onThemeChange} onError={onError} />);
    const trigger = screen.getByRole("button", { name: "Use dark theme" });

    fireEvent.click(trigger);
    await act(async () => { change.reject(new Error("theme failed")); });

    await waitFor(() => expect(trigger).not.toHaveAttribute("aria-busy"));
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: "theme failed" }));
    expect(trigger).not.toHaveAttribute("aria-busy");
  });
});
