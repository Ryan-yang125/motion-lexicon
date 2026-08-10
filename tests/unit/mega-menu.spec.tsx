// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MegaMenu,
  type MegaMenuSection,
} from "@/registry/components/mega-menu";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => true };
});

const product: MegaMenuSection = {
  id: "product",
  label: "Product",
  links: [{ id: "overview", label: "Overview", onSelect: vi.fn() }],
};
const resources: MegaMenuSection = {
  id: "resources",
  label: "Resources",
  links: [{ id: "guides", label: "Guides", onSelect: vi.fn() }],
};

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", vi.fn());
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MegaMenu", () => {
  it("closes instead of falling back when the active section is removed", async () => {
    const { rerender } = render(
      <MegaMenu label="Product navigation" sections={[product, resources]} />,
    );
    const resourcesTrigger = screen.getByRole("button", { name: "Resources" });
    resourcesTrigger.focus();
    fireEvent.click(resourcesTrigger);

    expect(resourcesTrigger).toHaveAttribute("aria-expanded", "true");
    expect(resourcesTrigger).toHaveAttribute("aria-controls");
    expect(screen.getByRole("menu", { name: "Resources" })).toBeInTheDocument();

    rerender(<MegaMenu label="Product navigation" sections={[product]} />);

    const productTrigger = screen.getByRole("button", { name: "Product" });
    expect(productTrigger).toHaveAttribute("aria-expanded", "false");
    expect(productTrigger).not.toHaveAttribute("aria-controls");
    expect(screen.queryByRole("menu", { name: "Product" })).not.toBeInTheDocument();
    expect(productTrigger).toHaveFocus();
    await waitFor(() => {
      expect(screen.queryByRole("menu", { name: "Resources" })).not.toBeInTheDocument();
    });
  });
});
