// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeferredPreview, RegistryPreview } from "@/registry/preview-map";
import { PrimitivePreview } from "@/registry/primitive-preview-map";
import { getCatalogRecipe } from "@/data/recipes";
import { getDefaultParamValues } from "@/lib/motion-engine";

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

describe("preview hydration", () => {
  it("keeps a component preview on the same placeholder through hydration", async () => {
    const html = renderToString(<RegistryPreview id="copy-button" locale="en" />);
    expect(html).toContain("registry-preview-loading");
    expect(html).not.toContain("react-error-boundary");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const recoverable = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(container, <RegistryPreview id="copy-button" locale="en" />, {
        onRecoverableError: recoverable,
      });
    });

    await waitFor(() => expect(container.querySelector("button")).toBeInTheDocument());
    expect(recoverable).not.toHaveBeenCalled();
    act(() => root?.unmount());
    container.remove();
  });

  it("keeps a page block preview on the same source registry through hydration", async () => {
    const html = renderToString(<RegistryPreview id="product-landing" locale="en" />);
    expect(html).toContain("registry-preview-loading");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const recoverable = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(container, <RegistryPreview id="product-landing" locale="en" />, {
        onRecoverableError: recoverable,
      });
    });

    await waitFor(() => expect(container.querySelector('[data-page-block="product-landing"]')).toBeInTheDocument());
    expect(container.querySelector('[data-registry-kind="block"]')).toBeInTheDocument();
    expect(recoverable).not.toHaveBeenCalled();
    act(() => root?.unmount());
    container.remove();
  });

  it("keeps an executable primitive on the same placeholder through hydration", async () => {
    const recipe = getCatalogRecipe("slide-in");
    expect(recipe).toBeDefined();
    if (!recipe) return;
    const values = getDefaultParamValues(recipe);
    const preview = <PrimitivePreview locale="en" recipe={recipe} values={values} />;
    const html = renderToString(preview);
    expect(html).toContain("registry-preview-loading");
    expect(html).not.toContain("The server did not finish this Suspense boundary");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const recoverable = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(container, preview, { onRecoverableError: recoverable });
    });

    await waitFor(() => expect(container.querySelector(".registry-preview-loading")).not.toBeInTheDocument());
    expect(recoverable).not.toHaveBeenCalled();
    act(() => root?.unmount());
    container.remove();
  });
});
