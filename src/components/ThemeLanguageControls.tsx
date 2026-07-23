import { useEffect, useState } from "react";
import { ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "@tanstack/react-router";
import type { Locale } from "../data/types";
import { localeLabel, switchLocalePath } from "../data/site";
import { useTheme, type ThemeMode } from "./ThemeProvider";

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
      <a className="icon-link" href={languageHref} aria-label={t("common.language")}>
        <Languages aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>{localeLabel(nextLocale)}</span>
      </a>
      <div className="theme-select">
        {mounted && theme === "light" ? <Sun aria-hidden="true" size={14} strokeWidth={1.8} /> : null}
        {mounted && theme === "dark" ? <Moon aria-hidden="true" size={14} strokeWidth={1.8} /> : null}
        {!mounted || theme === "system" ? <Monitor aria-hidden="true" size={14} strokeWidth={1.8} /> : null}
        <span>{t(`common.${mounted ? theme : "system"}`)}</span>
        <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
        <select
          aria-label={t("common.theme")}
          disabled={!mounted}
          value={mounted ? theme : "system"}
          onChange={(event) => setTheme(event.currentTarget.value as ThemeMode)}
        >
          <option value="system">{t("common.system")}</option>
          <option value="light">{t("common.light")}</option>
          <option value="dark">{t("common.dark")}</option>
        </select>
      </div>
    </div>
  );
}
