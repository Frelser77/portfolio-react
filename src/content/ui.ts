import type { L } from "./data";

/** Testi dell'interfaccia (etichette, pulsanti, titoli di sezione). */
export const ui = {
	skip: { it: "Vai al contenuto", en: "Skip to content" },
	nav: {
		projects: { it: "Progetti", en: "Work" },
		case: { it: "Caso studio", en: "Case study" },
		journey: { it: "Percorso", en: "Journey" },
		contact: { it: "Contatti", en: "Contact" },
		menu: { it: "Menu", en: "Menu" },
		close: { it: "Chiudi", en: "Close" },
	},
	theme: {
		toLight: { it: "Passa al tema chiaro", en: "Switch to light theme" },
		toDark: { it: "Passa al tema scuro", en: "Switch to dark theme" },
	},
	lang: { it: "Read in English", en: "Leggi in italiano" },

	hero: {
		hello: { it: "Salvatore D'Amico, sviluppatore full stack", en: "Salvatore D'Amico, full stack developer" },
		title: { it: "Dal DNS all'ultimo pixel.", en: "From DNS to the last pixel." },
		lead: {
			it: "Progetto interfacce in React, scrivo API in NestJS e .NET, riscrivo software legacy in tecnologie moderne e metto tutto online, dominio ed email compresi. Da tre anni trasformo esigenze reali in software che funziona.",
			en: "I design React interfaces, write APIs in NestJS and .NET, rewrite legacy software on a modern stack and put everything online, domain and email included. For three years I've been turning real needs into software that works.",
		},
		ctaWork: { it: "Guarda i progetti", en: "See the work" },
		ctaContact: { it: "Scrivimi", en: "Get in touch" },
		available: {
			it: "Disponibile per un ruolo full stack: da remoto o in Puglia",
			en: "Open to full stack roles: remote, or on-site in Apulia",
		},
	},

	trace: {
		label: { it: "Una richiesta, dall'indirizzo allo schermo", en: "One request, from address bar to screen" },
		hint: { it: "Tocca un livello per vedere cosa faccio lì.", en: "Tap a layer to see what I do there." },
		tools: { it: "Strumenti", en: "Tools" },
		seenIn: { it: "Dove l'ho fatto", en: "Where I've done it" },
		replay: { it: "Riproduci", en: "Replay" },
	},

	oracle: {
		title: { it: "Riscrivere il legacy", en: "Rewriting legacy code" },
		intro: {
			it: "In Primed Group molti moduli erano ancora in Classic ASP su Oracle 9i: difficili da mantenere e lenti, con processi critici che arrivavano a 20 secondi. Li ho portati su NestJS, un modulo alla volta.",
			en: "At Primed Group many modules still ran on Classic ASP and Oracle 9i: hard to maintain and slow, with critical processes taking up to 20 seconds. I moved them to NestJS, one module at a time.",
		},
		steps: [
			{
				it: "Ho riscritto la logica in NestJS, con DTO, validazione e log tracciabili.",
				en: "I rewrote the logic in NestJS, with DTOs, validation and traceable logs.",
			},
			{
				it: "Ho diviso le query più pesanti in interrogazioni più piccole, con indici dove servivano.",
				en: "I split the heaviest queries into smaller ones, adding indexes where needed.",
			},
			{
				it: "Ho spostato l'elaborazione dei dati nel backend, lasciando al database solo il necessario.",
				en: "I moved data processing into the backend, leaving the database only what it needs to do.",
			},
		] as L[],
		before: { it: "Prima", en: "Before" },
		after: { it: "Dopo", en: "After" },
		run: { it: "Avvia il confronto", en: "Run the comparison" },
		running: { it: "In esecuzione…", en: "Running…" },
		again: { it: "Riavvia", en: "Run again" },
		scale: {
			it: "Tempi in scala 1:5 per non farti aspettare 20 secondi.",
			en: "Timings scaled 1:5 so you don't wait 20 seconds.",
		},
	},

	projects: {
		title: { it: "Progetti", en: "Work" },
		intro: {
			it: "Lavori per clienti, software aziendale e prodotti miei. Alcuni non sono pubblici: per quelli racconto cosa ho fatto.",
			en: "Client work, in-house software and my own products. Some aren't public, so for those I describe what I built.",
		},
		all: { it: "Tutti", en: "All" },
		liveNow: { it: "Online ora", en: "Live now" },
		featured: { it: "Online adesso", en: "Live right now" },
		loadPreview: { it: "Carica l'anteprima live", en: "Load the live preview" },
		previewNote: {
			it: "Il server potrebbe impiegare qualche secondo a rispondere al primo caricamento.",
			en: "The server may take a few seconds to wake up on first load.",
		},
		previewTitle: { it: "Anteprima live del menu di Bite the Trouble", en: "Live preview of the Bite the Trouble menu" },
		openNewTab: { it: "si apre in una nuova scheda", en: "opens in a new tab" },
		empty: { it: "Nessun progetto in questa categoria.", en: "No projects in this category." },
		showAll: { it: "Mostra tutti", en: "Show all" },
		stack: { it: "Tecnologie", en: "Built with" },
		more: { it: "Dettagli", en: "Details" },
	},

	journey: {
		title: { it: "Percorso", en: "Journey" },
		howTitle: { it: "Come lavoro", en: "How I work" },
		certs: { it: "Vedi gli attestati", en: "View certificates" },
		certsTitle: { it: "Attestati Epicode", en: "Epicode certificates" },
		prev: { it: "Precedente", en: "Previous" },
		next: { it: "Successivo", en: "Next" },
		back: { it: "Torna alla griglia", en: "Back to grid" },
	},

	contact: {
		title: { it: "Parliamone", en: "Let's talk" },
		lead: {
			it: "Cerco un ruolo da sviluppatore full stack, da remoto o in Puglia. Se hai un progetto o una posizione aperta, scrivimi e ti rispondo al più presto.",
			en: "I'm looking for a full stack developer role, remote or in Apulia. If you have a project or an open position, write to me and I'll get back to you soon.",
		},
		copy: { it: "Copia indirizzo", en: "Copy address" },
		copied: { it: "Indirizzo copiato", en: "Address copied" },
		copyFail: { it: "Copia non riuscita: seleziona l'indirizzo a mano", en: "Couldn't copy: select the address manually" },
		whatsapp: { it: "Scrivimi su WhatsApp", en: "Message me on WhatsApp" },
		waText: {
			it: "Ciao Salvatore, ti scrivo dal tuo portfolio.",
			en: "Hi Salvatore, I'm writing from your portfolio.",
		},
		cv: { it: "Scarica il CV (PDF)", en: "Download CV (PDF, Italian)" },
		based: { it: "Base a", en: "Based in" },
	},

	footer: {
		made: {
			it: "Progettato e sviluppato da me con React e TypeScript. Nessun cookie, nessun tracciamento.",
			en: "Designed and built by me with React and TypeScript. No cookies, no tracking.",
		},
		top: { it: "Torna su", en: "Back to top" },
	},
};
