import type { Locale } from "../data/types";

export const resources = {
  zh: {
    translation: {
      common: {
        copied: "已复制",
        copyFailed: "复制失败，请手动选择内容",
        parameter: "参数",
        reset: "恢复默认",
        theme: "主题",
        light: "浅色",
        dark: "深色",
        system: "系统"
      },
      workspace: {
        controlsLabel: "动效参数"
      }
    }
  },
  en: {
    translation: {
      common: {
        copied: "Copied",
        copyFailed: "Copy failed; select the content manually",
        parameter: "Parameters",
        reset: "Reset",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System"
      },
      workspace: {
        controlsLabel: "Motion parameters"
      }
    }
  }
} as const;

export function htmlLang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}
