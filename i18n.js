import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization"; // Sadece bunu kullan
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import tr from "./locales/tr.json";

const LANGUAGES = {
  en: { translation: en },
  tr: { translation: tr },
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const savedLanguage = await AsyncStorage.getItem("user-language");
    const bestLang = Localization.locale;  // expo-localization kullanıyoruz
    callback(savedLanguage || bestLang || "en");
  },
  init: () => {},
  cacheUserLanguage: (lang) => {
    AsyncStorage.setItem("user-language", lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;