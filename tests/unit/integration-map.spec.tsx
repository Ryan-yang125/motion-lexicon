// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntegrationMap, type IntegrationNode } from "@/registry/components/integration-map";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => true };
});

const removed: IntegrationNode = {
  id: "removed",
  label: "Removed service",
  x: 90,
  y: 80,
};

const remaining: IntegrationNode = {
  id: "remaining",
  label: "Remaining service",
  x: 250,
  y: 80,
};

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      media: "(hover: hover) and (pointer: fine)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("IntegrationMap", () => {
  it("clears selection when the selected node is removed", async () => {
    const { rerender } = render(
      <IntegrationMap nodes={[removed, remaining]} edges={[]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Removed service" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Removed service connections highlighted",
    );

    rerender(<IntegrationMap nodes={[remaining]} edges={[]} />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
      expect(screen.getByRole("button", { name: "Remaining service" })).toHaveStyle({
        opacity: "1",
      });
    });

    rerender(<IntegrationMap nodes={[removed, remaining]} edges={[]} />);
    expect(screen.getByRole("button", { name: "Removed service" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
