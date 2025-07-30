import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import mkTranslation from "./locales/mk.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    mk: {
      translation: mkTranslation,
    },
  },
  lng: localStorage.getItem("language") || "mk",
  fallbackLng: "mk",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
