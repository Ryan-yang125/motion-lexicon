import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";

type DemoModule = Record<string, ComponentType>;

const demoLoaders: Record<string, () => Promise<DemoModule>> = {
  "accordion": () => import("./demos/accordion-demo"),
  "command-palette": () => import("./demos/command-palette-demo"),
  "context-menu": () => import("./demos/context-menu-demo"),
  "copy-button": () => import("./demos/copy-button-demo"),
  "drawer": () => import("./demos/drawer-demo"),
  "dropdown": () => import("./demos/dropdown-demo"),
  "expanding-search": () => import("./demos/expanding-search-demo"),
  "filter-grid": () => import("./demos/filter-grid-demo"),
  "floating-label": () => import("./demos/floating-label-demo"),
  "hide-on-scroll": () => import("./demos/hide-on-scroll-demo"),
  "hold-to-confirm": () => import("./demos/hold-to-confirm-demo"),
  "inline-validation": () => import("./demos/inline-validation-demo"),
  "loading-button": () => import("./demos/loading-button-demo"),
  "long-press": () => import("./demos/long-press-demo"),
  "modal": () => import("./demos/modal-demo"),
  "otp-input": () => import("./demos/otp-input-demo"),
  "pagination": () => import("./demos/pagination-demo"),
  "password-strength": () => import("./demos/password-strength-demo"),
  "popover": () => import("./demos/popover-demo"),
  "progress-bar": () => import("./demos/progress-bar-demo"),
  "reorder-list": () => import("./demos/reorder-list-demo"),
  "segmented-control": () => import("./demos/segmented-control-demo"),
  "slider-detents": () => import("./demos/slider-detents-demo"),
  "sortable-table": () => import("./demos/sortable-table-demo"),
  "tabs": () => import("./demos/tabs-demo"),
  "tag-input": () => import("./demos/tag-input-demo"),
  "task-steps": () => import("./demos/task-steps-demo"),
  "value-flash": () => import("./demos/value-flash-demo")
};

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

export function RegistryPreview({ id, deferred = false }: { id: string; deferred?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!deferred);
  const Demo = lazyDemos[id];

  useEffect(() => {
    if (!deferred || active || !frameRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px" }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [active, deferred]);

  return (
    <div className="registry-preview" ref={frameRef} data-component={id}>
      {active && Demo ? (
        <Suspense fallback={<PreviewFallback />}>
          <Demo />
        </Suspense>
      ) : (
        <PreviewFallback />
      )}
    </div>
  );
}

