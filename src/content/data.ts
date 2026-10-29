/* ------------------------------------------------------------------
   Tutti i contenuti del portfolio vivono qui.
   Per aggiungere o aggiornare un progetto basta modificare questo file:
   il layout si adatta da solo.
------------------------------------------------------------------- */

export type Lang = "it" | "en";
export type L = Record<Lang, string>;

/** Indirizzo pubblico del sito: si cambia in vite.config.ts */
export const SITE_URL = __SITE_URL__;

export const profile = {
	name: "Salvatore D'Amico",
	fullName: "Salvatore Alessandro D'Amico",
	/** Da aggiornare al prossimo compleanno */
	age: 30,
	email: "damicosalvatorealessandro@gmail.com",
	whatsapp: "393792242254",
	github: "https://github.com/Frelser77",
	linkedin: "https://www.linkedin.com/in/salvatore-dam/",
	cv: "/cv/Salvatore-DAmico-CV.pdf",
	town: "Oria (BR)",
	location: { it: "Oria (BR), Puglia", en: "Oria (Brindisi), Apulia, Italy" } as L,
};

/* ---------------------------- Competenze ---------------------------- */

export interface Skill {
	name: string;
	/** sigla nel riquadro colorato */
	mark: string;
	color: string;
}

export const skillGroups: { title: L; items: Skill[] }[] = [
	{
		title: { it: "Frontend", en: "Frontend" },
		items: [
			{ name: "React", mark: "Re", color: "#61dafb" },
			{ name: "Next.js", mark: "Nx", color: "#e8ecff" },
			{ name: "TypeScript", mark: "TS", color: "#4a8fe7" },
			{ name: "JavaScript", mark: "JS", color: "#f7df1e" },
			{ name: "Tailwind CSS", mark: "Tw", color: "#5ad1ff" },
			{ name: "MUI", mark: "Mu", color: "#8fb4ff" },
		],
	},
	{
		title: { it: "Backend", en: "Backend" },
		items: [
			{ name: "NestJS", mark: "Ne", color: "#ff7d9a" },
			{ name: "Node.js", mark: "No", color: "#6fcf97" },
			{ name: "ASP.NET Core", mark: "NET", color: "#b08cff" },
			{ name: "C#", mark: "C#", color: "#c4a8ff" },
		],
	},
	{
		title: { it: "Database", en: "Databases" },
		items: [
			{ name: "Oracle", mark: "Or", color: "#ff8a7a" },
			{ name: "SQL Server", mark: "SQ", color: "#9fb0d8" },
			{ name: "MySQL", mark: "My", color: "#5ab0ff" },
			{ name: "MongoDB", mark: "Mo", color: "#6fcf97" },
			{ name: "Redis", mark: "Rd", color: "#ff7a6b" },
		],
	},
	{
		title: { it: "Infrastruttura", en: "Infrastructure" },
		items: [
			{ name: "Cloudflare", mark: "Cf", color: "#ffb066" },
			{ name: "Linux", mark: "Lx", color: "#ffe27a" },
			{ name: "Nginx", mark: "Ngx", color: "#7fe0a0" },
			{ name: "Git", mark: "Gi", color: "#ff8a65" },
		],
	},
	{
		title: { it: "Integrazioni", en: "Integrations" },
		items: [
			{ name: "3CX", mark: "3C", color: "#7fdcff" },
			{ name: "Slack", mark: "Sl", color: "#ff9ec4" },
			{ name: "Salesforce", mark: "Sf", color: "#5ad1ff" },
			{ name: "Stripe", mark: "St", color: "#b9a8ff" },
		],
	},
];

/* ---------------------------- Progetti ---------------------------- */

export type ProjectStatus = "live" | "dev" | "internal" | "desktop" | "offline" | "code";

export interface Project {
	id: string;
	name: string;
	/** sigla grande sulla copertina della scheda */
	mark: string;
	/** tre colori del gradiente della copertina, dal più scuro al più chiaro */
	tint: [string, string, string];
	/** riga sotto il nome, nella scheda */
	tag: L;
	status: ProjectStatus;
	years?: string;
	summary: L;
	details: L;
	highlights: L[];
	stack: string[];
	links?: { label: L; href: string }[];
	/** URL caricabile nell'anteprima live (solo progetti online) */
	preview?: string;
}

