import { Braces, Eye, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

const steps = [
  { key: "preview", icon: Eye },
  { key: "tune", icon: SlidersHorizontal },
  { key: "copy", icon: Braces }
] as const;

export function FeatureGrid() {
  const { t } = useTranslation();

  return (
    <section className="library-workflow" aria-labelledby="workflow-title">
      <div className="library-section-heading">
        <div>
          <span>{t("landing.workflowLabel")}</span>
          <h2 id="workflow-title">{t("landing.workflowTitle")}</h2>
        </div>
        <p>{t("landing.workflowCopy")}</p>
      </div>
      <ol className="library-workflow-steps">
        {steps.map(({ key, icon: Icon }, index) => (
          <li key={key}>
            <div className="library-workflow-icon">
              <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{t(`landing.workflow.${key}.title`)}</h3>
            <p>{t(`landing.workflow.${key}.copy`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
