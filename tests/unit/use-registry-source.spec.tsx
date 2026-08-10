// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
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

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.source).toContain("Alpha");

    const firstBetaRender = observations.length;
    rerender({ registryId: "beta" });

    expect(observations[firstBetaRender]).toEqual({
      registryId: "beta",
      state: { source: "", status: "loading" },
    });
    expect(result.current).toMatchObject({ source: "", status: "loading" });
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/r/beta.json",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
