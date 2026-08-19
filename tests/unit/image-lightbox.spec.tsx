// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ImageLightbox,
  type ImageLightboxItem,
} from "@/registry/components/image-lightbox";

const harness = vi.hoisted(() => ({ reduced: true }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => harness.reduced };
});

const alpha: ImageLightboxItem = {
  id: "alpha",
  title: "Alpha study",
  art: <span>Alpha art</span>,
};
const beta: ImageLightboxItem = {
  id: "beta",
  title: "Beta study",
  art: <span>Beta art</span>,
};
const gamma: ImageLightboxItem = {
  id: "gamma",
  title: "Gamma study",
  art: <span>Gamma art</span>,
};

beforeEach(() => {
  harness.reduced = true;
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ImageLightbox", () => {
  it("keeps the active item id when items are reordered", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ImageLightbox items={[alpha, beta, gamma]} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Beta study" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Beta study");
    expect(screen.getByRole("dialog")).toHaveClass(
      "border",
      "border-[#f3d7ad]/20",
      "bg-[#17130f]",
    );
    expect(screen.getByRole("dialog").className).not.toContain("shadow-");
    expect(screen.getByRole("img", { name: "Beta study" })).toHaveClass(
      "border",
      "border-[#f6dcc0]/20",
      "bg-[#3a2c22]",
    );
    expect(screen.getByRole("img", { name: "Beta study" }).className).toContain("shadow-");
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenLastCalledWith(beta, 1);

    rerender(
      <ImageLightbox items={[beta, gamma, alpha]} onChange={onChange} />,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Beta study");
    expect(screen.getByText("01 / 03")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("closes cleanly when the active item is removed", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ImageLightbox items={[alpha, beta, gamma]} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Beta study" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Beta study");

    rerender(<ImageLightbox items={[alpha, gamma]} onChange={onChange} />);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByText("Beta study")).not.toBeInTheDocument();
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenLastCalledWith(beta, 1);
  });

  it("removes transform press feedback from every reduced-motion dialog control", () => {
    render(<ImageLightbox items={[alpha, beta]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open Alpha study" }));

    for (const name of ["Close gallery", "Previous image", "Next image"]) {
      const control = screen.getByRole("button", { name });
      expect(control).not.toHaveClass("transition-[background-color,transform]");
      expect(control).not.toHaveClass("active:scale-[0.96]");
    }
  });

  it("retains transform press feedback in standard motion", () => {
    harness.reduced = false;
    render(<ImageLightbox items={[alpha, beta]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open Alpha study" }));

    for (const name of ["Close gallery", "Previous image", "Next image"]) {
      expect(screen.getByRole("button", { name })).toHaveClass(
        "transition-[background-color,transform]",
        "active:scale-[0.96]",
      );
    }
  });
});