export const statusLabel: Record<ProjectStatus, L> = {
	live: { it: "Online", en: "Live" },
	dev: { it: "In sviluppo", en: "In progress" },
	internal: { it: "Uso interno", en: "Internal tool" },
	desktop: { it: "App desktop", en: "Desktop app" },
	offline: { it: "Non più online", en: "No longer online" },
	code: { it: "Codice su GitHub", en: "Code on GitHub" },
};

export const projects: Project[] = [
	{
		id: "bite-the-trouble",
		name: "Bite the Trouble",
		mark: "BT",
		tint: ["#2b1238", "#9b3d2e", "#e0902f"],
		tag: { it: "Menu digitale | React", en: "Digital menu | React" },
		status: "live",
		summary: {
			it: "Il menu online del locale: si apre dal telefono e si consulta in pochi secondi.",
			en: "The venue's online menu: opens on any phone and reads in seconds.",
		},
		details: {
			it: "Ho sviluppato e pubblicato il menu online di Bite the Trouble in React. È pensato prima di tutto per lo smartphone: si carica in fretta e si legge bene anche in sala.",
			en: "I built and shipped Bite the Trouble's online menu in React. It is phone-first: quick to load and easy to read in a busy room.",
		},
		highlights: [
			{ it: "Pensato per lo smartphone, funziona anche su tablet e desktop", en: "Built for phones first, works on tablet and desktop too" },
			{ it: "Online e mantenuto da me", en: "Live, and maintained by me" },
		],
		stack: ["React", "Render"],
		links: [{ label: { it: "Apri il menu", en: "Open the menu" }, href: "https://bitethetrouble-menu.onrender.com/" }],
		preview: "https://bitethetrouble-menu.onrender.com/",
	},
	{
		id: "casaurea",
		name: "Domus per Casaurea",
		mark: "Ca",
		tint: ["#0a2748", "#1a6aa6", "#4cc3d9"],
		tag: { it: "Gestionale | Lodgify", en: "Management tool | Lodgify" },
		status: "dev",
		summary: {
			it: "Il gestionale di un'attività di affitti brevi: prenotazioni da Lodgify, conti e amministrazione in un unico posto.",
			en: "Management software for a short-term rental business: Lodgify bookings, accounts and admin in one place.",
		},
		details: {
			it: "Domus importa i dati da Lodgify e li usa per gestire l'intera parte economica e amministrativa di Casaurea: ricavi, calendario, ruoli degli utenti. Lo sto sviluppando per Casaurea insieme al loro nuovo sito web, con un'architettura pensata per diventare un SaaS.",
			en: "Domus pulls data from Lodgify and uses it to run Casaurea's whole financial and administrative side: revenue, calendar, user roles. I'm building it for Casaurea together with their new website, on an architecture designed to become a SaaS.",
		},
		highlights: [
			{ it: "Integrazione con le API di Lodgify", en: "Lodgify API integration" },
			{ it: "Gestione economica e amministrativa completa", en: "Full financial and administrative management" },
			{ it: "Dashboard dei ricavi e calendario sincronizzato via ICS", en: "Revenue dashboard and calendar synced over ICS" },
			{ it: "Ruoli e permessi per chi lavora nella struttura", en: "Roles and permissions for the team" },
		],
		stack: ["Lodgify API", "ICS"],
	},
	{
		id: "san-antonio",
		name: "Campionato San Antonio",
		mark: "SA",
		tint: ["#0c2a22", "#1f7a4f", "#c8c462"],
		tag: { it: "Piattaforma web | React + TS", en: "Web platform | React + TS" },
		status: "offline",
		summary: {
			it: "Piattaforma per un campionato di calcio, con pannelli live e back-office usabile anche senza rete.",
			en: "Platform for a local football league, with live panels and a back office that works offline.",
		},
		details: {
			it: "Pannelli live per seguire il campionato durante le partite. Il back-office funziona anche offline e l'ho portato in Electron per usarlo direttamente a bordo campo.",
			en: "Live panels to follow the league during matches. The back office works offline, and I packaged it with Electron so it could run right at the pitch side.",
		},
		highlights: [
			{ it: "Pannelli live durante le partite", en: "Live panels during matches" },
			{ it: "Back-office offline, pacchettizzato con Electron", en: "Offline back office, packaged with Electron" },
		],
		stack: ["React", "TypeScript", "Context API", "Electron"],
	},
	{
		id: "primed",
		name: "Primed Group",
		mark: "PG",
		tint: ["#141a52", "#3b3fb5", "#7a5cf0"],
		tag: { it: "Software aziendale | NestJS + Oracle", en: "Company software | NestJS + Oracle" },
		status: "internal",
		years: "2024 – 2025",
		summary: {
			it: "Piattaforma gestionale aziendale: riscrittura del legacy, permessi, telefonia, credito e notifiche.",
			en: "Company platform: legacy rewrite, permissions, telephony, credit checks and notifications.",
		},
		details: {
			it: "Come Full-Stack Developer & IT Specialist ho portato moduli Classic ASP su NestJS con Oracle 9i, progettato il sistema di autorizzazioni e integrato centralino, Slack, CreditSafe e WhatsApp.",
			en: "As Full-Stack Developer & IT Specialist I moved Classic ASP modules to NestJS on Oracle 9i, designed the authorization system and integrated the phone system, Slack, CreditSafe and WhatsApp.",
		},
		highlights: [
			{ it: "Moduli Classic ASP riscritti in NestJS: processi critici da 20 s a circa 3 s", en: "Classic ASP modules rewritten in NestJS: critical processes from 20 s to about 3 s" },
			{ it: "Autorizzazioni end-to-end: profili, ruoli, permessi, pagine per ruolo", en: "End-to-end authorization: profiles, roles, permissions, role-based pages" },
			{ it: "Centralino 3CX: chiamate live, notifiche di chiamate perse, CDR", en: "3CX phone system: live calls, missed-call alerts, CDR" },
			{ it: "WhatsApp e profilazione clienti tramite Salesforce", en: "WhatsApp messaging and customer profiling via Salesforce" },
			{ it: "CreditSafe: monitoraggi pianificati e regole di affidabilità", en: "CreditSafe: scheduled monitoring and credit rules" },
			{ it: "Storico modifiche campo per campo, log con correlation-id", en: "Field-level change history, logs with correlation IDs" },
		],
		stack: ["NestJS", "Oracle 9i", "Next.js", "MUI", "WebSocket", "3CX", "Slack API", "Salesforce", "PM2"],
	},
	{
		id: "restofull",
		name: "Restofull",
		mark: "Rf",
		tint: ["#3a1020", "#a8325a", "#f08a6b"],
		tag: { it: "Gestionale web | Next.js + NestJS", en: "Web app | Next.js + NestJS" },
		status: "offline",
		summary: {
			it: "Gestionale web per ristoranti: ordini, tavoli, menu e prenotazioni. Con un mini-gioco arcade integrato.",
			en: "Web app for restaurants: orders, tables, menus and bookings. Ships with a small arcade game.",
		},
		details: {
			it: "Un prodotto completo, dal database al deploy: frontend Next.js, API NestJS, MySQL e Redis per la cache, pubblicato su una VPS Linux dietro un tunnel Cloudflare.",
			en: "A full product, from database to deploy: Next.js frontend, NestJS API, MySQL with Redis caching, hosted on a Linux VPS behind a Cloudflare Tunnel.",
		},
		highlights: [
			{ it: "Gestione completa di ordini, tavoli, menu e prenotazioni", en: "Orders, tables, menus and bookings in one place" },
			{ it: "Deploy su VPS Linux con tunnel Cloudflare", en: "Deployed on a Linux VPS through a Cloudflare Tunnel" },
		],
		stack: ["Next.js", "NestJS", "MySQL", "Redis", "Nginx", "Cloudflare Tunnel"],
	},
	{
		id: "crypto-monitor",
		name: "Crypto Monitor",
		mark: "CM",
		tint: ["#1a1440", "#5b3fd0", "#2fd0c4"],
		tag: { it: "Web app | React + ASP.NET", en: "Web app | React + ASP.NET" },
		status: "offline",
		summary: {
			it: "Monitoraggio di criptovalute con account, ruoli e pagamenti.",
			en: "Crypto tracking app with accounts, roles and payments.",
		},
		details: {
			it: "Frontend Vite + React, API in ASP.NET Core con autenticazione JWT e ruoli, pagamenti con Stripe e dati di mercato da Coinbase.",
			en: "Vite + React frontend, ASP.NET Core API with JWT auth and roles, Stripe payments and market data from Coinbase.",
		},
		highlights: [
			{ it: "Autenticazione JWT con ruoli", en: "JWT authentication with roles" },
			{ it: "Pagamenti Stripe e dati Coinbase", en: "Stripe payments and Coinbase data" },
		],
		stack: ["React", "Vite", "ASP.NET Core", "C#", "SQL Server", "Stripe", "Coinbase API"],
	},
	{
		id: "crud-builder",
		name: "CRUD Builder",
		mark: "CB",
		tint: ["#10223a", "#2d5b9e", "#8fa0ff"],
		tag: { it: "App desktop | Electron + React", en: "Desktop app | Electron + React" },
		status: "desktop",
		summary: {
			it: "Genera interfacce e schemi tipizzati partendo da una collezione MongoDB.",
			en: "Generates typed schemas and admin screens from a MongoDB collection.",
		},
		details: {
			it: "Un'app desktop in Electron + React che legge le collezioni MongoDB e produce schemi tipizzati e schermate CRUD pronte all'uso.",
			en: "An Electron + React desktop app that reads MongoDB collections and outputs typed schemas and ready-to-use CRUD screens.",
		},
		highlights: [
			{ it: "Schemi tipizzati generati in automatico", en: "Typed schemas generated automatically" },
			{ it: "Schermate CRUD pronte da usare", en: "Ready-to-use CRUD screens" },
		],
		stack: ["Electron", "React", "MongoDB", "TypeScript"],
	},
	{
		id: "epicode",
		name: "Progetti Epicode",
		mark: "Ep",
		tint: ["#241046", "#7a2fa0", "#d85ab8"],
		tag: { it: "Formazione | React + ASP.NET", en: "Training | React + ASP.NET" },
		status: "code",
		years: "2023 – 2024",
		summary: {
			it: "I progetti con cui ho imparato: cloni di app note, e-commerce, meteo.",
			en: "The projects I learned with: well-known app clones, e-commerce, weather.",
		},
		details: {
			it: "Esercitazioni e progetti d'esame del corso Full-Stack Developer. Il codice è pubblico su GitHub.",
			en: "Exercises and exam projects from the Full-Stack Developer course. All code is public on GitHub.",
		},
		highlights: [
			{ it: "Redux Toolkit, routing, chiamate API, autenticazione", en: "Redux Toolkit, routing, API calls, authentication" },
			{ it: "E-commerce d'esame con backend ASP.NET", en: "Final e-commerce project with an ASP.NET backend" },
		],
		stack: ["React", "Redux", "JavaScript", "ASP.NET", "C#", "SQL Server"],
		links: [
			{ label: { it: "LinkedIn (Redux)", en: "LinkedIn (Redux)" }, href: "https://github.com/Frelser77/linkedin-redux" },
			{ label: { it: "Netflix", en: "Netflix" }, href: "https://github.com/Frelser77/netflix-clone-route" },
			{ label: { it: "Spotify", en: "Spotify" }, href: "https://github.com/Frelser77/Spotify-clone" },
			{ label: { it: "Meteo", en: "Weather" }, href: "https://github.com/Frelser77/weather_app" },
			{ label: { it: "E-commerce", en: "E-commerce" }, href: "https://github.com/Frelser77/Ecommerce-Esame" },
		],
	},
];

