/* ------------------------------------------------------------------
   Tutti i contenuti del portfolio vivono qui.
   Per aggiungere o aggiornare un progetto basta modificare questo file:
   il layout si adatta da solo.
------------------------------------------------------------------- */

export type Lang = "it" | "en";
export type L = Record<Lang, string>;

/** Indirizzo pubblico del sito: si cambia in vite.config.ts */
export const SITE_URL: string = typeof __SITE_URL__ !== "undefined" ? __SITE_URL__ : "";

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
	cvEn: "/cv/Salvatore-DAmico-CV-EN.pdf",
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

export type ProjectStatus = "live" | "dev" | "internal" | "desktop" | "offline" | "code" | "private";

export interface Project {
	id: string;
	name: string;
	/** sigla grande sulla copertina della scheda */
	mark: string;
	/** logo del progetto (in /img/progetti), mostrato sulla copertina al posto della sigla */
	logo?: { src: string; w: number; h: number; plate?: boolean };
	/** schermate ottimizzate per il web, mostrate nella pagina del progetto */
	shots?: { src: string; w: number; h: number; alt: L; thumb?: string }[];
	/** le schermate sono verticali (app per telefono): si mostrano affiancate */
	shotsPortrait?: boolean;
	/** progetto fatto insieme a qualcun altro */
	collab?: { note: L; name?: string; url?: string };
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
	/** per chi: cliente, azienda in cui ho lavorato, progetto mio (filtri della lista) */
	kind: ProjectKind;
	/** un risultato concreto da mostrare in evidenza (home e pagina progetto) */
	result?: { value: L; label: L };
}

export type ProjectKind = "client" | "company" | "own";
export const kindLabel: Record<ProjectKind, L> = {
	client: { it: "Per clienti", en: "For clients" },
	company: { it: "In azienda", en: "At a company" },
	own: { it: "Miei", en: "My own" },
};

export const statusLabel: Record<ProjectStatus, L> = {
	live: { it: "Online", en: "Live" },
	dev: { it: "In sviluppo", en: "In progress" },
	internal: { it: "Uso interno", en: "Internal tool" },
	desktop: { it: "App desktop", en: "Desktop app" },
	offline: { it: "Non più online", en: "No longer online" },
	code: { it: "Codice su GitHub", en: "Code on GitHub" },
	private: { it: "Codice privato", en: "Private code" },
};

