// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useRegistrySource,
  type RegistrySourceState,
} from "@/registry/use-registry-source";

type Observation = {
  registryId: string | null;
  state: Pick<RegistrySourceState, "source" | "status">;
};

const registryResponse = (source: string) =>
  ({
    ok: true,
    status: 200,
    json: async () => ({ files: [{ content: source }] }),
  }) as Response;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useRegistrySource", () => {
  it("waits for explicit intent before loading", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(registryResponse("export function Intent() {}"));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useRegistrySource("intent-only"));

    expect(result.current.status).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.ensureLoaded();
    });
    expect(result.current).toMatchObject({ status: "ready", source: "export function Intent() {}" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("deduplicates concurrent requests and reuses the module cache", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const pending = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.fn<typeof fetch>().mockReturnValue(pending);
    vi.stubGlobal("fetch", fetchMock);
    const first = renderHook(() => useRegistrySource("shared-source"));
    const second = renderHook(() => useRegistrySource("shared-source"));

    let firstLoad: Promise<string> | undefined;
    let secondLoad: Promise<string> | undefined;
    act(() => {
      firstLoad = first.result.current.ensureLoaded();
      secondLoad = second.result.current.ensureLoaded();
    });
    expect(fetchMock).toHaveBeenCalledOnce();

    resolveRequest?.(registryResponse("export function Shared() {}"));
    await act(async () => {
      await Promise.all([firstLoad, secondLoad]);
    });
    expect(first.result.current.status).toBe("ready");
    expect(second.result.current.status).toBe("ready");

    const cached = renderHook(() => useRegistrySource("shared-source"));
    expect(cached.result.current).toMatchObject({ status: "ready", source: "export function Shared() {}" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("hides source from the previous id during a route rerender", async () => {
    const pending = new Promise<Response>(() => undefined);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(registryResponse("export function Alpha() {}"))
      .mockReturnValueOnce(pending);
    vi.stubGlobal("fetch", fetchMock);
    const observations: Observation[] = [];

    const { result, rerender } = renderHook(
      ({ registryId }: { registryId: string | null }) => {
        const state = useRegistrySource(registryId);
        observations.push({
          registryId,
          state: { source: state.source, status: state.status },
        });
        return state;
      },
      { initialProps: { registryId: "alpha" } },
    );

    await act(async () => {
      await result.current.ensureLoaded();
    });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.source).toContain("Alpha");

    const firstBetaRender = observations.length;
    rerender({ registryId: "beta" });

    expect(observations[firstBetaRender]).toEqual({
      registryId: "beta",
      state: { source: "", status: "idle" },
    });
    expect(result.current).toMatchObject({ source: "", status: "idle" });
    expect(fetchMock).toHaveBeenCalledOnce();

    act(() => {
      void result.current.ensureLoaded();
    });
    expect(fetchMock).toHaveBeenLastCalledWith("/r/beta.json", {
      headers: { Accept: "application/json" },
    });
  });
});
