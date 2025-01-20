import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from './locale/en.json'
import huJSON from './locale/hu.json'

i18n.use(initReactI18next).init({
    resources: {
        en: { ...enJSON },
        hu: { ...huJSON },
    },
    lng: "hu",
});