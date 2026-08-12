// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityFeed } from "@/registry/components/activity-feed";
import { FloatingDock } from "@/registry/components/floating-dock";
import { ImageLightbox } from "@/registry/components/image-lightbox";
import { IntegrationMap } from "@/registry/components/integration-map";
import { KineticLogoExchange } from "@/registry/components/kinetic-logo-exchange";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => true,
}));

describe("component group A hardening", () => {
  it("exposes activity severity without relying on the dot color", () => {
    render(
      <ActivityFeed
        items={[{ id: "warning", title: "Contrast check", time: "now", tone: "warning" }]}
        toneLabels={{ warning: "Needs attention" }}
      />,
    );

    expect(screen.getByText("Needs attention.")).toHaveClass("sr-only");
  });

  it("keeps every collection component explicit when its data is empty", () => {
    const { rerender } = render(
      <ActivityFeed items={[]} label="动态" emptyLabel="暂无动态" />,
    );
    expect(screen.getByRole("region", { name: "动态" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("暂无动态");

    rerender(
      <FloatingDock items={[]} label="工具" emptyLabel="暂无工具" />,
    );
    expect(screen.getByRole("navigation", { name: "工具" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("暂无工具");

    rerender(
      <ImageLightbox items={[]} label="作品" copy={{ empty: "暂无作品" }} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("暂无作品");

    rerender(
      <IntegrationMap nodes={[]} edges={[]} emptyLabel="暂无集成" />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("暂无集成");

    rerender(
      <KineticLogoExchange items={[]} label="已连接工具" emptyLabel="暂无连接" />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("暂无连接");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps a five-item dock responsive without shrinking its 44px controls", () => {
    const items = Array.from({ length: 5 }, (_, index) => ({
      id: String(index),
      label: `Tool ${index + 1}`,
      icon: <span>{index + 1}</span>,
      onSelect: vi.fn(),
    }));
    render(<FloatingDock items={items} label="Tools" />);

    const dock = screen.getByRole("navigation", { name: "Tools" });
    expect(dock).toHaveClass("max-w-full", "flex-wrap", "gap-px");
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveClass("size-11");
      expect(button.parentElement).toHaveClass("w-11", "shrink-0");
    }
  });

  it("keeps thin boundaries without wide ghost-card shadows", () => {
    const { rerender } = render(
      <FloatingDock items={[]} label="Tools" />,
    );
    expect(screen.getByRole("navigation", { name: "Tools" })).toHaveClass(
      "border",
      "border-neutral-200",
      "bg-white",
    );
    expect(screen.getByRole("navigation", { name: "Tools" }).className).not.toContain("shadow-");

    rerender(
      <KineticLogoExchange items={[]} label="Connected tools" />,
    );
    expect(screen.getByRole("region", { name: "Connected tools" })).toHaveClass(
      "border",
      "border-neutral-200",
    );
  });

  it("bounds long activity times and dock tooltips", () => {
    const { rerender } = render(
      <ActivityFeed
        items={[{
          id: "long",
          title: "A long activity title",
          time: "approximately two hours and thirty-seven minutes ago",
        }]}
      />,
    );
    expect(screen.getByText(/approximately two hours/)).toHaveClass("max-w-[45%]", "truncate");

    rerender(
      <FloatingDock
        label="Tools"
        items={[{
          id: "long",
          label: "Extremely long workspace configuration and publishing settings",
          icon: <span>1</span>,
          onSelect: vi.fn(),
        }]}
      />,
    );
    const button = screen.getByRole("button");
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveClass(
      "w-max",
      "max-w-[min(240px,calc(100vw-16px))]",
      "whitespace-normal",
      "[overflow-wrap:anywhere]",
    );
    vi.spyOn(tooltip, "getBoundingClientRect").mockReturnValue({
      x: -50,
      y: 0,
      left: -50,
      top: 0,
      right: 100,
      bottom: 40,
      width: 150,
      height: 40,
      toJSON: () => ({}),
    });
    fireEvent.focus(button);
    expect(tooltip.style.transform).toBe("translateX(58px)");
    fireEvent.blur(button);
    expect(tooltip.style.transform).toBe("");
  });

  it("truncates long map labels visually while retaining their full accessible names", () => {
    const label = "超长集成服务名称需要安全截断";
    const meta = "用于验证动态属性不会溢出";
    const { container } = render(
      <IntegrationMap
        nodes={[{ id: "long", label, meta, x: 120, y: 80 }]}
        edges={[]}
        width={240}
        height={160}
      />,
    );

    expect(screen.getByRole("button", { name: `${label}, ${meta}` })).toBeInTheDocument();
    const visibleText = Array.from(container.querySelectorAll("svg text"))
      .map((node) => node.textContent)
      .join(" ");
    expect(visibleText).toContain("…");
    expect(visibleText).not.toContain(label);
  });

  it("falls back to finite map geometry when runtime dimensions are invalid", () => {
    const { container } = render(
      <IntegrationMap
        nodes={[{ id: "node", label: "Node", x: 220, y: 115 }]}
        edges={[]}
        width={0}
        height={Number.NaN}
      />,
    );

    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 440 230");
    const node = screen.getByRole("button", { name: "Node" });
    expect(node.style.left).toBe("50%");
    expect(node.style.top).toBe("50%");
  });
});
