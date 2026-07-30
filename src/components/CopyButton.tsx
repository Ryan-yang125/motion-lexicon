import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "./ui/button";

type CopyButtonProps = ButtonProps & {
  getText: () => string;
  label: string;
};

export function CopyButton({ getText, label, ...props }: CopyButtonProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
  }, []);

  function resetAfter(delay: number) {
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, delay);
  }

  async function handleCopy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      resetAfter(2200);
    } catch {
      setStatus("failed");
      resetAfter(2200);
    }
  }

  const visibleLabel =
    status === "copied" ? t("common.copied") : status === "failed" ? t("common.copyFailed") : label;

  return (
    <>
      <Button
        type="button"
        onClick={handleCopy}
        aria-label={visibleLabel}
        data-copy-state={status}
        {...props}
      >
        {status === "copied" ? (
          <Check aria-hidden="true" size={15} strokeWidth={1.8} />
        ) : (
          <Copy aria-hidden="true" size={15} strokeWidth={1.8} />
        )}
        {visibleLabel}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "idle" ? "" : visibleLabel}
      </span>
    </>
  );
}
