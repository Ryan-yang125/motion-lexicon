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
  it("keeps the map label on its empty group", () => {
    render(
      <IntegrationMap
        nodes={[]}
        edges={[]}
        label="Payment integrations"
        emptyLabel="No payment integrations"
      />,
    );

    const group = screen.getByRole("group", { name: "Payment integrations" });
    expect(group).toContainElement(screen.getByRole("status"));
    expect(screen.getByRole("status")).toHaveTextContent("No payment integrations");
  });

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
      expect(screen.getByRole("button", { name: "Remaining service" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    rerender(<IntegrationMap nodes={[removed, remaining]} edges={[]} />);
    expect(screen.getByRole("button", { name: "Removed service" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("keeps node hit targets at least 44 CSS pixels as the SVG scales", () => {
    const { container } = render(
      <IntegrationMap nodes={[removed]} edges={[]} width={440} height={230} />,
    );

    const node = screen.getByRole("button", { name: "Removed service" });
    expect(node.tagName).toBe("BUTTON");
    expect(node).toHaveClass("min-h-11", "min-w-11");
    expect(node.style.width).toBe(`${(96 / 440) * 100}%`);
    expect(node.style.height).toBe(`${(44 / 230) * 100}%`);
    expect(node.style.minWidth).toBe("44px");
    expect(node.style.minHeight).toBe("44px");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("restores keyboard focus highlighting after a pointer hover ends", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        media: "(hover: hover) and (pointer: fine)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      })),
    );
    render(<IntegrationMap nodes={[removed, remaining]} edges={[]} />);
    const keyboardNode = screen.getByRole("button", { name: removed.label });
    const hoveredNode = screen.getByRole("button", { name: remaining.label });
    const status = screen.getByRole("status");

    fireEvent.focus(keyboardNode);
    expect(status).toHaveTextContent("Removed service connections highlighted");

    fireEvent.mouseEnter(hoveredNode);
    expect(status).toHaveTextContent("Remaining service connections highlighted");

    fireEvent.mouseLeave(hoveredNode);
    expect(status).toHaveTextContent("Removed service connections highlighted");

    fireEvent.blur(keyboardNode);
    expect(status).toBeEmptyDOMElement();
  });
});
