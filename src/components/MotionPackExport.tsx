import { Braces, MotionPromptGlyph } from "./icons";
import { useMemo, useState } from "react";
import type { Locale } from "../data/types";
import { CopyButton } from "./CopyButton";

type MotionPackExportProps = {
  locale: Locale;
  prompt: string;
  source: {
    html: string;
    css: string;
    js: string;
  };
};

type ExportTab = "prompt" | "code";

export function MotionPackExport({ locale, prompt, source }: MotionPackExportProps) {
  const [tab, setTab] = useState<ExportTab>("prompt");
  const labels = locale === "zh"
    ? {
        prompt: "提示词",
        code: "代码",
        copyPrompt: "复制提示词",
        copyCode: "复制全部代码",
        files: "HTML · CSS · JS"
      }
    : {
        prompt: "Prompt",
        code: "Code",
        copyPrompt: "Copy prompt",
        copyCode: "Copy all code",
        files: "HTML · CSS · JS"
      };
  const bundle = useMemo(
    () => [
      `<style>\n${source.css}\n</style>`,
      source.html,
      source.js ? `<script>\n${source.js}\n</script>` : ""
    ].filter(Boolean).join("\n\n"),
    [source.css, source.html, source.js]
  );

  return (
    <section className="motion-pack-export" aria-label={locale === "zh" ? "复制实现" : "Copy implementation"}>
      <div className="motion-pack-export-toolbar">
        <div className="motion-pack-export-tabs" role="tablist" aria-label={locale === "zh" ? "输出类型" : "Output type"}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "prompt"}
            className={tab === "prompt" ? "is-active" : undefined}
            onClick={() => setTab("prompt")}
          >
            <MotionPromptGlyph aria-hidden="true" size={14} />
            {labels.prompt}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "code"}
            className={tab === "code" ? "is-active" : undefined}
            onClick={() => setTab("code")}
          >
            <Braces aria-hidden="true" size={14} />
            {labels.code}
          </button>
        </div>
        <CopyButton
          label={tab === "prompt" ? labels.copyPrompt : labels.copyCode}
          getText={() => tab === "prompt" ? prompt : bundle}
          variant="accent"
          size="sm"
        />
      </div>

      {tab === "prompt" ? (
        <div className="motion-pack-prompt" role="tabpanel">
          <p>{prompt}</p>
        </div>
      ) : (
        <div className="motion-pack-code" role="tabpanel">
          <span className="motion-pack-code-files">{labels.files}</span>
          <pre data-testid="motion-pack-code"><code>{bundle}</code></pre>
        </div>
      )}
    </section>
  );
}
