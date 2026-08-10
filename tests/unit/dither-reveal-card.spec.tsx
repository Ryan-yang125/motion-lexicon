import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DitherRevealCard } from "../../src/registry/components/dither-reveal-card";

describe("DitherRevealCard WebGL fallback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the custom palette for both static reveal states", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        label="Reveal custom palette"
        palette={{ front: "#123456", back: "#ABCDEF" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const card = screen.getByRole("button", { name: "Reveal custom palette" });
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    expect(fallback).not.toBeNull();

    await waitFor(() => expect(fallback).toHaveStyle({ opacity: "1" }));
    expect(fallback).toHaveStyle({ backgroundColor: "rgb(18, 52, 86)" });

    fireEvent.focus(card);
    expect(fallback).toHaveStyle({ backgroundColor: "rgb(171, 205, 239)" });
  });

  it.each([
    ["rgb()", "rgb(12 34 56 / 60%)", "rgba(12, 34, 56, 0.6)"],
    ["hsl()", "hsl(120 50% 50%)", "rgb(64, 191, 64)"],
    ["named color", "rebeccapurple", "rgb(102, 51, 153)"],
  ])("normalizes %s colors for the shared WebGL and fallback palette", async (_, color, expected) => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        label={`Reveal ${color}`}
        palette={{ front: color }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    expect(fallback).not.toBeNull();
    await waitFor(() => expect(fallback).toHaveStyle({ backgroundColor: expected }));
  });

  it("falls back to the safe palette for invalid CSS colors", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        palette={{ front: "definitely-not-a-color" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    await waitFor(() =>
      expect(fallback).toHaveStyle({ backgroundColor: "rgb(238, 236, 229)" }),
    );
  });
});
