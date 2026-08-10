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
  it("focuses the first item when ArrowDown reopens an already mounted menu", () => {
    render(<MegaMenu label="Product navigation" sections={[product]} />);
    const trigger = screen.getByRole("button", { name: "Product" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu", { name: "Product" })).toBeInTheDocument();
    expect(trigger).toHaveFocus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    expect(screen.getByRole("menuitem", { name: "Overview" })).toHaveFocus();
  });

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

  it("keeps the focused link id when links are reordered", () => {
    const links = [
      { id: "alpha", label: "Alpha", onSelect: vi.fn() },
      { id: "beta", label: "Beta", onSelect: vi.fn() },
      { id: "gamma", label: "Gamma", onSelect: vi.fn() },
    ];
    const section = (nextLinks: typeof links): MegaMenuSection => ({
      id: "product",
      label: "Product",
      links: nextLinks,
    });
    const { rerender } = render(
      <MegaMenu label="Product navigation" sections={[section(links)]} />,
    );
    const trigger = screen.getByRole("button", { name: "Product" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const alphaLink = screen.getByRole("menuitem", { name: "Alpha" });
    fireEvent.keyDown(alphaLink, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Beta" })).toHaveFocus();

    rerender(
      <MegaMenu
        label="Product navigation"
        sections={[section([links[2], links[1], links[0]])]}
      />,
    );

    const betaLink = screen.getByRole("menuitem", { name: "Beta" });
    expect(betaLink).toHaveFocus();
    expect(betaLink).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("menuitem", { name: "Gamma" })).toHaveAttribute("tabindex", "-1");
  });

  it("focuses the new last link when the active last link is deleted", () => {
    const links = [
      { id: "alpha", label: "Alpha", onSelect: vi.fn() },
      { id: "beta", label: "Beta", onSelect: vi.fn() },
      { id: "gamma", label: "Gamma", onSelect: vi.fn() },
    ];
    const section = (nextLinks: typeof links): MegaMenuSection => ({
      id: "product",
      label: "Product",
      links: nextLinks,
    });
    const { rerender } = render(
      <MegaMenu label="Product navigation" sections={[section(links)]} />,
    );
    const trigger = screen.getByRole("button", { name: "Product" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Alpha" }), { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Gamma" })).toHaveFocus();

    rerender(
      <MegaMenu
        label="Product navigation"
        sections={[section([links[0], links[1]])]}
      />,
    );

    const betaLink = screen.getByRole("menuitem", { name: "Beta" });
    expect(betaLink).toHaveFocus();
    expect(betaLink).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("menuitem", { name: "Alpha" })).toHaveAttribute("tabindex", "-1");
  });

  it("closes an emptied panel and returns focus to its section trigger", async () => {
    const links = [{ id: "alpha", label: "Alpha", onSelect: vi.fn() }];
    const { rerender } = render(
      <MegaMenu
        label="Product navigation"
        sections={[{ id: "product", label: "Product", links }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Product" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Alpha" })).toHaveFocus();

    rerender(
      <MegaMenu
        label="Product navigation"
        sections={[{ id: "product", label: "Product", links: [] }]}
      />,
    );

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    await waitFor(() => {
      expect(screen.queryByRole("menu", { name: "Product" })).not.toBeInTheDocument();
    });
  });
});