export const projects: Project[] = [
	{
		id: "bite-the-trouble",
		kind: "client",
		result: { value: { it: "Online", en: "Live" }, label: { it: "Il menu del locale, pensato per lo smartphone e già in uso", en: "The venue's menu, built for phones and already in use" } },
		name: "Bite the Trouble",
		mark: "BT",
		logo: { src: "/img/progetti/bt-scritta.webp", w: 400, h: 357 },
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
		kind: "client",
		result: { value: { it: "1 posto", en: "1 place" }, label: { it: "Prenotazioni Lodgify, conti e amministrazione insieme", en: "Lodgify bookings, accounts and admin together" } },
		name: "Casaurea",
		mark: "Ca",
		logo: { src: "/img/progetti/casaurea-mark.webp", w: 360, h: 357 },
		tint: ["#0a2748", "#1a6aa6", "#4cc3d9"],
		tag: { it: "Gestionale | Lodgify", en: "Management tool | Lodgify" },
		status: "dev",
		summary: {
			it: "Il gestionale di un'attività di affitti brevi: prenotazioni da Lodgify, conti e amministrazione in un unico posto.",
			en: "Management software for a short-term rental business: Lodgify bookings, accounts and admin in one place.",
		},
		details: {
			it: "Il gestionale importa i dati da Lodgify e li usa per gestire l'intera parte economica e amministrativa di Casaurea: ricavi, calendario, ruoli degli utenti. Lo sto sviluppando per Casaurea insieme al loro nuovo sito web, con un'architettura pensata per diventare un SaaS.",
			en: "The management tool pulls data from Lodgify and uses it to run Casaurea's whole financial and administrative side: revenue, calendar, user roles. I'm building it for Casaurea together with their new website, on an architecture designed to become a SaaS.",
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
		kind: "client",
		name: "Campionato San Antonio",
		mark: "SA",
		logo: { src: "/img/progetti/sa.webp", w: 420, h: 420 },
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
		id: "cable",
		kind: "own",
		name: "Cable",
		mark: "Cb",
		logo: { src: "/img/progetti/cable-icon.webp", w: 320, h: 320 },
		tint: ["#071a3d", "#1456c8", "#2fd3c4"],
		tag: { it: "App desktop | Rust + Tauri", en: "Desktop app | Rust + Tauri" },
		status: "desktop",
		summary: {
			it: "Condivisione di file e testi fra Linux e smartphone (Android o iPhone) sulla rete locale, senza account né cloud.",
			en: "File and text sharing between Linux and phones (Android or iPhone) on the local network, with no account or cloud.",
		},
		details: {
			it: "Cable parla il protocollo LocalSend v2: il PC compare fra i dispositivi vicini e si inviano file, cartelle e appunti in entrambe le direzioni, con cifratura HTTPS e verifica dell'identità del telefono. Il motore è in Rust, l'interfaccia è un guscio Tauri 2 con un design in vetro che segue il tema del sistema. Ci sono anche la ricezione in background, l'avvio con il PC e, facoltativo, lo schermo dell'iPhone sul PC via AirPlay.",
			en: "Cable speaks the LocalSend v2 protocol: the PC shows up among nearby devices and you send files, folders and clipboard text both ways, over HTTPS with phone identity verification. The engine is written in Rust, the interface is a Tauri 2 shell with a glass design that follows the system theme. It also receives in the background, starts with the PC and, optionally, mirrors an iPhone screen to the PC over AirPlay.",
		},
		highlights: [
			{ it: "Motore in Rust (tokio, hyper, rustls), un solo binario", en: "Rust engine (tokio, hyper, rustls), a single binary" },
			{ it: "Compatibile con LocalSend: nessun account, nessun cloud", en: "LocalSend-compatible: no account, no cloud" },
			{ it: "Identità verificabile dei dispositivi e PIN di ricezione", en: "Verifiable device identity and a receive PIN" },
			{ it: "Test automatici: unitari, end-to-end e sulla ricezione", en: "Automated tests: unit, end-to-end and receiving" },
		],
		collab: { note: { it: "Progettata e sviluppata insieme al collega", en: "Designed and built together with colleague" }, name: "lonelyfrank", url: "https://lonelyfrank.github.io/web-portfolio/" },
		stack: ["Rust", "Tauri 2", "tokio", "LocalSend v2"],
		links: [{ label: { it: "Codice su GitHub", en: "Code on GitHub" }, href: "https://github.com/lonelyfrank/cable" }],
		shots: [
			{ src: "/img/progetti/cable-home.webp", w: 1070, h: 845, alt: { it: "Cable: schermata Home con destinatario, invio file e appunti condivisi", en: "Cable: Home screen with recipient, file sending and shared clipboard" } },
			{ src: "/img/progetti/cable-condividi.webp", w: 1070, h: 825, alt: { it: "Cable: elenco dei dispositivi vicini e trasferimenti", en: "Cable: nearby devices and transfers" } },
			{ src: "/img/progetti/cable-schermo.webp", w: 1070, h: 670, alt: { it: "Cable: schermo dell'iPhone sul PC", en: "Cable: iPhone screen on the PC" } },
		],
	},
	{
		id: "bt-darts",
		kind: "own",
		name: "BT Darts Score Board",
		mark: "BD",
		logo: { src: "/img/progetti/darts-logo.webp", w: 300, h: 293 },
		tint: ["#1c0b1f", "#a3135a", "#ff4fa3"],
		tag: { it: "Web app PWA | React + TypeScript", en: "PWA web app | React + TypeScript" },
		status: "code",
		summary: {
			it: "Il segnapunti delle serate freccette del Bite the Trouble: partite, tornei e Hi-Score Nights, anche senza connessione.",
			en: "The scoreboard for Bite the Trouble's darts nights: matches, tournaments and Hi-Score Nights, even offline.",
		},
		details: {
			it: "Un'app pensata per il telefono, accanto al totem delle freccette del locale: si segnano i tre tiri di ogni giocatore, si gestiscono gironi, eliminazione diretta e finali dei migliori quattro, e la classifica si aggiorna da sola. Funziona offline come app installabile; in modalità cloud ci sono account con password o passkey, più telefoni sulla stessa partita e un solo segnapunti per volta.",
			en: "A phone-first app that sits next to the venue's darts machine: you log each player's three throws, run round-robin groups, knockouts and top-four finals, and the standings update on their own. It works offline as an installable app; in cloud mode there are accounts with password or passkey, several phones on the same match and a single scorer at a time.",
		},
		highlights: [
			{ it: "Segnapunti con tastierino, correzioni e annullamento dei turni", en: "Scoring keypad with corrections and undo" },
			{ it: "Tornei a gironi, eliminazione diretta e Hi-Score Nights", en: "Round-robin, knockout and Hi-Score Nights tournaments" },
			{ it: "PWA offline-first, con modalità cloud su Cloudflare e API Fastify", en: "Offline-first PWA, with a Cloudflare cloud mode and a Fastify API" },
			{ it: "Testata con Vitest e Playwright", en: "Tested with Vitest and Playwright" },
		],
		stack: ["React", "TypeScript", "Fastify", "Cloudflare", "SQLite"],
		collab: { note: { it: "Progettata e sviluppata insieme al collega", en: "Designed and built together with colleague" }, name: "lonelyfrank", url: "https://lonelyfrank.github.io/web-portfolio/" },
		links: [{ label: { it: "Codice su GitHub", en: "Code on GitHub" }, href: "https://github.com/lonelyfrank/BT-score-board" }],
		shotsPortrait: true,
		shots: [
			{ src: "/img/progetti/darts-home.webp", thumb: "/img/progetti/darts-home-s.webp", w: 780, h: 1688, alt: { it: "BT Darts: schermata Home con ripresa della partita", en: "BT Darts: Home screen with resume match" } },
			{ src: "/img/progetti/darts-turno.webp", thumb: "/img/progetti/darts-turno-s.webp", w: 780, h: 1688, alt: { it: "BT Darts: turno attivo con le tre freccette", en: "BT Darts: active turn with three darts" } },
			{ src: "/img/progetti/darts-podio.webp", thumb: "/img/progetti/darts-podio-s.webp", w: 780, h: 1688, alt: { it: "BT Darts: Hi-Score Nights con il podio finale", en: "BT Darts: Hi-Score Nights with the final podium" } },
			{ src: "/img/progetti/darts-risultato.webp", thumb: "/img/progetti/darts-risultato-s.webp", w: 780, h: 1688, alt: { it: "BT Darts: risultato finale e classifica", en: "BT Darts: final result and standings" } },
		],
	},
	{
		id: "primed",
		kind: "company",
		result: { value: { it: "Più veloce", en: "Faster" }, label: { it: "Moduli legacy riscritti in NestJS e processi critici ottimizzati", en: "Legacy modules rewritten in NestJS, critical processes optimised" } },
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
			{ it: "Moduli Classic ASP riscritti in NestJS, con i processi critici ottimizzati", en: "Classic ASP modules rewritten in NestJS, with critical processes optimised" },
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
		kind: "own",
		name: "Restofull",
		mark: "Rf",
		logo: { src: "/img/progetti/restofull-logo.webp", w: 392, h: 110, plate: true },
		tint: ["#fff8ec", "#ffe7c2", "#f6c98a"],
		tag: { it: "Menu digitali per locali | Next.js + Prisma", en: "Digital menus for venues | Next.js + Prisma" },
		status: "private",
		summary: {
			it: "Piattaforma SaaS di menu digitali per bar e ristoranti: più locali per account, QR code, abbonamenti con pagamenti ricorrenti.",
			en: "SaaS platform of digital menus for bars and restaurants: several venues per account, QR codes, recurring-payment subscriptions.",
		},
		details: {
			it: "Un prodotto completo: area per i gestori con catalogo prodotti, tematizzazione di ogni locale e generazione del QR del menu; ruoli (admin, gestore, utente) con login su cookie HttpOnly e JWT; piani a pagamento con Stripe e moduli aggiuntivi come tavoli, collaboratori e vista cucina.",
			en: "A complete product: an area for owners with a product catalogue, per-venue theming and menu QR generation; roles (admin, owner, user) with HttpOnly-cookie JWT login; paid plans with Stripe and add-on modules such as tables, staff accounts and a kitchen view.",
		},
		highlights: [
			{ it: "Multi-locale e multi-abbonamento, con limite di locali per piano", en: "Multi-venue and multi-subscription, with a venue limit per plan" },
			{ it: "Pagamenti ricorrenti con Stripe e moduli addon", en: "Recurring payments with Stripe and add-on modules" },
			{ it: "Input validati con Zod, autenticazione JWT su cookie HttpOnly", en: "Zod-validated input, JWT auth in HttpOnly cookies" },
		],
		stack: ["Next.js", "React", "TypeScript", "Prisma", "MySQL", "Tailwind CSS", "Stripe", "Zod"],
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
			it: "Ho riscritto in NestJS i moduli legacy Classic ASP su Oracle 9i, ottimizzando i processi critici, progettato autorizzazioni e microservizi, integrato 3CX, Slack, CreditSafe e Salesforce.",
			en: "I rewrote legacy Classic ASP modules on Oracle 9i in NestJS, optimising critical processes, designed authorization and microservices, and integrated 3CX, Slack, CreditSafe and Salesforce.",
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

/** Le esigenze del configuratore: ogni voce rimanda a un lavoro vero. */
export interface Need {
	id: "gestionale" | "sito" | "integrazioni" | "legacy" | "online" | "altro";
	title: L;
	pitch: L;
	steps: [L, L, L];
	example?: { projectId?: string; label: L };
	brief: L;
}

export const needs: Need[] = [
	{
		id: "gestionale",
		title: { it: "Un gestionale su misura", en: "Custom management software" },
		pitch: {
			it: "Un unico posto per prenotazioni, conti e amministrazione, fatto sul tuo modo di lavorare.",
			en: "One place for bookings, accounts and admin, built around the way you work.",
		},
		steps: [
			{ it: "Capisco come lavori oggi e cosa ti fa perdere tempo", en: "I learn how you work today and what wastes your time" },
			{ it: "Porto i dati in un solo gestionale chiaro", en: "I bring the data into one clear system" },
			{ it: "Lo collego agli strumenti che usi già (es. Lodgify)", en: "I connect it to the tools you already use (e.g. Lodgify)" },
		],
		example: { projectId: "casaurea", label: { it: "Il gestionale di Casaurea", en: "Casaurea's management tool" } },
		brief: { it: "Mi serve un gestionale su misura.", en: "I need custom management software." },
	},
	{
		id: "sito",
		title: { it: "Un sito o un menu digitale", en: "A website or digital menu" },
		pitch: {
			it: "Pagine veloci da telefono, semplici da aggiornare, online con dominio ed email.",
			en: "Pages that are fast on a phone, easy to update, online with domain and email.",
		},
		steps: [
			{ it: "Progetto poche pagine chiare, pensate per lo smartphone", en: "I design a few clear pages, made for the smartphone" },
			{ it: "Le costruisco in React, veloci e curate", en: "I build them in React, fast and polished" },
			{ it: "Le pubblico con dominio, DNS ed email e le mantengo", en: "I publish them with domain, DNS and email, and maintain them" },
		],
		example: { projectId: "bite-the-trouble", label: { it: "Il menu di Bite the Trouble", en: "The Bite the Trouble menu" } },
		brief: { it: "Mi serve un sito o un menu digitale.", en: "I need a website or a digital menu." },
	},
	{
		id: "integrazioni",
		title: { it: "Far parlare i tuoi strumenti", en: "Make your tools talk" },
		pitch: {
			it: "Telefonia, chat, CRM e pagamenti collegati tra loro, senza copia e incolla.",
			en: "Telephony, chat, CRM and payments connected, with no copy and paste.",
		},
		steps: [
			{ it: "Mappo gli strumenti che usi e dove i dati si perdono", en: "I map your tools and where data gets lost" },
			{ it: "Costruisco i collegamenti tra un servizio e l'altro", en: "I build the connections between services" },
			{ it: "Controllo che i dati arrivino giusti dove servono", en: "I check the data lands correctly where it's needed" },
		],
		example: { projectId: "primed", label: { it: "In Primed: 3CX, Slack, CreditSafe, Salesforce", en: "At Primed: 3CX, Slack, CreditSafe, Salesforce" } },
		brief: { it: "Vorrei collegare tra loro i miei strumenti.", en: "I'd like to connect my tools together." },
	},
	{
		id: "legacy",
		title: { it: "Rinnovare un software vecchio", en: "Renew an old piece of software" },
		pitch: {
			it: "Un programma datato che funziona ma fa paura toccare? Lo riscrivo con tecnologie moderne.",
			en: "An old program that works but scares everyone to touch? I rewrite it with modern technology.",
		},
		steps: [
			{ it: "Studio come funziona oggi, anche dove manca documentazione", en: "I study how it works today, even where docs are missing" },
			{ it: "Lo riscrivo modulo per modulo con tecnologie attuali", en: "I rewrite it module by module with current technology" },
			{ it: "Ottimizzo dove serve: diventa anche più veloce", en: "I optimise where it counts: it gets faster too" },
		],
		example: { projectId: "primed", label: { it: "Primed: da Classic ASP a NestJS", en: "Primed: from Classic ASP to NestJS" } },
		brief: { it: "Ho un software vecchio da rinnovare.", en: "I have an old piece of software to renew." },
	},
	{
		id: "online",
		title: { it: "Metterti online, bene", en: "Getting you online, properly" },
		pitch: {
			it: "Dominio, DNS, email e server: tutto quello che serve perché il progetto stia in piedi.",
			en: "Domain, DNS, email and servers: everything the project needs to stand up.",
		},
		steps: [
			{ it: "Configuro dominio e DNS", en: "I set up domain and DNS" },
			{ it: "Attivo email professionali", en: "I set up professional email" },
			{ it: "Pubblico su Cloudflare o su server Linux", en: "I publish on Cloudflare or on a Linux server" },
		],
		example: { label: { it: "Questo stesso sito, online su Cloudflare", en: "This very site, online on Cloudflare" } },
		brief: { it: "Mi serve aiuto per mettere online il mio progetto.", en: "I need help putting my project online." },
	},
	{
		id: "altro",
		title: { it: "Non lo so ancora", en: "I'm not sure yet" },
		pitch: {
			it: "Nessun problema: raccontami la situazione e la trasformiamo insieme in un piano.",
			en: "No problem: tell me the situation and we'll turn it into a plan together.",
		},
		steps: [
			{ it: "Mi racconti il problema con parole tue", en: "You tell me the problem in your own words" },
			{ it: "Ti dico cosa serve davvero e cosa no", en: "I tell you what's really needed and what isn't" },
			{ it: "Decidiamo insieme da dove partire", en: "We decide together where to start" },
		],
		brief: { it: "Ho un'idea ma non so ancora da dove partire.", en: "I have an idea but I'm not sure where to start." },
	},
];
