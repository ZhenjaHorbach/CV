import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pl from "./locales/pl.json";
import ru from "./locales/ru.json";
import by from "./locales/by.json";
import ua from "./locales/ua.json";

export const LANG_ORDER = ["en", "pl", "ru", "by", "ua"] as const;
export type Lang = (typeof LANG_ORDER)[number];

export const LOCALE_TAG: Record<Lang, string> = {
  en: "en-US",
  pl: "pl-PL",
  ru: "ru-RU",
  by: "be-BY",
  ua: "uk-UA",
};

const STORAGE_KEY = "cv-lang";

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANG_ORDER.includes(stored)) return stored;
  } catch {}
  return "en";
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, pl: { translation: pl }, ru: { translation: ru }, by: { translation: by }, ua: { translation: ua } },
  lng: getInitialLang(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {}
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