/* ------------------------------ Percorso ------------------------------ */

export interface Step {
	years: L;
	role: L;
	place: L;
	text: L;
	certificates?: boolean;
}

export const journey: Step[] = [
	{
		years: { it: "Oggi", en: "Now" },
		role: { it: "Sviluppatore full stack", en: "Full stack developer" },
		place: { it: "Casaurea, Bite the Trouble e progetti miei", en: "Casaurea, Bite the Trouble and my own projects" },
		text: {
			it: "Sviluppo e metto online software dal codice al dominio, ai DNS e all'email, tra gestionali, siti e prodotti miei.",
			en: "I build and ship software from code to domain, DNS and email: management tools, websites and products of my own.",
		},
	},
	{
		years: { it: "2024 – 2025", en: "2024 – 2025" },
		role: { it: "Full-Stack Developer & IT Specialist", en: "Full-Stack Developer & IT Specialist" },
		place: { it: "Primed Group", en: "Primed Group" },
		text: {
			it: "Ho riscritto in NestJS i moduli legacy Classic ASP su Oracle 9i (processi critici da 20 s a circa 3 s), progettato autorizzazioni e microservizi, integrato 3CX, Slack, CreditSafe e Salesforce.",
			en: "I rewrote legacy Classic ASP modules on Oracle 9i in NestJS (critical processes from 20 s to about 3 s), designed authorization and microservices, and integrated 3CX, Slack, CreditSafe and Salesforce.",
		},
	},
	{
		years: { it: "2023 – 2024", en: "2023 – 2024" },
		role: { it: "Corso Full-Stack Developer", en: "Full-Stack Developer course" },
		place: { it: "Epicode", en: "Epicode" },
		text: {
			it: "Percorso intensivo da HTML e CSS fino a React, Redux, ASP.NET MVC, Entity Framework e SQL Server, più un corso su AI e prompt design.",
			en: "Intensive programme from HTML and CSS to React, Redux, ASP.NET MVC, Entity Framework and SQL Server, plus a course on AI and prompt design.",
		},
		certificates: true,
	},
];

