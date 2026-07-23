import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale } from "../data/site";
import type { Locale } from "../data/types";
import { resources } from "./resources";

let initialized = false;

export function initI18n(locale: Locale = defaultLocale) {
  if (initialized) {
    void i18n.changeLanguage(locale);
    return i18n;
  }

  void i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: defaultLocale,
    showSupportNotice: false,
    interpolation: {
      escapeValue: false
    }
  });

  initialized = true;
  return i18n;
}

export function setI18nLanguage(locale: Locale) {
  initI18n(locale);
  if (i18n.language !== locale) {
    void i18n.changeLanguage(locale);
  }
}

initI18n();
