import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, MotionRecipe, ParamValues } from "../data/types";
import { ExportPanel } from "./ExportPanel";
import { Disclosure } from "./interior/disclosure";

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
  const [isOpen, setIsOpen] = useState(true);
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
      setIsOpen(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [recipe.id]);

  return (
    <Disclosure
      className={`finder-export-disclosure apple-export-disclosure ${
        isOpen ? "is-open" : "is-closed"
      }`}
      summaryClassName="finder-export-summary"
      bodyClassName="finder-export-body"
      open={isOpen}
      onOpenChange={setIsOpen}
      controls="exports"
      label={`${toggleLabel}: ${t("workspace.outputTitle")}`}
      summary={<strong>{t("workspace.outputTitle")}</strong>}
    >
      <ExportPanel locale={locale} recipe={recipe} values={values} />
    </Disclosure>
  );
}