export const certificates: { file: string; label: L }[] = [
	{ file: "modulo-0", label: { it: "HTML e CSS di base", en: "HTML and CSS basics" } },
	{ file: "modulo-1", label: { it: "HTML5 e CSS3", en: "HTML5 and CSS3" } },
	{ file: "modulo-2", label: { it: "JavaScript: funzioni, oggetti, array", en: "JavaScript: functions, objects, arrays" } },
	{ file: "modulo-3", label: { it: "Form, BOM, DOM ed ES6", en: "Forms, BOM, DOM and ES6" } },
	{ file: "modulo-4", label: { it: "Animazioni CSS e Flexbox", en: "CSS animations and Flexbox" } },
	{ file: "modulo-AI", label: { it: "AI e prompt design", en: "AI and prompt design" } },
	{ file: "modulo-5", label: { it: "Sass e Bootstrap", en: "Sass and Bootstrap" } },
	{ file: "modulo-6", label: { it: "OOP, AJAX, Fetch e async/await", en: "OOP, AJAX, Fetch and async/await" } },
	{ file: "modulo-7", label: { it: "React: componenti e stato", en: "React: components and state" } },
	{ file: "modulo-8", label: { it: "React Router, Redux e test", en: "React Router, Redux and testing" } },
	{ file: "modulo-9", label: { it: "Redux e TypeScript", en: "Redux and TypeScript" } },
	{ file: "modulo-10", label: { it: "OOP e C#", en: "OOP and C#" } },
	{ file: "modulo-11", label: { it: "SQL Server: DDL, DML e join", en: "SQL Server: DDL, DML and joins" } },
	{ file: "modulo-12", label: { it: "ASP.NET Web Forms e ADO.NET", en: "ASP.NET Web Forms and ADO.NET" } },
	{ file: "modulo-13", label: { it: "ASP.NET MVC", en: "ASP.NET MVC" } },
	{ file: "modulo-14", label: { it: "Validazione, autenticazione e API REST", en: "Validation, authentication and REST APIs" } },
	{ file: "modulo-16", label: { it: "Entity Framework e LINQ", en: "Entity Framework and LINQ" } },
];
