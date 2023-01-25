import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import EnglishLanguage from "./assets/i18n/en/translation.json";
import FrenchLanguage from "./assets/i18n/fr/translation.json";
import {getLanguage} from "./utils/localStorage";
const lng = getLanguage()
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            lng: 'en-GB',
            resources: {
                en: EnglishLanguage,
                fre: FrenchLanguage
            },
            fallbackLng: "en-GB",
            debug: false,

            // have a common namespace used around the full app
            ns: ["translations"],
            defaultNS: "translations",

            keySeparator: false, // we use content as keys

            interpolation: {
                escapeValue: false, // not needed for react!!
                formatSeparator: ","
            },

            react: {
                // bindI18n: 'languageChanged',
                wait: true
            }
        })

const getLangConfig =  i18n
export default getLangConfig;
