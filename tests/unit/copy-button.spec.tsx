// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CopyButton } from "@/registry/components/copy-button";

describe("CopyButton", () => {
  it("shows its error state when resolving the value rejects without an error callback", async () => {
    render(
      <CopyButton
        value=""
        errorLabel="Copy failed"
        resolveValue={() => Promise.reject(new Error("source unavailable"))}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Copy failed");
    });
  });
});
