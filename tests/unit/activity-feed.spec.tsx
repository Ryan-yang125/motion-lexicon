// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ActivityFeed, type ActivityItem } from "@/registry/components/activity-feed";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => true,
}));

const first: ActivityItem = {
  id: "first",
  title: "Initial deployment completed",
  time: "1m",
};

const newest: ActivityItem = {
  id: "newest",
  title: "New review note added",
  time: "now",
};

const second: ActivityItem = {
  id: "second",
  title: "Existing review completed",
  time: "2m",
};

describe("ActivityFeed announcements", () => {
  it("announces the first item added after an initially empty feed", () => {
    const { rerender } = render(<ActivityFeed items={[]} />);

    rerender(<ActivityFeed items={[first]} />);
    expect(screen.getByRole("status")).toHaveTextContent(first.title);
  });

  it("keeps an initially populated feed silent", () => {
    render(<ActivityFeed items={[first]} />);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("announces a new first item after the initial baseline", () => {
    const { rerender } = render(<ActivityFeed items={[first]} />);

    rerender(<ActivityFeed items={[newest, first]} />);
    expect(screen.getByRole("status")).toHaveTextContent(newest.title);
  });

  it("keeps the existing second item silent when the current first item is removed", () => {
    const { rerender } = render(<ActivityFeed items={[first, second]} />);
    const status = screen.getByRole("status");

    rerender(<ActivityFeed items={[second]} />);
    expect(status).toBeEmptyDOMElement();
  });
});
