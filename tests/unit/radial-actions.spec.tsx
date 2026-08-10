// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RadialActions,
  type RadialAction,
} from "@/registry/components/radial-actions";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => true };
});

const alpha: RadialAction = {
  id: "alpha",
  label: "Alpha action",
  icon: <span>A</span>,
  onSelect: vi.fn(),
};
const beta: RadialAction = {
  id: "beta",
  label: "Beta action",
  icon: <span>B</span>,
  onSelect: vi.fn(),
};
const gamma: RadialAction = {
  id: "gamma",
  label: "Gamma action",
  icon: <span>G</span>,
  onSelect: vi.fn(),
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RadialActions", () => {
  it("keeps focus by id through reorder and chooses a nearby replacement", () => {
    const { rerender } = render(
      <RadialActions
        label="Canvas actions"
        trigger={<span>+</span>}
        actions={[alpha, beta, gamma]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Canvas actions" }));
    const alphaButton = screen.getByRole("menuitem", { name: "Alpha action" });
    fireEvent.keyDown(alphaButton, { key: "ArrowRight" });
    expect(screen.getByRole("menuitem", { name: "Beta action" })).toHaveFocus();

    rerender(
      <RadialActions
        label="Canvas actions"
        trigger={<span>+</span>}
        actions={[gamma, beta, alpha]}
      />,
    );
    const reorderedBeta = screen.getByRole("menuitem", { name: "Beta action" });
    expect(reorderedBeta).toHaveFocus();
    expect(reorderedBeta).toHaveAttribute("tabindex", "0");

    rerender(
      <RadialActions
        label="Canvas actions"
        trigger={<span>+</span>}
        actions={[gamma, alpha]}
      />,
    );
    const replacement = screen.getByRole("menuitem", { name: "Alpha action" });
    expect(replacement).toHaveFocus();
    expect(replacement).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("menuitem", { name: "Gamma action" })).toHaveAttribute("tabindex", "-1");
  });

  it("closes and restores trigger semantics when actions become empty", async () => {
    const { rerender } = render(
      <RadialActions
        label="Canvas actions"
        trigger={<span>+</span>}
        actions={[alpha, beta]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Canvas actions" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls");
    expect(screen.getByRole("menu", { name: "Canvas actions" })).toBeInTheDocument();

    rerender(
      <RadialActions label="Canvas actions" trigger={<span>+</span>} actions={[]} />,
    );

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).not.toBeDisabled();
    expect(trigger).toHaveFocus();
    await waitFor(() => {
      expect(screen.queryByRole("menu", { name: "Canvas actions" })).not.toBeInTheDocument();
    });
  });
});
