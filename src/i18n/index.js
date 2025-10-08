import { I18nManager } from "react-native";
import * as Localization from "expo-localization";

import en from "./en.json";
import ar from "./ar.json";

const dictionaries = { en, ar };

let currentLocale = (() => {
  const locale = (
    Localization.getLocales?.()[0]?.languageCode || "en"
  ).toLowerCase();
  if (locale.startsWith("ar")) return "ar";
  return "en";
})();

const isRTL = currentLocale === "ar";
if (I18nManager.isRTL !== isRTL) {
  // Note: Changing RTL at runtime requires app reload by the host (handled by Expo dev reload or next launch)
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export const getLocale = () => currentLocale;

export const setLocale = (locale) => {
  if (!dictionaries[locale]) return;
  currentLocale = locale;
};

export const t = (key, params = {}) => {
  const dict = dictionaries[currentLocale] || dictionaries.en;
  const template = key
    .split(".")
    .reduce(
      (acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined),
      dict
    );
  if (typeof template !== "string") return key;
  return template.replace(/\{(\w+)\}/g, (_, p) =>
    params[p] !== undefined ? String(params[p]) : `{${p}}`
  );
};

export const isRtl = () => currentLocale === "ar";

export default { t, setLocale, getLocale, isRtl };
