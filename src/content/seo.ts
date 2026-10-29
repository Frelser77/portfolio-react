import { profile, projects, type L, type Lang, type Project } from "./data";

/**
 * Titoli, descrizioni e anteprime di condivisione di ogni pagina.
 * Li usano tre cose: il browser (cambia i meta quando navighi), il Worker (li scrive nell'HTML
 * che vedono WhatsApp, LinkedIn, Telegram, Slack e i motori di ricerca) e il generatore delle immagini.
 */
export interface PageSeo {
	title: L;
	description: L;
	/** immagine di condivisione 1200×630, relativa alla radice del sito */
	image: string;
	imageAlt: L;
	/** tipo Open Graph */
	type?: "website" | "article";
}

const author = "Salvatore D'Amico";

export const keywords: Record<Lang, string[]> = {
	it: [
		"sviluppatore full stack",
		"full stack developer",
		"sviluppatore web Puglia",
		"sviluppatore React",
		"sviluppatore Next.js",
		"sviluppatore NestJS",
		"sviluppatore ASP.NET",
		"TypeScript",
		"siti web su misura",
		"gestionali su misura",
		"integrazioni API",
		"Cloudflare",
		"Oria Brindisi",
		"portfolio sviluppatore",
		"freelance",
	],
	en: ["full stack developer", "web developer Italy", "React developer", "Next.js developer", "NestJS developer", "ASP.NET developer", "TypeScript", "custom web apps", "API integrations", "Cloudflare", "portfolio", "freelance developer"],
};

export const pages: Record<string, PageSeo> = {
	home: {
		title: { it: `${author} · sviluppatore full stack`, en: `${author} · full stack developer` },
		description: {
			it: "Sviluppatore full stack di Oria (BR): interfacce React e Next.js, API NestJS e .NET, database, integrazioni e deploy su Cloudflare e VPS Linux. Progetti, percorso e contatti.",
			en: "Full stack developer based in Apulia, Italy: React and Next.js interfaces, NestJS and .NET APIs, databases, integrations and deployment on Cloudflare and Linux VPS. Projects, background and contact.",
		},
		image: "/og/home.jpg",
		imageAlt: { it: `${author}: sviluppatore full stack. Dal DNS all'ultimo pixel.`, en: `${author}: full stack developer. From DNS to the last pixel.` },
	},
	progetti: {
		title: { it: `Progetti · ${author}`, en: `Projects · ${author}` },
		description: {
			it: "I progetti di Salvatore D'Amico: menu digitale, gestionale per affitti brevi, piattaforma per un campionato di calcio, app desktop in Rust e software aziendale.",
			en: "Salvatore D'Amico's projects: a digital menu, a short-term rental management tool, a football league platform, a Rust desktop app and company software.",
		},
		image: "/og/progetti.jpg",
		imageAlt: { it: "Progetti di Salvatore D'Amico", en: "Projects by Salvatore D'Amico" },
	},
	stack: {
		title: { it: `Stack e competenze · ${author}`, en: `Stack and skills · ${author}` },
		description: {
			it: "Le competenze di Salvatore D'Amico come in un sistema solare: React, Next.js, NestJS, ASP.NET, Oracle, SQL, Cloudflare e Linux, con la sua attività GitHub in diretta.",
			en: "Salvatore D'Amico's skills as a solar system: React, Next.js, NestJS, ASP.NET, Oracle, SQL, Cloudflare and Linux, with live GitHub activity.",
		},
		image: "/og/stack.jpg",
		imageAlt: { it: "Stack e competenze di Salvatore D'Amico", en: "Salvatore D'Amico's stack and skills" },
	},
	lab: {
		title: { it: `Lab AI · ${author}`, en: `AI Lab · ${author}` },
		description: {
			it: "Il laboratorio AI del portfolio: scrivi un problema e ottieni un piano di lavoro, oppure parla con FR7 Bot, il bassotto digitale.",
			en: "The portfolio's AI lab: describe a problem and get a work plan, or chat with FR7 Bot, the digital dachshund.",
		},
		image: "/og/lab.jpg",
		imageAlt: { it: "Lab AI di Salvatore D'Amico", en: "Salvatore D'Amico's AI Lab" },
	},
	"chi-sono": {
		title: { it: `Chi sono · ${author}`, en: `About · ${author}` },
		description: {
			it: "Chi è Salvatore D'Amico: sviluppatore full stack da circa tre anni, dal DNS all'ultimo pixel, in cerca di un ruolo e aperto a progetti su misura.",
			en: "Who Salvatore D'Amico is: a full stack developer for about three years, from DNS to the last pixel, open to a role and to tailor-made projects.",
		},
		image: "/og/chi-sono.jpg",
		imageAlt: { it: "Chi è Salvatore D'Amico", en: "About Salvatore D'Amico" },
	},
	contatti: {
		title: { it: `Contatti · ${author}`, en: `Contact · ${author}` },
		description: {
			it: "Scrivi a Salvatore D'Amico: racconta cosa ti serve e ricevi una risposta. Email, WhatsApp, LinkedIn e GitHub.",
			en: "Write to Salvatore D'Amico: tell him what you need and get a reply. Email, WhatsApp, LinkedIn and GitHub.",
		},
		image: "/og/contatti.jpg",
		imageAlt: { it: "Contatta Salvatore D'Amico", en: "Contact Salvatore D'Amico" },
	},
};

export function projectSeo(p: Project): PageSeo {
	return {
		title: { it: `${p.name} · ${author}`, en: `${p.name} · ${author}` },
		description: p.summary,
		image: `/og/${p.id}.jpg`,
		imageAlt: { it: `${p.name}: ${p.tag.it}`, en: `${p.name}: ${p.tag.en}` },
		type: "article",
	};
}

/** SEO di una pagina dal suo percorso (`/progetti/cable`, `/stack`, …). Le pagine sconosciute non vanno indicizzate. */
export function seoFor(path: string): { seo: PageSeo; canonical: string; index: boolean } {
	const clean = path.replace(/\/+$/, "") || "/";
	if (clean === "/") return { seo: pages.home, canonical: "/", index: true };
	const m = /^\/progetti\/([^/]+)$/.exec(clean);
	if (m) {
		const p = projects.find((x) => x.id === m[1]);
		if (p) return { seo: projectSeo(p), canonical: clean, index: true };
	}
	const key = clean.slice(1);
	if (pages[key]) return { seo: pages[key], canonical: clean, index: true };
	return { seo: pages.home, canonical: clean, index: false };
}

export const siteName = author;
export const twitterCreator = "";
export const sameAs = [profile.github, profile.linkedin];
