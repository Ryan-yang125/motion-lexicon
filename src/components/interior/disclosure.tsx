import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const CHEVRON = { type: "spring", stiffness: 700, damping: 46, mass: 0.5 } as const;
const ARRIVE = [0.23, 1, 0.32, 1] as const;

type Inertable = HTMLElement & { inert?: boolean };

export type DisclosureProps = {
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  headingLevel?: number;
  controls?: string;
  label?: string;
};

export function Disclosure({
  summary,
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  className = "",
  summaryClassName = "",
  bodyClassName = "",
  headingLevel = 3,
  controls,
  label
}: DisclosureProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const id = useId();
  const panelId = controls ?? `${id}-panel`;
  const headerId = `${id}-header`;
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current as Inertable | null;
    if (!panel) return;
    panel.inert = !open;
    return () => {
      panel.inert = false;
    };
  }, [open]);

  function toggle() {
    const next = !open;
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  }

  return (
    <div className={className} data-interior-disclosure="" data-open={open ? "true" : "false"}>
      <div role="heading" aria-level={headingLevel}>
        <button
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={label}
          className={summaryClassName}
          onClick={toggle}
        >
          {summary}
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 256 256"
            fill="none"
            aria-hidden="true"
            initial={false}
            animate={{ transform: `rotate(${open ? 180 : 0}deg)` }}
            transition={reduced ? { duration: 0 } : CHEVRON}
            className="interior-disclosure-chevron"
          >
            <path
              d="M208 96l-80 80-80-80"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>
      </div>
      <div hidden={!open}>
        <div
          id={panelId}
          ref={panelRef}
          role="region"
          aria-labelledby={headerId}
          aria-hidden={open ? undefined : true}
          className={bodyClassName}
        >
          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.18, ease: ARRIVE }
            }
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
