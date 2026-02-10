import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import sw from "./translations/sw.json";
import { DEFAULTS } from "@/config";

const resources = {
  en: { translation: en },
  sw: { translation: sw }
};

// get saved language BEFORE init
const savedLang = localStorage.getItem("lang");

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || DEFAULTS.locale, // 🔥 SINGLE entry point
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
