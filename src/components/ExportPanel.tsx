import { Code2, MessageSquareText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

type ExportTab = "prompt" | "code";

function readExportTab(): ExportTab {
  const value = new URLSearchParams(window.location.search).get("tab");
  return value === "code" || value === "css" || value === "html" || value === "js"
    ? "code"
    : "prompt";
}

export function ExportPanel({ locale, recipe, values }: ExportPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ExportTab>("prompt");
  const css = buildRecipeCss(recipe, values);
  const html = buildRecipeHtml(recipe, values, locale);
  const js = buildRecipeJs(recipe, values);
  const prompt = buildRecipePrompt(recipe, values, locale);
  const teachingNotice = getRecipeTeachingNotice(recipe, values, locale);
  const labels = locale === "zh"
    ? {
        prompt: "提示词",
        code: "代码",
        copyAllCode: "复制全部代码"
      }
    : {
        prompt: "Prompt",
        code: "Code",
        copyAllCode: "Copy all code"
      };
  const codeFiles = useMemo(
    () => [
      { id: "html", filename: "markup.html", content: html },
      { id: "css", filename: "motion.css", content: css },
      ...(js ? [{ id: "js", filename: "motion.js", content: js }] : [])
    ],
    [css, html, js]
  );
  const codeBundle = useMemo(
    () => [
      `<style>\n${css}\n</style>`,
      html,
      js ? `<script>\n${js}\n</script>` : ""
    ].filter(Boolean).join("\n\n"),
    [css, html, js]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setTab(readExportTab()), 0);
    return () => window.clearTimeout(timeout);
  }, [recipe.id]);

  function changeTab(next: string) {
    const nextTab = next as ExportTab;
    setTab(nextTab);
    const params = new URLSearchParams(window.location.search);
    if (nextTab === "prompt") params.delete("tab");
    else params.set("tab", "code");
    const query = params.toString();
    void navigate({
      href: `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }

  return (
    <section className="library-export" id="exports" aria-label={t("workspace.outputTitle")}>
      <div className="library-code-panel apple-code-output">
        <Tabs value={tab} onValueChange={changeTab}>
          <div className="library-code-toolbar">
            <TabsList aria-label={t("workspace.outputTabsLabel")}>
              <TabsTrigger value="prompt">
                <MessageSquareText aria-hidden="true" size={14} strokeWidth={1.8} />
                {labels.prompt}
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code2 aria-hidden="true" size={14} strokeWidth={1.8} />
                {labels.code}
              </TabsTrigger>
            </TabsList>
            {teachingNotice ? (
              <span className="library-code-status" role="note">{teachingNotice}</span>
            ) : null}
          </div>

          <TabsContent value="prompt" className="library-prompt-content">
            <p data-testid="prompt-output">{prompt}</p>
          </TabsContent>

          <TabsContent value="code" className="library-code-bundle">
            <div className="library-code-filebar library-code-bundle-toolbar">
              <CopyButton
                label={labels.copyAllCode}
                getText={() => codeBundle}
                variant="ghost"
                size="sm"
              />
            </div>
            <div className="library-code-files" data-testid="code-output-bundle">
              {codeFiles.map((file) => (
                <section className="library-code-file" key={file.id}>
                  <header>{file.filename}</header>
                  <pre data-testid={`${file.id}-output`}><code>{file.content}</code></pre>
                </section>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
