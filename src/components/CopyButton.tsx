import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, type ButtonProps } from "./ui/button";

type CopyButtonProps = ButtonProps & {
  getText: () => string;
  label: string;
};

export function CopyButton({ getText, label, ...props }: CopyButtonProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 1400);
    }
  }

  const visibleLabel =
    status === "copied" ? t("common.copied") : status === "failed" ? t("common.copyFailed") : label;

  return (
    <>
      <Button type="button" onClick={handleCopy} aria-label={visibleLabel} {...props}>
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
