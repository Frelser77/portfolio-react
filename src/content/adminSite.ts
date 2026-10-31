import type { L } from "./data";
import type { SiteKey } from "../shared";

/** Gli interruttori del pannello admin: ogni cosa del sito che si può mostrare o nascondere. */
export const siteSwitches: { group: L; items: { key: SiteKey; label: L; hint: L }[] }[] = [
	{
		group: { it: "Home", en: "Home" },
		items: [
			{ key: "home.hero.config", label: { it: "Scheda «Di cosa hai bisogno?»", en: "“What do you need?” card" }, hint: { it: "In alto, accanto al titolo", en: "Top, next to the headline" } },
			{ key: "home.ai", label: { it: "Sezione «AI dal vivo»", en: "“Live AI” section" }, hint: { it: "Gli strumenti AI da provare in home", en: "The AI tools to try on the home page" } },
			{ key: "home.digest", label: { it: "«In questo momento»", en: "“Right now”" }, hint: { it: "Riassunto AI dell'attività GitHub", en: "AI summary of GitHub activity" } },
			{ key: "home.portal", label: { it: "«Scegli da dove partire»", en: "“Pick where to start”" }, hint: { it: "Le quattro porte verso le altre pagine", en: "The four doors to the other pages" } },
			{ key: "home.method", label: { it: "«Perché» e «Come lavoriamo»", en: "“Why” and “How we work”" }, hint: { it: "Motivi e passi del metodo", en: "Reasons and method steps" } },
		],
	},
	{
		group: { it: "Strumenti AI", en: "AI tools" },
		items: [
			{ key: "home.ai.fit", label: { it: "Annuncio → compatibilità", en: "Job post → fit" }, hint: { it: "In home e nel Lab AI", en: "On home and in the AI Lab" } },
			{ key: "home.ai.plan", label: { it: "Problema → piano", en: "Problem → plan" }, hint: { it: "In home e nel Lab AI", en: "On home and in the AI Lab" } },
			{ key: "home.ai.chat", label: { it: "Chiedi a FR7 Bot", en: "Ask FR7 Bot" }, hint: { it: "In home e nel Lab AI", en: "On home and in the AI Lab" } },
		],
	},
	{
		group: { it: "Altre pagine", en: "Other pages" },
		items: [
			{ key: "stack.github", label: { it: "Attività GitHub", en: "GitHub activity" }, hint: { it: "Nella pagina Stack", en: "On the Stack page" } },
			{ key: "ui.stories", label: { it: "Striscia dei progetti", en: "Project strip" }, hint: { it: "In alto nelle pagine progetto", en: "At the top of project pages" } },
		],
	},
	{
		group: { it: "Interfaccia", en: "Interface" },
		items: [
			{ key: "ui.dog", label: { it: "Il cane (FR7 Bot)", en: "The dog (FR7 Bot)" }, hint: { it: "La guida animata che ti segue", en: "The animated guide that follows you" } },
		],
	},
];
