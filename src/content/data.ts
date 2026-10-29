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
	email: "damicosalvatorea@icloud.com",
	whatsapp: "393792242254",
	github: "https://github.com/Frelser77",
	linkedin: "https://www.linkedin.com/in/salvatore-dam/",
	cv: "/cv/Salvatore-DAmico-CV.pdf",
	location: { it: "Oria (BR), Puglia", en: "Oria (Brindisi), Apulia, Italy" } as L,
};

/* ---------------------------- Progetti ---------------------------- */

export type ProjectStatus = "live" | "dev" | "internal" | "desktop" | "offline" | "code";
export type ProjectKind = "client" | "work" | "personal" | "training";

export interface Project {
	id: string;
	name: string;
	kind: ProjectKind;
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
	offline: { it: "Offline", en: "Offline" },
	code: { it: "Codice su GitHub", en: "Code on GitHub" },
};

export const kindLabel: Record<ProjectKind, L> = {
	client: { it: "Per clienti", en: "Client work" },
	work: { it: "In azienda", en: "In-house" },
	personal: { it: "Personali", en: "Personal" },
	training: { it: "Formazione", en: "Training" },
};

export const projects: Project[] = [
	{
		id: "bite-the-trouble",
		name: "Bite the Trouble",
		kind: "client",
		status: "live",
		summary: {
			it: "Il menu digitale del locale: si apre dal telefono e si consulta in pochi secondi.",
			en: "The venue's digital menu: opens on any phone and reads in seconds.",
		},
		details: {
			it: "Ho progettato, sviluppato e pubblicato il menu online di Bite the Trouble. È pensato prima di tutto per lo smartphone: si carica in fretta e si legge bene anche in sala.",
			en: "I designed, built and shipped Bite the Trouble's online menu. It is phone-first: quick to load and easy to read in a busy room.",
		},
		highlights: [
			{ it: "Progettato per lo smartphone, funziona anche su tablet e desktop", en: "Built for phones first, works on tablet and desktop too" },
			{ it: "Online e mantenuto da me", en: "Live, and maintained by me" },
		],
		stack: ["React", "Render"],
		links: [{ label: { it: "Apri il menu", en: "Open the menu" }, href: "https://bitethetrouble-menu.onrender.com/" }],
		preview: "https://bitethetrouble-menu.onrender.com/",
	},
	{
		id: "casaurea",
		name: "Domus per Casaurea",
		kind: "client",
		status: "dev",
		summary: {
			it: "Il gestionale di un'attività di affitti brevi: prenotazioni da Lodgify, conti e amministrazione in un unico posto.",
			en: "Management software for a short-term rental business: Lodgify bookings, accounts and admin in one place.",
		},
		details: {
			it: "Domus importa i dati da Lodgify e li usa per gestire l'intera parte economica e amministrativa di Casaurea: ricavi, calendario, ruoli degli utenti. Lo sviluppo per Casaurea insieme al loro nuovo sito web, con un'architettura pensata per diventare un SaaS.",
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
		name: "San Antonio Champion",
		kind: "client",
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
		kind: "work",
		status: "internal",
		years: "2024 – 2025",
		summary: {
			it: "Piattaforma gestionale aziendale: refactoring del legacy, permessi, telefonia, credito e notifiche.",
			en: "Company platform: legacy refactoring, permissions, telephony, credit checks and notifications.",
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
		kind: "personal",
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
		kind: "personal",
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
		kind: "personal",
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
		name: "Progetti del percorso Epicode",
		kind: "training",
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

/* ------------------------- Livelli dello stack ------------------------- */

export interface Layer {
	id: string;
	tag: string;
	name: L;
	what: L;
	tools: string[];
	projects: string[];
	/** posizione e lunghezza della barra nella "traccia", in % */
	bar: [number, number];
}

export const layers: Layer[] = [
	{
		id: "dns",
		tag: "dns",
		name: { it: "Dominio, DNS ed email", en: "Domain, DNS and email" },
		what: {
			it: "Registro e configuro domini, record DNS, caselle email e certificati SSL. Di solito su Cloudflare.",
			en: "I register and set up domains, DNS records, mailboxes and SSL certificates, usually on Cloudflare.",
		},
		tools: ["Cloudflare", "DNS", "Email", "SSL/TLS"],
		projects: ["restofull"],
		bar: [0, 9],
	},
	{
		id: "server",
		tag: "edge",
		name: { it: "Server e deploy", en: "Servers and deploys" },
		what: {
			it: "Preparo VPS Linux, Nginx e tunnel Cloudflare, gestisco permessi e processi con PM2 e job pianificati.",
			en: "I set up Linux VPSs, Nginx and Cloudflare Tunnels, and manage permissions, PM2 processes and scheduled jobs.",
		},
		tools: ["Linux", "Nginx", "Cloudflare Tunnel", "PM2", "Cron", "Git"],
		projects: ["restofull", "primed"],
		bar: [7, 14],
	},
	{
		id: "api",
		tag: "api",
		name: { it: "API e backend", en: "APIs and backend" },
		what: {
			it: "Scrivo API REST sicure in NestJS e ASP.NET: microservizi o monolite, JWT in cookie HttpOnly, ruoli, rate limiting e log tracciabili.",
			en: "I write secure REST APIs in NestJS and ASP.NET: microservices or monolith, JWT in HttpOnly cookies, roles, rate limiting and traceable logs.",
		},
		tools: ["NestJS", "Node.js", "ASP.NET Core", "C#", "Entity Framework", "JWT", "WebSocket"],
		projects: ["primed", "restofull", "crypto-monitor", "casaurea"],
		bar: [19, 30],
	},
	{
		id: "data",
		tag: "db",
		name: { it: "Database", en: "Databases" },
		what: {
			it: "Progetto schemi e scrivo query e transazioni su database relazionali e NoSQL, dal vecchio Oracle 9i a MongoDB.",
			en: "I design schemas and write queries and transactions on relational and NoSQL databases, from legacy Oracle 9i to MongoDB.",
		},
		tools: ["Oracle 9i", "PL/SQL", "SQL Server", "MySQL", "MongoDB", "Redis"],
		projects: ["primed", "restofull", "crypto-monitor", "crud-builder"],
		bar: [33, 22],
	},
	{
		id: "integrations",
		tag: "hook",
		name: { it: "Integrazioni", en: "Integrations" },
		what: {
			it: "Collego il software ai servizi che l'azienda usa già: telefonia, chat, CRM, pagamenti, prenotazioni.",
			en: "I connect software to the services a business already runs on: telephony, chat, CRM, payments, bookings.",
		},
		tools: ["3CX", "Slack API", "Salesforce", "WhatsApp", "Stripe", "Lodgify", "CreditSafe", "Outlook"],
		projects: ["primed", "casaurea", "crypto-monitor"],
		bar: [44, 18],
	},
	{
		id: "ui",
		tag: "ui",
		name: { it: "Interfacce", en: "Interfaces" },
		what: {
			it: "Costruisco interfacce React e Next.js veloci e accessibili, curate nel dettaglio su telefono, tablet e desktop.",
			en: "I build fast, accessible React and Next.js interfaces, polished on phone, tablet and desktop.",
		},
		tools: ["React", "Next.js", "TypeScript", "Vite", "Tailwind", "MUI", "Redux Toolkit", "Electron", "i18next"],
		projects: ["bite-the-trouble", "casaurea", "san-antonio", "primed"],
		bar: [62, 38],
	},
];

/* ------------------------------ Percorso ------------------------------ */

export interface Step {
	years: string;
	role: L;
	place: string;
	text: L;
	certificates?: boolean;
}

export const journey: Step[] = [
	{
		years: "2025 –",
		role: { it: "Sviluppatore full stack per clienti", en: "Full stack developer for clients" },
		place: "Casaurea, Bite the Trouble, San Antonio",
		text: {
			it: "Seguo i progetti da capo a fondo: raccolta delle esigenze, sviluppo, dominio ed email, messa online e manutenzione.",
			en: "I run projects end to end: gathering requirements, development, domain and email, launch and maintenance.",
		},
	},
	{
		years: "2024 – 2025",
		role: { it: "Full-Stack Developer & IT Specialist", en: "Full-Stack Developer & IT Specialist" },
		place: "Primed Group",
		text: {
			it: "Refactoring del legacy Classic ASP verso NestJS su Oracle 9i, architettura a microservizi, autorizzazioni, integrazioni 3CX, Slack, CreditSafe e Salesforce.",
			en: "Refactored legacy Classic ASP into NestJS on Oracle 9i, microservice architecture, authorization, 3CX, Slack, CreditSafe and Salesforce integrations.",
		},
	},
	{
		years: "2023 – 2024",
		role: { it: "Corso Full-Stack Developer", en: "Full-Stack Developer course" },
		place: "Epicode",
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

export const principles: { title: L; text: L }[] = [
	{
		title: { it: "Misuro prima di ottimizzare", en: "I measure before I optimise" },
		text: {
			it: "Prima capisco dove si perde davvero il tempo, poi intervengo dove serve.",
			en: "First I find where the time actually goes, then I fix what matters."
		},
	},
	{
		title: { it: "Lascio tracce", en: "I leave a trail" },
		text: {
			it: "Log con correlation-id, audit e storico delle modifiche: quando qualcosa si rompe, si capisce perché.",
			en: "Correlated logs, audits and change history, so when something breaks you can see why.",
		},
	},
	{
		title: { it: "Sicuro di default", en: "Secure by default" },
		text: {
			it: "Token in cookie HttpOnly, segreti fuori dal codice, CORS mirato, GDPR rispettato.",
			en: "Tokens in HttpOnly cookies, secrets out of the code, scoped CORS, GDPR respected.",
		},
	},
	{
		title: { it: "L'AI come strumento", en: "AI as a tool" },
		text: {
			it: "La uso ogni giorno per lavorare meglio e per entrare in fretta anche in stack nuovi, rileggendo sempre ciò che produce.",
			en: "I use it daily to work better and to get productive fast in unfamiliar stacks, always reviewing what it produces.",
		},
	},
];
