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
});
