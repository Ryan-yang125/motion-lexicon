import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { getRegistryComponent, registryComponentRuntimeCost } from "../data/component-registry";

type DemoModule = Record<string, ComponentType>;

const demoModules = typeof import.meta.env === "undefined"
  ? {}
  : import.meta.glob<DemoModule>("./demos/*-demo.tsx");
const demoLoaders = Object.fromEntries(
  Object.entries(demoModules).map(([modulePath, loader]) => {
    const id = modulePath.slice("./demos/".length, -"-demo.tsx".length);
    return [id, loader];
  })
) as Record<string, () => Promise<DemoModule>>;

const lazyDemos = Object.fromEntries(
  Object.entries(demoLoaders).map(([id, loader]) => [
    id,
    lazy(async () => {
      const module = await loader();
      const Demo = Object.entries(module).find(([name]) => name.endsWith("Demo"))?.[1];
      if (!Demo) throw new Error(`Missing demo export for ${id}`);
      return { default: Demo };
    })
  ])
) as Record<string, ReturnType<typeof lazy>>;

function PreviewFallback() {
  return <div className="registry-preview-loading" aria-hidden="true" />;
}

type DeferredPreviewProps = {
  id: string;
  deferred: boolean;
  heavy: boolean;
  children: ReactNode;
};

export function DeferredPreview({ id, deferred, heavy, children }: DeferredPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!deferred);

  useEffect(() => {
    if (!deferred || !frameRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: heavy ? "420px 0px" : "220px" }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [deferred, heavy]);

  return (
    <div className="registry-preview" ref={frameRef} data-component={id}>
      {active ? children : <PreviewFallback />}
    </div>
  );
}

export function RegistryPreview({ id, deferred = false }: { id: string; deferred?: boolean }) {
  const Demo = lazyDemos[id];
  const entry = getRegistryComponent(id);
  const heavy = entry ? registryComponentRuntimeCost(entry) === "heavy" : false;

  return (
    <DeferredPreview id={id} deferred={deferred} heavy={heavy}>
      {Demo ? (
        <Suspense fallback={<PreviewFallback />}>
          <Demo />
        </Suspense>
      ) : (
        <PreviewFallback />
      )}
    </DeferredPreview>
  );
}
