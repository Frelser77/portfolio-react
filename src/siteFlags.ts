import { useEffect, useState } from "react";
import type { SiteKey } from "./shared";
import { swr } from "./swr";

/** Cosa mostrare o nascondere, scelto dal pannello admin. Per default si vede tutto; l'ultimo stato visto resta in memoria locale. */
const listeners = new Set<(h: string[]) => void>();
let hidden: string[] = [];
let started = false;
const valid = (o: unknown): o is { hidden: string[] } => !!o && Array.isArray((o as { hidden?: unknown }).hidden);

/** Mostra subito l'ultimo stato visto e chiede sempre al Worker se è cambiato (304 se no). */
let busy = false;
const refresh = () => {
	if (busy) return;
	busy = true;
	void swr<{ hidden: string[] }>("fr7-site", "/api/site", 0, (o) => {
		hidden = o.hidden;
		listeners.forEach((l) => l(hidden));
	}, valid).finally(() => {
		busy = false;
	});
};
const start = () => {
	if (started || typeof window === "undefined") return;
	started = true;
	refresh();
	// tornando sulla scheda o sull'app si ricontrolla: una modifica fatta dall'admin altrove si vede subito
	document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && refresh());
	window.addEventListener("focus", refresh);
	window.addEventListener("pageshow", (e) => (e as PageTransitionEvent).persisted && refresh());
};
start();

/** Da usare dopo che l'admin ha cambiato qualcosa: scarta la copia locale e applica subito il nuovo elenco. */
export function applyHidden(next: string[]) {
	hidden = next;
	try {
		// lo stato appena salvato diventa subito la copia locale: chi ha fatto la modifica la vede senza attese
		localStorage.setItem("fr7-site", JSON.stringify({ t: Date.now(), etag: "", data: { hidden: next } }));
	} catch {
		/* ok */
	}
	listeners.forEach((l) => l(hidden));
}

export function useShown(): (k: SiteKey) => boolean {
	const [h, setH] = useState<string[]>(hidden);
	useEffect(() => {
		setH(hidden);
		listeners.add(setH);
		return () => {
			listeners.delete(setH);
		};
	}, []);
	return (k) => !h.includes(k);
}
