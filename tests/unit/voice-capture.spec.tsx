// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceCapture } from "@/registry/components/voice-capture";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => true,
}));

const origin = new Date("2026-08-11T00:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(origin);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("VoiceCapture duration", () => {
  it("derives elapsed seconds from wall time after delayed interval delivery", () => {
    const onSend = vi.fn();
    render(<VoiceCapture onSend={onSend} />);

    fireEvent.click(screen.getByRole("button", { name: "Record voice message" }));
    act(() => {
      vi.setSystemTime(new Date(origin.getTime() + 11_400));
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("00:12")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Send recording" }));
    expect(onSend).toHaveBeenCalledWith(12);
  });

  it("excludes paused wall time and accumulates every recording segment", () => {
    const onSend = vi.fn();
    render(<VoiceCapture onSend={onSend} />);

    fireEvent.click(screen.getByRole("button", { name: "Record voice message" }));
    vi.setSystemTime(new Date(origin.getTime() + 2_400));
    fireEvent.click(screen.getByRole("button", { name: "Pause recording" }));
    expect(screen.getByText("00:02")).toBeInTheDocument();

    vi.setSystemTime(new Date(origin.getTime() + 62_400));
    fireEvent.click(screen.getByRole("button", { name: "Resume recording" }));
    vi.setSystemTime(new Date(origin.getTime() + 65_900));
    fireEvent.click(screen.getByRole("button", { name: "Send recording" }));

    expect(onSend).toHaveBeenCalledWith(5);
  });
});

describe("VoiceCapture focus", () => {
  it("does not steal focus on mount or unrelated parent prop updates", () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    const { rerender } = render(<VoiceCapture label="Voice message" />);

    expect(outside).toHaveFocus();
    rerender(<VoiceCapture label="Updated voice message" levels={[0.2, 0.5]} />);
    expect(outside).toHaveFocus();

    outside.remove();
  });

  it("moves focus from keyboard-activated Record to Pause", () => {
    render(<VoiceCapture />);
    const record = screen.getByRole("button", { name: "Record voice message" });

    record.focus();
    fireEvent.keyDown(record, { key: "Enter" });
    fireEvent.click(record, { detail: 0 });

    expect(screen.getByRole("button", { name: "Pause recording" })).toHaveFocus();
  });

  it("returns focus to Record after sending", () => {
    render(<VoiceCapture />);
    fireEvent.click(screen.getByRole("button", { name: "Record voice message" }));

    fireEvent.click(screen.getByRole("button", { name: "Send recording" }));

    expect(screen.getByRole("button", { name: "Record voice message" })).toHaveFocus();
  });

  it("returns focus to Record after deleting", () => {
    render(<VoiceCapture />);
    fireEvent.click(screen.getByRole("button", { name: "Record voice message" }));

    fireEvent.click(screen.getByRole("button", { name: "Delete recording" }));

    expect(screen.getByRole("button", { name: "Record voice message" })).toHaveFocus();
  });
});
