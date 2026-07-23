import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, MotionRecipe, ParamValues } from "../data/types";
import { text } from "../data/site";
import {
  buildRecipeCss,
  buildRecipeHtml,
  getMotionRuntimeConfig
} from "../lib/motion-engine";
import { mountMotionRuntime } from "../lib/motion-runtime";
import { Button } from "./ui/button";

type MotionPreviewProps = {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
};

export function MotionPreview({ locale, recipe, values }: MotionPreviewProps) {
  const { t } = useTranslation();
  const [replayKey, setReplayKey] = useState(0);
  const runtimeHostRef = useRef<HTMLDivElement>(null);
  const mountedReplayRef = useRef(0);
  const output = useMemo(
    () => ({
      css: buildRecipeCss(recipe, values),
      html: buildRecipeHtml(recipe, values, locale)
    }),
    [locale, recipe, values]
  );

  useEffect(() => {
    const root = runtimeHostRef.current?.querySelector<HTMLElement>(".motion-demo");
    if (!root) return;
    const autoplay = mountedReplayRef.current !== replayKey;
    mountedReplayRef.current = replayKey;
    return mountMotionRuntime(root, getMotionRuntimeConfig(recipe, values, autoplay));
  }, [output.html, recipe, replayKey, values]);

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <span className="small-mono">{t("workspace.previewLabel")}</span>
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={() => setReplayKey((current) => current + 1)}
        >
          <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
          {t("common.replay")}
        </Button>
      </div>
      <div
        className="stage motion-runtime-stage"
        aria-label={`${text(recipe.name, locale)} — ${t("workspace.previewLabel")}`}
      >
        <style
          // The catalog CSS is local typed content. Raw insertion also keeps
          // combinators such as `>` identical across prerender and hydration.
          dangerouslySetInnerHTML={{ __html: output.css }}
        />
        <div
          className="motion-preview-runtime"
          key={`${recipe.id}:${replayKey}`}
          ref={runtimeHostRef}
          // This HTML is generated exclusively from the local, typed motion catalog.
          dangerouslySetInnerHTML={{ __html: output.html }}
        />
      </div>
    </div>
  );
}
