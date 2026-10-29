import { needs, profile, projects, skillGroups } from "../content/data";
import type { Lang, Plan } from "../shared";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

/** Risposte di riserva, scritte a partire dai dati del sito: servono quando l'AI non è raggiungibile. */
export function localAnswer(question: string, lang: Lang): string {
	const q = norm(question);
	const it = lang === "it";
	const names = (xs: string[]) => xs.join(", ");

	for (const p of projects) if (q.includes(norm(p.name))) return (it ? p.summary.it : p.summary.en) + " " + (it ? p.details.it : p.details.en);

	if (has(q, ["stack", "tecnolog", "linguagg", "usa ", "skill", "competenz", "sa fare", "can do", "technolog", "tools", "language"])) {
		const rows = skillGroups.map((g) => `${it ? g.title.it : g.title.en}: ${names(g.items.map((i) => i.name))}`).join(". ");
		return (it ? "Ecco le sue competenze. " : "Here are his skills. ") + rows + ".";
	}
	if (has(q, ["disponibil", "availab", "assum", "hire", "lavor", "cerca", "open to"])) {
		return it
			? `Sì, è disponibile per nuovi ruoli e per progetti su misura. Il modo più rapido è scrivergli dalla pagina Contatti o a ${profile.email}.`
			: `Yes, he's open to new roles and to custom projects. The quickest way is the Contact page or ${profile.email}.`;
	}
	if (has(q, ["come lavora", "metodo", "how does", "how he", "process", "cliente", "client"])) {
		return it
			? "Parte da te: capisce come lavori e cosa ti fa perdere tempo, costruisce la soluzione in passi chiari e la porta online, con dominio, DNS ed email. Parli sempre direttamente con lui."
			: "He starts from you: he learns how you work and what wastes your time, builds the solution in clear steps and takes it live, with domain, DNS and email. You always talk to him directly.";
	}
	if (has(q, ["gestionale", "management", "prenotaz", "booking"])) {
		const n = needs.find((x) => x.id === "gestionale")!;
		return (it ? n.pitch.it : n.pitch.en) + " " + (it ? "Esempio: Domus per Casaurea." : "Example: Domus for Casaurea.");
	}
	if (has(q, ["progett", "project", "esempi", "example", "portfolio", "lavori", "work"])) {
		return (it ? "Alcuni lavori: " : "Some of his work: ") + names(projects.map((p) => p.name)) + (it ? ". Aprili dalla pagina Progetti." : ". Open them from the Projects page.");
	}
	if (has(q, ["dove", "where", "vive", "live", "eta", "age", "anni", "chi e", "who"])) {
		return it
			? `Salvatore D'Amico, ${profile.age} anni, di ${profile.town}: sviluppatore full stack da circa tre anni.`
			: `Salvatore D'Amico, ${profile.age}, from ${profile.town}: a full stack developer for about three years.`;
	}
	if (has(q, ["contatt", "email", "mail", "whatsapp", "scriv", "contact", "reach"])) {
		return it ? `Puoi scrivergli a ${profile.email} oppure su WhatsApp dalla pagina Contatti.` : `You can write to ${profile.email} or on WhatsApp from the Contact page.`;
	}
	return it
		? "Su questo non ho dati certi. Posso parlarti di competenze, progetti, metodo di lavoro e disponibilità; per il resto scrivi a Salvatore dalla pagina Contatti."
		: "I don't have solid data on that. I can tell you about skills, projects, how he works and availability; for anything else, write to Salvatore from the Contact page.";
}

const STACK_BY_NEED: Record<string, string[]> = {
	gestionale: ["React", "NestJS", "SQL Server", "Cloudflare"],
	sito: ["React", "TypeScript", "Cloudflare"],
	integrazioni: ["Node.js", "NestJS", "Slack", "3CX"],
	legacy: ["ASP.NET Core", "C#", "SQL Server", "React"],
	online: ["Cloudflare", "Linux", "Nginx", "Git"],
	altro: ["React", "TypeScript", "Node.js", "Cloudflare"],
};
const WEEKS: Record<string, [number, number]> = { gestionale: [6, 12], sito: [2, 4], integrazioni: [2, 5], legacy: [8, 16], online: [1, 2], altro: [3, 8] };
const KEYWORDS: Record<string, string[]> = {
	gestionale: ["gestional", "prenotaz", "excel", "fogli", "amministraz", "booking", "spreadsheet", "management", "affitt", "rental", "magazzino", "inventory"],
	sito: ["sito", "menu", "qr", "vetrina", "landing", "website", "pagina", "web page"],
	integrazioni: ["non si parlano", "collegare", "integraz", "api", "slack", "centralino", "integrate", "connect", "sync", "sincroniz"],
	legacy: ["vecchio", "lento", "rifare", "legacy", "old", "slow", "rewrite", "migrar", "migrat"],
	online: ["dominio", "dns", "email aziendale", "domain", "hosting", "mettere online", "pubblicare"],
};

/** Piano di riserva, costruito dalle regole del sito (nessuna AI). */
export function localPlan(problem: string, lang: Lang): Plan {
	const q = norm(problem);
	const it = lang === "it";
	let best = "altro";
	let score = 0;
	for (const [id, words] of Object.entries(KEYWORDS)) {
		const s = words.filter((w) => q.includes(w)).length;
		if (s > score) {
			score = s;
			best = id;
		}
	}
	const n = needs.find((x) => x.id === best)!;
	const [weeksMin, weeksMax] = WEEKS[best];
	const t = (l: { it: string; en: string }) => (it ? l.it : l.en);
	return {
		title: t(n.title),
		summary: t(n.pitch),
		steps: [
			{ title: it ? "Ascolto" : "Listening", detail: n.steps[0][lang] },
			{ title: it ? "Costruzione" : "Build", detail: n.steps[1][lang] },
			{ title: it ? "Collegamenti e messa online" : "Integrations and launch", detail: n.steps[2][lang] },
			{ title: it ? "Dopo il lancio" : "After launch", detail: it ? "Controllo che tutto giri bene, correggo e ti spiego come usarlo." : "I check everything runs well, fix issues and show you how to use it." },
		],
		stack: STACK_BY_NEED[best],
		weeksMin,
		weeksMax,
		risks: [
			it ? "Quali dati e strumenti usi oggi, e chi li usa" : "Which data and tools you use today, and who uses them",
			it ? "Cosa è indispensabile subito e cosa può aspettare" : "What is essential now and what can wait",
		],
	};
}
