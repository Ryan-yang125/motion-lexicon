import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "@tanstack/react-router";
import type { Locale } from "../data/types";
import { localeLabel, switchLocalePath } from "../data/site";
import { useTheme, type ThemeMode } from "./ThemeProvider";
import { Dropdown } from "./interior/dropdown";

type ControlsProps = {
  locale: Locale;
};

export function ThemeLanguageControls({ locale }: ControlsProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const nextLocale: Locale = locale === "zh" ? "en" : "zh";
  const languageHref = `${switchLocalePath(location.pathname, nextLocale)}${location.searchStr}${location.hash}`;

  useEffect(() => setMounted(true), []);

  return (
    <div className="header-controls">
      <a
        className="icon-link"
        href={languageHref}
        aria-label={locale === "zh" ? "切换到 English" : "Switch to Chinese"}
      >
        <Languages aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>{localeLabel(nextLocale)}</span>
      </a>
      <Dropdown
        items={(["system", "light", "dark"] as const).map((value) => ({
          value,
          label: t(`common.${value}`)
        }))}
        value={mounted ? theme : "system"}
        onChange={(value) => setTheme(value as ThemeMode)}
        label={t("common.theme")}
        placeholder={t("common.system")}
        disabled={!mounted}
        inline
        className="theme-select interior-theme-select"
      />
    </div>
  );
}
