import { useCallback, useEffect, useState } from "react";

type RegistryFile = {
  content?: unknown;
};

type RegistryItem = {
  files?: RegistryFile[];
};

export type RegistrySourceState = {
  source: string;
  status: "loading" | "ready" | "error";
  retry: () => void;
};

export function useRegistrySource(registryId: string | null): RegistrySourceState {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<RegistrySourceState, "retry">>({
    source: "",
    status: registryId ? "loading" : "ready"
  });

  useEffect(() => {
    if (!registryId) {
      setState({ source: "", status: "ready" });
      return;
    }

    const controller = new AbortController();
    setState({ source: "", status: "loading" });

    void fetch(`/r/${encodeURIComponent(registryId)}.json`, {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Registry request failed with ${response.status}`);
        return response.json() as Promise<RegistryItem>;
      })
      .then((item) => {
        const source = item.files?.map((file) => file.content).find((content): content is string => typeof content === "string");
        if (!source) throw new Error("Registry item has no copyable source");
        setState({ source, status: "ready" });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Unable to load registry source", error);
        setState({ source: "", status: "error" });
      });

    return () => controller.abort();
  }, [attempt, registryId]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...state, retry };
}
