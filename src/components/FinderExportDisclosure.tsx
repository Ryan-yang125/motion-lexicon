import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, MotionRecipe, ParamValues } from "../data/types";
import { ExportPanel } from "./ExportPanel";

type FinderExportDisclosureProps = {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
};

export function FinderExportDisclosure({
  locale,
  recipe,
  values
}: FinderExportDisclosureProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleLabel =
    locale === "zh"
      ? isOpen
        ? "收起输出"
        : "查看输出"
      : isOpen
        ? "Hide output"
        : "View output";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsOpen(Boolean(new URLSearchParams(window.location.search).get("tab")));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [recipe.id]);

  return (
    <details
      className={`finder-export-disclosure apple-export-disclosure ${
        isOpen ? "is-open" : "is-closed"
      }`}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary
        aria-controls="exports"
        aria-label={`${toggleLabel}: ${t("workspace.outputTitle")}`}
      >
        <span>
          <small>{t("workspace.outputLabel")}</small>
          <strong>{t("workspace.outputTitle")}</strong>
        </span>
        <ChevronDown aria-hidden="true" size={18} strokeWidth={1.7} />
      </summary>
      <ExportPanel locale={locale} recipe={recipe} values={values} />
    </details>
  );
}
