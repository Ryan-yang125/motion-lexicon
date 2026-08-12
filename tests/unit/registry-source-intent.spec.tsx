// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentPage } from "@/pages/ComponentPage";
import { PrimitivePage } from "@/pages/PrimitivePage";

const harness = vi.hoisted(() => ({
  ensureLoaded: vi.fn(async () => "export function Loaded() {}"),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));

vi.mock("@/components/Seo", () => ({ Seo: () => null }));
vi.mock("@/registry/preview-map", () => ({ RegistryPreview: () => <div /> }));
vi.mock("@/registry/primitive-preview-map", () => ({ PrimitivePreview: () => <div /> }));
vi.mock("@/components/ParameterControls", () => ({ ParameterControls: () => null }));
vi.mock("@/lib/useRecipeParams", () => ({
  useRecipeParams: () => ({ values: {}, updateValue: vi.fn(), resetValues: vi.fn() }),
}));
vi.mock("@/registry/use-registry-source", () => ({
  useRegistrySource: () => ({
    source: "",
    status: "idle",
    ensureLoaded: harness.ensureLoaded,
    retry: vi.fn(),
  }),
}));
vi.mock("@/registry/components/segmented-control", () => ({
  SegmentedControl: ({ options, onValueChange }: { options: Array<{ value: string; label: string }>; onValueChange?: (value: string) => void }) => (
    <div>{options.map((option) => <button key={option.value} onClick={() => onValueChange?.(option.value)}>{option.label}</button>)}</div>
  ),
}));
vi.mock("@/registry/components/copy-button", () => ({
  CopyButton: ({ label, className, onIntent }: { label?: string; className?: string; onIntent?: () => void }) => (
    <button data-testid={className?.includes("component-primary-copy") ? "primary-copy" : undefined} onPointerEnter={onIntent} onFocus={onIntent}>{label}</button>
  ),
}));

beforeEach(() => {
  harness.ensureLoaded.mockClear();
});

describe("registry source intent", () => {
  it("loads component source on copy intent and Code selection", () => {
    render(<ComponentPage locale="en" componentId="copy-button" />);

    fireEvent.pointerEnter(screen.getByRole("button", { name: "Copy code" }));
    expect(harness.ensureLoaded).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(harness.ensureLoaded).toHaveBeenCalledTimes(2);
  });

  it("loads primitive source on copy intent and Code selection", () => {
    render(<PrimitivePage locale="en" primitiveId="slide-in" />);

    fireEvent.pointerEnter(screen.getByRole("button", { name: "Copy code" }));
    expect(harness.ensureLoaded).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(harness.ensureLoaded).toHaveBeenCalledTimes(2);
  });
});
