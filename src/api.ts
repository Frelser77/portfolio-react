import type { BriefInput, Lang, Plan } from "./shared";
import { validatePlan } from "./shared";

/**
 * Collegamento con il Worker (/api/*). Ogni chiamata restituisce null se il Worker non c'è o non risponde
 * (anteprima statica, rete assente, AI esaurita): il sito sa sempre cosa fare in quel caso.
 */

const isJson = (r: Response) => r.ok && (r.headers.get("content-type") ?? "").includes("application/json");

async function json<T>(url: string, init?: RequestInit, ms = 12000): Promise<T | null> {
	const ctl = new AbortController();
	const timer = setTimeout(() => ctl.abort(), ms);
	try {
		const r = await fetch(url, { ...init, signal: ctl.signal });
		if (!isJson(r)) return null;
		return (await r.json()) as T;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

export interface Stats {
	visits: number;
	today: number;
	likes: Record<string, number>;
	liked: string[];
}
export const getStats = () => json<Stats & { db: boolean }>("/api/stats").then((s) => (s && s.db ? s : null));

export interface GithubData {
	repos: number;
	followers: number;
	languages: { name: string; count: number }[];
	/** true se `count` è già una percentuale (dati con token: includono i repository privati, solo come aggregato) */
	percent?: boolean;
	privateRepos?: number;
	contributions?: number;
	calendar?: number[][];
	/** repository scelti dal pannello admin: se ci sono, sostituiscono "ultimi aggiornamenti" */
	featured?: { name: string; blurb: string; language: string; pushedAt: string; url: string; private: boolean }[];
	recent: { name: string; description: string; language: string; pushedAt: string; url: string; stars: number }[];
	fetchedAt: string;
}
export interface AdminRepo { name: string; private: boolean; fork: boolean; archived: boolean; mine: boolean; language: string; pushedAt: string; url: string; permission: string }
export const getGithub = () => json<GithubData>("/api/github");

export const likeProject = (id: string) => json<{ likes: number; liked: boolean }>("/api/likes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });

export const sendBrief = async (b: BriefInput & { website?: string }) => {
	const r = await json<{ ok: boolean }>("/api/brief", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
	return !!r?.ok;
};

export async function planWithAi(problem: string, lang: Lang): Promise<Plan | null> {
	const r = await json<{ plan: unknown }>("/api/plan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ problem, lang }) }, 30000);
	return r ? validatePlan(r.plan) : null;
}

/** Chat in streaming (SSE). Restituisce false se l'AI non è disponibile, così la pagina passa alle risposte locali. */
export async function streamChat(messages: { role: "user" | "assistant"; content: string }[], lang: Lang, onToken: (t: string) => void, signal: AbortSignal): Promise<boolean> {
	let r: Response;
	try {
		r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages, lang }), signal });
	} catch (e) {
		if ((e as Error).name === "AbortError") return true;
		return false;
	}
	if (!r.ok || !r.body || !(r.headers.get("content-type") ?? "").includes("text/event-stream")) return false;
	const reader = r.body.getReader();
	const dec = new TextDecoder();
	let buf = "";
	let got = false;
	try {
		for (;;) {
			const { value, done } = await reader.read();
			if (done) break;
			buf += dec.decode(value, { stream: true });
			let i: number;
			while ((i = buf.indexOf("\n")) >= 0) {
				const line = buf.slice(0, i).trim();
				buf = buf.slice(i + 1);
				if (!line.startsWith("data:")) continue;
				const data = line.slice(5).trim();
				if (data === "[DONE]") return got;
				try {
					const j = JSON.parse(data) as { response?: string; choices?: { delta?: { content?: string } }[] };
					const tok = j.response ?? j.choices?.[0]?.delta?.content ?? "";
					if (tok) {
						got = true;
						onToken(tok);
					}
				} catch {
					/* riga incompleta o non JSON: la ignoro */
				}
			}
		}
	} catch (e) {
		if ((e as Error).name === "AbortError") return true;
	}
	return got;
}

export interface Health {
	ai: boolean;
	db: boolean;
	brief: boolean;
}
let healthP: Promise<Health | null> | null = null;
export const getHealth = () => (healthP ??= json<Health>("/api/health", undefined, 6000));

/** Conta la visita (una per sessione del browser). Il Worker non salva l'IP, solo un hash del giorno. */
export async function recordVisit() {
	try {
		if (sessionStorage.getItem("visited")) return;
		sessionStorage.setItem("visited", "1");
	} catch {
		/* senza sessionStorage conta a ogni caricamento: va bene */
	}
	await json("/api/visit", { method: "POST" }, 5000);
}
