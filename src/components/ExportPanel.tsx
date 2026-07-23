import { Braces, Code2, FileCode2, MessageSquareText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, MotionRecipe, ParamValues } from "../data/types";
import {
  buildRecipeCss,
  buildRecipeHtml,
  buildRecipeJs,
  buildRecipePrompt,
  getRecipeTeachingNotice
} from "../lib/motion-engine";
import { CopyButton } from "./CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type ExportPanelProps = {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
};

type ExportTab = "css" | "html" | "js" | "prompt";

function readExportTab(): ExportTab {
  const value = new URLSearchParams(window.location.search).get("tab");
  return value === "html" || value === "js" || value === "prompt" ? value : "css";
}

export function ExportPanel({ locale, recipe, values }: ExportPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ExportTab>("css");
  const css = buildRecipeCss(recipe, values);
  const html = buildRecipeHtml(recipe, values, locale);
  const js = buildRecipeJs(recipe, values);
  const hasJs = js.length > 0;
  const prompt = buildRecipePrompt(recipe, values, locale);
  const teachingNotice = getRecipeTeachingNotice(recipe, values, locale);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = readExportTab();
      setTab(next === "js" && !hasJs ? "css" : next);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [hasJs, recipe.id]);

  function changeTab(next: string) {
    const nextTab = next as ExportTab;
    setTab(nextTab);
    const params = new URLSearchParams(window.location.search);
    if (nextTab === "css") {
      params.delete("tab");
    } else {
      params.set("tab", nextTab);
    }
    const query = params.toString();
    void navigate({
      href: `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }

  return (
    <section className="library-export" id="exports" aria-labelledby="export-title">
      <div className="library-doc-section-heading">
        <div>
          <span>{t("workspace.outputLabel")}</span>
          <h2 id="export-title">{t("workspace.outputTitle")}</h2>
        </div>
        <p>{t("workspace.outputCopy")}</p>
      </div>

      <div className="library-code-panel">
        <Tabs value={tab} onValueChange={changeTab}>
          <div className="library-code-toolbar">
            <TabsList aria-label={t("workspace.outputTabsLabel")}>
              <TabsTrigger value="css">
                <FileCode2 aria-hidden="true" size={14} strokeWidth={1.8} />
                CSS
              </TabsTrigger>
              <TabsTrigger value="html">
                <Code2 aria-hidden="true" size={14} strokeWidth={1.8} />
                HTML
              </TabsTrigger>
              {js ? <TabsTrigger value="js">
                <Braces aria-hidden="true" size={14} strokeWidth={1.8} />
                JS
              </TabsTrigger> : null}
              <TabsTrigger value="prompt">
                <MessageSquareText aria-hidden="true" size={14} strokeWidth={1.8} />
                Prompt
              </TabsTrigger>
            </TabsList>
            <span className="library-code-status" role={teachingNotice ? "note" : undefined}>
              {teachingNotice || t("workspace.liveOutput")}
            </span>
          </div>

          <TabsContent value="css" className="library-code-content">
            <div className="library-code-filebar">
              <span>motion.css</span>
              <CopyButton label={t("common.copyCss")} getText={() => css} variant="ghost" size="sm" />
            </div>
            <pre data-testid="css-output"><code>{css}</code></pre>
          </TabsContent>

          <TabsContent value="html" className="library-code-content">
            <div className="library-code-filebar">
              <span>markup.html</span>
              <CopyButton label={t("common.copyHtml")} getText={() => html} variant="ghost" size="sm" />
            </div>
            <pre data-testid="html-output"><code>{html}</code></pre>
          </TabsContent>

          {js ? <TabsContent value="js" className="library-code-content">
            <div className="library-code-filebar">
              <span>motion.js</span>
              <CopyButton label={t("common.copyJs")} getText={() => js} variant="ghost" size="sm" />
            </div>
            <pre data-testid="js-output"><code>{js}</code></pre>
          </TabsContent> : null}

          <TabsContent value="prompt" className="library-prompt-content">
            <div className="library-code-filebar">
              <span>agent-prompt.txt</span>
              <CopyButton label={t("common.copyCurrentPrompt")} getText={() => prompt} variant="ghost" size="sm" />
            </div>
            <p data-testid="prompt-output">{prompt}</p>
            <div className="library-prompt-meta">
              <span>{t("workspace.promptIntent")}</span>
              <span>{t("workspace.promptFeel")}</span>
              <span>{t("workspace.promptContext")}</span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
