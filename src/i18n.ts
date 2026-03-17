// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
	// Passa l'istanza i18n (i18next) a react-i18next
	.use(initReactI18next)
	// Carica la traduzione usando HttpApi
	.use(HttpApi)
	// Rileva la lingua dell'utente
	.use(LanguageDetector)
	.init({
		// Ordine di rilevamento della lingua
		detection: {
			order: ["path", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag", "subdomain"],
			caches: ["cookie"], // Dove memorizzare la lingua selezionata
		},
		// Percorso per caricare le traduzioni
		backend: {
			loadPath: "/locales/{{lng}}/translation.json",
		},
		// Lingua di fallback se la traduzione non è disponibile
		fallbackLng: "en",
		debug: false, // Imposta su true per vedere in console i messaggi di debug
		// Configurazione dell'interpolazione
		interpolation: {
			escapeValue: false, // Non è necessario per React
		},
		// Namespace di default, in questo caso è 'translation'
		ns: ["translation"],
		defaultNS: "translation",
		// Attesa attiva delle traduzioni prima del rendering del componente
		react: {
			useSuspense: false,
		},
	});

export default i18n;
