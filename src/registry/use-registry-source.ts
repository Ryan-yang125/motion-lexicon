import { useCallback, useEffect, useRef, useState } from "react";

type RegistryFile = {
  content?: unknown;
};

type RegistryItem = {
  files?: RegistryFile[];
};

export type RegistrySourceState = {
  source: string;
  status: "idle" | "loading" | "ready" | "error";
  ensureLoaded: () => Promise<string>;
  retry: () => void;
};

type LoadedRegistrySourceState = Pick<RegistrySourceState, "source" | "status"> & {
  registryId: string | null;
};

const sourceCache = new Map<string, string>();
const sourceRequests = new Map<string, Promise<string>>();

async function requestRegistrySource(registryId: string, force = false) {
  if (!force) {
    const cached = sourceCache.get(registryId);
    if (cached) return cached;
    const pending = sourceRequests.get(registryId);
    if (pending) return pending;
  }

  const request = fetch(`/r/${encodeURIComponent(registryId)}.json`, {
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Registry request failed with ${response.status}`);
      return response.json() as Promise<RegistryItem>;
    })
    .then((item) => {
      const source = item.files?.map((file) => file.content).find((content): content is string => typeof content === "string");
      if (!source) throw new Error("Registry item has no copyable source");
      sourceCache.set(registryId, source);
      return source;
    })
    .finally(() => {
      if (sourceRequests.get(registryId) === request) sourceRequests.delete(registryId);
    });

  sourceRequests.set(registryId, request);
  return request;
}

export function useRegistrySource(registryId: string | null): RegistrySourceState {
  const [state, setState] = useState<LoadedRegistrySourceState>({
    registryId,
    source: registryId ? sourceCache.get(registryId) ?? "" : "",
    status: registryId ? (sourceCache.has(registryId) ? "ready" : "idle") : "ready"
  });
  const activeIdRef = useRef(registryId);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    activeIdRef.current = registryId;
  }, [registryId]);

  const load = useCallback(async (force = false) => {
    if (!registryId) return "";
    const cached = force ? undefined : sourceCache.get(registryId);
    if (cached) {
      if (mountedRef.current) setState({ registryId, source: cached, status: "ready" });
      return cached;
    }
    if (mountedRef.current) setState({ registryId, source: "", status: "loading" });
    try {
      const source = await requestRegistrySource(registryId, force);
      if (mountedRef.current && activeIdRef.current === registryId) {
        setState({ registryId, source, status: "ready" });
      }
      return source;
    } catch (error) {
      if (mountedRef.current && activeIdRef.current === registryId) {
        console.error("Unable to load registry source", error);
        setState({ registryId, source: "", status: "error" });
      }
      throw error;
    }
  }, [registryId]);

  const ensureLoaded = useCallback(() => load(false), [load]);
  const retry = useCallback(() => {
    void load(true).catch(() => undefined);
  }, [load]);
  if (state.registryId !== registryId) {
    const cached = registryId ? sourceCache.get(registryId) : undefined;
    return {
      source: cached ?? "",
      status: registryId ? (cached ? "ready" : "idle") : "ready",
      ensureLoaded,
      retry
    };
  }
  return { source: state.source, status: state.status, ensureLoaded, retry };
}
