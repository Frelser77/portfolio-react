import type { L } from "./data";

/** Testi delle pagine aggiunte con il sito multipagina (portali, Stack live, Lab AI, Come è fatto, mobile). */
export const ui2 = {
	nav: {
		home: { it: "Home", en: "Home" },
		projects: { it: "Progetti", en: "Projects" },
		stack: { it: "Stack", en: "Stack" },
		lab: { it: "Lab AI", en: "AI Lab" },
		about: { it: "Chi sono", en: "About" },
		contact: { it: "Contatti", en: "Contact" },
		dock: { it: "Navigazione principale", en: "Main navigation" },
	},
	titles: {
		home: { it: "Salvatore D'Amico · soluzioni digitali su misura", en: "Salvatore D'Amico · tailor-made digital solutions" },
		progetti: { it: "Progetti · Salvatore D'Amico", en: "Projects · Salvatore D'Amico" },
		stack: { it: "Stack e competenze · Salvatore D'Amico", en: "Stack and skills · Salvatore D'Amico" },
		lab: { it: "Lab AI · Salvatore D'Amico", en: "AI Lab · Salvatore D'Amico" },
		"chi-sono": { it: "Chi sono · Salvatore D'Amico", en: "About · Salvatore D'Amico" },
		contatti: { it: "Contatti · Salvatore D'Amico", en: "Contact · Salvatore D'Amico" },
		admin: { it: "Richieste · Salvatore D'Amico", en: "Requests · Salvatore D'Amico" },
		"404": { it: "Pagina non trovata", en: "Page not found" },
	} as Record<string, L>,

	portal: {
		eyebrow: { it: "Esplora", en: "Explore" },
		title: { it: "Scegli da dove partire", en: "Pick where to start" },
		items: [
			{
				to: "/progetti",
				title: { it: "Progetti", en: "Projects" },
				text: { it: "Missioni vere, alcune online: aprile e guardale dal vivo.", en: "Real quests, some of them live: open and see them." },
			},
			{
				to: "/stack",
				title: { it: "Stack", en: "Stack" },
				text: { it: "Scheda personaggio, inventario e attività reale su GitHub.", en: "Character sheet, inventory and real GitHub activity." },
			},
			{
				to: "/lab",
				title: { it: "Lab AI", en: "AI Lab" },
				text: { it: "Fai domande a FR7 Bot o trasforma un problema in un piano.", en: "Ask FR7 Bot, or turn a problem into a plan." },
			},
			{
				to: "/chi-sono",
				title: { it: "Chi sono", en: "About me" },
				text: { it: "Il percorso, i corsi e le certificazioni.", en: "My path, courses and certificates." },
			},
		] as { to: string; title: L; text: L }[],
	},

	stack: {
		eco: {
			eyebrow: { it: "Ecosistema", en: "Ecosystem" },
			title: { it: "Come parlano tra loro i pezzi", en: "How the pieces talk to each other" },
			text: {
				it: "Al centro c'è un progetto, intorno le tecnologie che lo fanno vivere. Tra un pianeta e l'altro viaggiano bit e qubit: i dati che passano dal browser al server, al database, ai servizi esterni.",
				en: "A project sits in the middle, the technologies that bring it to life orbit around it. Bits and qubits drift between planets: the data passing from browser to server, to database, to outside services.",
			},
			all: { it: "Tutto", en: "All" },
			pick: { it: "Scegli un progetto", en: "Pick a project" },
			hint: { it: "Tocca un pianeta per vedere cosa fa.", en: "Tap a planet to see what it does." },
			layers: { it: "Livelli", en: "Layers" },
			canvas: { it: "Schema animato: un progetto al centro e le tecnologie che usa in orbita, con bit e qubit che viaggiano tra l'una e l'altra.", en: "Animated diagram: a project in the middle with the technologies it uses in orbit, with bits and qubits drifting between them." },
			center: { it: "Centro", en: "Center" },
			used: { it: "Usata in", en: "Used in" },
			missions: { it: "progetti", en: "projects" },
			inThis: { it: "In questo progetto", en: "In this project" },
			open: { it: "Apri la scheda", en: "Open the page" },
		},
		live: {
			eyebrow: { it: "Dal vivo", en: "Live" },
			title: { it: "Cosa sto costruendo adesso", en: "What I'm building right now" },
			text: {
				it: "Questi dati arrivano da GitHub in tempo reale, passando da un Worker Cloudflare che li tiene in cache.",
				en: "This data comes from GitHub in real time, through a Cloudflare Worker that caches it.",
			},
			repos: { it: "repository pubblici", en: "public repositories" },
			followers: { it: "follower", en: "followers" },
			reposAll: { it: "repository (anche privati)", en: "repositories (incl. private)" },
			contrib: { it: "contributi nell'ultimo anno", en: "contributions in the last year" },
			langs: { it: "Linguaggi più usati", en: "Most used languages" },
			recent: { it: "Ultimi aggiornamenti", en: "Latest updates" },
			featured: { it: "Progetti in evidenza", en: "Featured projects" },
			privateRepo: { it: "repository privato", en: "private repository" },
			loading: { it: "Carico da GitHub…", en: "Loading from GitHub…" },
			off: { it: "Dati live non disponibili in questa anteprima: apri il sito pubblicato per vederli.", en: "Live data isn't available in this preview: open the published site to see it." },
			cached: { it: "aggiornato", en: "updated" },
		},
	},

	lab: {
		eyebrow: { it: "Laboratorio", en: "Laboratory" },
		title: { it: "Qui l'AI lavora davvero", en: "Here the AI really works" },
		text: {
			it: "Non è un'immagine: le risposte sono generate al momento da Cloudflare Workers AI, partendo da quello che so su Salvatore. Se il servizio non è raggiungibile, FR7 Bot risponde con le informazioni salvate nel sito.",
			en: "It's not a picture: answers are generated on the spot by Cloudflare Workers AI, grounded in what I know about Salvatore. If the service can't be reached, FR7 Bot answers from the information stored in the site.",
		},
		tabs: [
			{ id: "chat", label: { it: "Chiedi a FR7 Bot", en: "Ask FR7 Bot" } },
			{ id: "plan", label: { it: "Dal problema al piano", en: "From problem to plan" } },
			{ id: "making", label: { it: "Come è fatto", en: "How it's made" } },
		] as { id: "chat" | "plan" | "making"; label: L }[],
		tabsLabel: { it: "Sezioni del laboratorio", en: "Lab sections" },
		chat: {
			hello: {
				it: "Ciao, sono FR7 Bot. Chiedimi di Salvatore: competenze, progetti, come lavora, se è disponibile.",
				en: "Hi, I'm FR7 Bot. Ask me about Salvatore: skills, projects, how he works, whether he's available.",
			},
			placeholder: { it: "Scrivi una domanda…", en: "Write a question…" },
			send: { it: "Invia", en: "Send" },
			stop: { it: "Interrompi", en: "Stop" },
			you: { it: "Tu", en: "You" },
			bot: { it: "FR7 Bot", en: "FR7 Bot" },
			live: { it: "AI in diretta · Cloudflare Workers AI", en: "Live AI · Cloudflare Workers AI" },
			offline: { it: "Risposte dal sito (AI non raggiungibile)", en: "Answers from the site (AI unreachable)" },
			error: { it: "Non riesco a rispondere adesso. Scrivi direttamente a Salvatore dalla pagina Contatti.", en: "I can't answer right now. Write to Salvatore directly from the Contact page." },
			note: {
				it: "Le risposte AI possono sbagliare: per cose importanti scrivi a Salvatore.",
				en: "AI answers can be wrong: for anything important, write to Salvatore.",
			},
			suggestions: [
				{ it: "Cosa sa fare Salvatore?", en: "What can Salvatore do?" },
				{ it: "Che stack usa ogni giorno?", en: "What stack does he use daily?" },
				{ it: "Come lavora con un cliente?", en: "How does he work with a client?" },
				{ it: "È disponibile per nuovi progetti?", en: "Is he available for new projects?" },
				{ it: "Hai esempi di gestionali?", en: "Any management software examples?" },
			] as L[],
		},
		plan: {
			title: { it: "Descrivi il problema, ti propongo un piano", en: "Describe the problem, I'll propose a plan" },
			label: { it: "Qual è il problema da risolvere?", en: "What problem needs solving?" },
			placeholder: {
				it: "Es. Gestisco 6 appartamenti in affitto breve e faccio tutto su fogli Excel: prenotazioni, pulizie, incassi.",
				en: "E.g. I run 6 short-term rentals and handle everything in Excel sheets: bookings, cleaning, payments.",
			},
			go: { it: "Genera il piano", en: "Generate the plan" },
			busy: { it: "Ci penso…", en: "Thinking…" },
			samples: [
				{ it: "Ho un ristorante e voglio un menu digitale con QR", en: "I have a restaurant and want a digital menu with QR" },
				{ it: "Uso 3 programmi che non si parlano tra loro", en: "I use 3 programs that don't talk to each other" },
				{ it: "Ho un vecchio software lento da rifare", en: "I have an old, slow piece of software to rebuild" },
			] as L[],
			steps: { it: "Passi proposti", en: "Proposed steps" },
			stack: { it: "Tecnologie", en: "Technologies" },
			time: { it: "Tempi indicativi", en: "Rough timeline" },
			weeks: { it: "settimane", en: "weeks" },
			risks: { it: "Da chiarire insieme", en: "To clarify together" },
			disclaimer: {
				it: "Bozza generata in automatico: è indicativa e non è un preventivo. Salvatore la rivede con te.",
				en: "Automatically generated draft: it's indicative, not a quote. Salvatore reviews it with you.",
			},
			send: { it: "Mandala a Salvatore", en: "Send it to Salvatore" },
			fromAi: { it: "Generato dall'AI", en: "AI-generated" },
			fromRules: { it: "Generato dalle regole del sito", en: "Generated from the site's rules" },
			short: { it: "Scrivi almeno una frase.", en: "Write at least one sentence." },
		},
		making: {
			title: { it: "Come è fatto questo sito", en: "How this site is made" },
			text: {
				it: "Non è un modello: è un'app vera, divisa tra il browser e la rete di Cloudflare. Ho usato Claude come copilota per scrivere e rifinire il codice; le scelte (cosa costruire, come, con quali compromessi) e la verifica sono mie.",
				en: "It's not a template: it's a real app, split between the browser and Cloudflare's network. I used Claude as a copilot to write and polish the code; the choices (what to build, how, with which trade-offs) and the review are mine.",
			},
			layers: [
				{
					tag: "Browser",
					title: { it: "Interfaccia", en: "Interface" },
					text: {
						it: "React 19 + TypeScript, router scritto a mano con View Transitions, CSS fatto a mano. Il vetro liquido piega davvero lo sfondo con filtri SVG; il robot è disegnato in WebGL con uno shader.",
						en: "React 19 + TypeScript, a hand-written router with View Transitions, hand-made CSS. The liquid glass really bends the backdrop with SVG filters; the robot is drawn in WebGL with a shader.",
					},
				},
				{
					tag: "Edge",
					title: { it: "Worker Cloudflare", en: "Cloudflare Worker" },
					text: {
						it: "Un solo Worker risponde a /api/*: chat in streaming, piani, dati GitHub in cache, richieste dal modulo. Tutto il resto è servito come file statici dalla rete Cloudflare.",
						en: "A single Worker answers /api/*: streaming chat, plans, cached GitHub data, form requests. Everything else is served as static files from Cloudflare's network.",
					},
				},
				{
					tag: "AI",
					title: { it: "Workers AI", en: "Workers AI" },
					text: {
						it: "Un modello Llama risponde con il contesto del portfolio. Le uscite del piano sono validate, e se l'AI non risponde il sito ricade sulle regole locali: non resta mai vuoto.",
						en: "A Llama model answers with the portfolio's context. Plan outputs are validated, and if the AI is silent the site falls back to local rules: it never goes blank.",
					},
				},
				{
					tag: "Dati",
					title: { it: "Database D1", en: "D1 database" },
					text: {
						it: "Visite anonime (solo un hash del giorno, mai l'IP), \"mi piace\" ai progetti e richieste ricevute. Se il database non c'è, queste parti spariscono con garbo.",
						en: "Anonymous visits (only a daily hash, never the IP), project likes and incoming requests. If the database is missing, these parts bow out gracefully.",
					},
				},
			] as { tag: string; title: L; text: L }[],
			principles: {
				title: { it: "Cosa guardo quando costruisco", en: "What I look at when I build" },
				items: [
					{ it: "Funziona anche quando un pezzo manca (degradazione graziosa)", en: "It works even when a piece is missing (graceful degradation)" },
					{ it: "Accessibile: tastiera, lettori di schermo, movimento ridotto", en: "Accessible: keyboard, screen readers, reduced motion" },
					{ it: "Veloce: nessuna libreria pesante, effetti attivi solo quando visibili", en: "Fast: no heavy libraries, effects only run when visible" },
					{ it: "Privacy: niente tracker di terzi, nessun cookie", en: "Privacy: no third-party trackers, no cookies" },
				] as L[],
			},
			limit: {
				it: "Onestà: la rifrazione vera del vetro funziona nei browser Chromium (Chrome, Edge, Brave). Su iPhone e Safari il vetro resta sfocato e luminoso, senza la piegatura dei bordi.",
				en: "Honesty note: true glass refraction works in Chromium browsers (Chrome, Edge, Brave). On iPhone and Safari the glass stays blurred and glowing, without bent edges.",
			},
		},
	},

	project: {
		back: { it: "Tutti i progetti", en: "All projects" },
		prev: { it: "Missione precedente", en: "Previous quest" },
		next: { it: "Missione successiva", en: "Next quest" },
		like: { it: "Mi piace", en: "Like" },
		liked: { it: "Ti è piaciuto", en: "You liked it" },
		notFound: { it: "Questo progetto non esiste.", en: "This project doesn't exist." },
		similar: { it: "Ti serve qualcosa di simile?", en: "Need something similar?" },
		ask: { it: "Parliamone", en: "Let's talk" },
	},

	contact: {
		direct: { it: "Invia direttamente", en: "Send directly" },
		sending: { it: "Invio…", en: "Sending…" },
		sent: { it: "Ricevuto! Ti rispondo di persona appena posso.", en: "Received! I'll answer you personally as soon as I can." },
		fail: { it: "Invio non riuscito: usa email o WhatsApp qui sotto.", en: "Couldn't send: use email or WhatsApp below." },
		needReach: { it: "Aggiungi un'email o un telefono per farmi rispondere.", en: "Add an email or phone so I can reply." },
		needMsg: { it: "Scrivi due righe su cosa ti serve.", en: "Write a couple of lines about what you need." },
		alt: { it: "oppure", en: "or" },
	},

	counter: {
		visits: { it: "visite", en: "visits" },
		today: { it: "oggi", en: "today" },
	},

	admin: {
		title: { it: "Pannello", en: "Dashboard" },
		sub: { it: "Richieste, stato del sistema e repository", en: "Requests, system status and repositories" },
		loginTitle: { it: "Accesso riservato", en: "Private access" },
		loginText: { it: "Incolla la chiave ADMIN_TOKEN. Dopo l'accesso resti collegato per 7 giorni su questo dispositivo.", en: "Paste the ADMIN_TOKEN key. After signing in you stay connected for 7 days on this device." },
		token: { it: "Chiave amministratore", en: "Admin key" },
		load: { it: "Accedi", en: "Sign in" },
		logout: { it: "Esci", en: "Sign out" },
		refresh: { it: "Aggiorna", en: "Refresh" },
		checking: { it: "Controllo la sessione…", en: "Checking the session…" },
		bad: { it: "Non riesco a collegarmi al Worker. Riprova tra poco.", en: "I can't reach the Worker. Try again shortly." },
		wrong: { it: "Chiave errata: controlla di aver incollato proprio il valore di ADMIN_TOKEN.", en: "Wrong key: check you pasted the exact ADMIN_TOKEN value." },
		noToken: { it: "ADMIN_TOKEN non è impostato su questo Worker (Settings → Variables and Secrets, tipo Secret), poi ridistribuisci.", en: "ADMIN_TOKEN isn't set on this Worker (Settings → Variables and Secrets, type Secret), then redeploy." },
		noDb: { it: "Il database D1 non è collegato al Worker.", en: "The D1 database isn't bound to the Worker." },
		limited: { it: "Troppi tentativi: aspetta un minuto.", en: "Too many attempts: wait a minute." },
		statusTitle: { it: "Stato e avvisi", en: "Status & alerts" },
		allGood: { it: "Tutto in ordine", en: "All good" },
		someAlerts: { it: "avvisi da guardare", en: "alerts to look at" },
		ok: { it: "Attivo", en: "Active" },
		warn: { it: "Da sistemare", en: "Needs attention" },
		opt: { it: "Facoltativo", en: "Optional" },
		sDb: { it: "Database D1", en: "D1 database" },
		sDbOk: { it: "Richieste e contatori vengono salvati.", en: "Requests and counters are being saved." },
		sDbNo: { it: "Non collegato: il modulo contatti non salva e i contatori restano spenti. Aggiungi il binding DB al Worker.", en: "Not bound: the contact form can't save and counters stay off. Add the DB binding to the Worker." },
		sAi: { it: "Workers AI", en: "Workers AI" },
		sAiOk: { it: "La chat e il planner usano l'AI in diretta.", en: "Chat and planner use live AI." },
		sAiNo: { it: "Non collegato: il sito risponde con testi locali. Aggiungi il binding AI.", en: "Not bound: the site answers with local texts. Add the AI binding." },
		sGh: { it: "Token GitHub", en: "GitHub token" },
		sGhOk: { it: "Pagina Stack con repo privati (solo numeri) e lista completa qui sotto.", en: "Stack page counts private repos (numbers only) and the full list is below." },
		sGhNo: { it: "Assente: nella pagina Stack ci sono solo i repo pubblici e qui non vedi i privati. Aggiungi il secret GITHUB_TOKEN al Worker.", en: "Missing: the Stack page shows public repos only and you can't see private ones here. Add the GITHUB_TOKEN secret to the Worker." },
		sHook: { it: "Notifica sulle richieste", en: "Request alerts" },
		sHookOk: { it: "Ogni richiesta arriva anche sul tuo webhook.", en: "Every request also reaches your webhook." },
		sHookNo: { it: "Nessun webhook: le richieste si leggono solo da questo pannello. Imposta NOTIFY_WEBHOOK (Slack o Discord) per riceverle subito.", en: "No webhook: requests are only readable here. Set NOTIFY_WEBHOOK (Slack or Discord) to get them instantly." },
		briefsTitle: { it: "Richieste ricevute", en: "Received requests" },
		emptyTitle: { it: "Ancora nessuna richiesta", en: "No requests yet" },
		empty: { it: "Quando qualcuno scrive dal modulo Contatti, la richiesta compare qui.", en: "When someone writes from the Contact form, the request shows up here." },
		reposTitle: { it: "Repository GitHub", en: "GitHub repositories" },
		reposSub: { it: "Privati, pubblici e di collaborazione", en: "Private, public and collaborations" },
		noGh: { it: "Aggiungi GITHUB_TOKEN per vedere qui anche i repository privati.", en: "Add GITHUB_TOKEN to list private repositories here too." },
		priv: { it: "privato", en: "private" },
		pub: { it: "pubblico", en: "public" },
		collab: { it: "collaborazione", en: "collaboration" },
		mine: { it: "tuo", en: "yours" },
		featTitle: { it: "In evidenza sul sito", en: "Featured on the site" },
		featText: { it: "Scegli quali repository mostrare nella pagina Stack, al posto degli ultimi aggiornamenti. Per quelli privati il link non compare mai.", en: "Pick which repositories to show on the Stack page instead of the latest updates. Private ones never get a link." },
		featNone: { it: "Nessuno scelto: il sito mostra gli ultimi repository pubblici.", en: "None picked: the site shows the latest public repositories." },
		add: { it: "Mostra", en: "Show" },
		remove: { it: "Togli", en: "Remove" },
		up: { it: "Su", en: "Up" },
		down: { it: "Giù", en: "Down" },
		publicName: { it: "Nome pubblico (facoltativo)", en: "Public name (optional)" },
		publicBlurb: { it: "Descrizione breve (facoltativa)", en: "Short description (optional)" },
		privWarn: { it: "Privato: scrivi un nome pubblico se il nome vero è riservato.", en: "Private: write a public name if the real one is confidential." },
		save: { it: "Pubblica sul sito", en: "Publish to the site" },
		saved: { it: "Pubblicato: la pagina Stack è già aggiornata.", en: "Published: the Stack page is already updated." },
		saveFail: { it: "Non sono riuscito a salvare. Riprova.", en: "Couldn't save. Try again." },
		max: { it: "Massimo 8 repository.", en: "Up to 8 repositories." },
		allRepos: { it: "Tutti i repository", en: "All repositories" },
	},

	notFound: {
		title: { it: "Qui non c'è niente", en: "Nothing here" },
		text: { it: "Questa pagina non esiste. Torna alla home.", en: "This page doesn't exist. Head back home." },
	},

	guide: {
		lab: [
			{
				it: "Qui l'AI lavora davvero: chiedimi qualcosa su Salvatore, oppure descrivi un problema e te lo trasformo in un piano.",
				en: "The AI really works here: ask me about Salvatore, or describe a problem and I'll turn it into a plan.",
			},
			{
				it: "Se vuoi sapere come è fatto il sito, guarda la scheda \"Come è fatto\".",
				en: "Curious how the site is made? Check the \"How it's made\" tab.",
			},
		],
		stack: [
			{
				it: "Più giù trovi l'inventario e cosa fa davvero Salvatore su GitHub, dal vivo.",
				en: "Further down you'll find the inventory and what Salvatore really does on GitHub, live.",
			},
		],
		progetto: [
			{
				it: "Ogni missione ha la sua pagina. Se ti serve qualcosa di simile, tocca \"Parliamone\".",
				en: "Every quest has its own page. If you need something similar, tap \"Let's talk\".",
			},
		],
	} as Record<string, L[]>,
};
