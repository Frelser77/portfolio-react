import { useSyncExternalStore } from "react";

export type AchId = "lens" | "need" | "party" | "bag" | "quest" | "end" | "send";
export const ALL: AchId[] = ["lens", "need", "party", "bag", "quest", "end", "send"];

const KEY = "achievements";
const load = (): Set<AchId> => {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as AchId[];
		return new Set(raw.filter((id) => ALL.includes(id)));
	} catch {
		return new Set();
	}
};
let got = load();
let snapshot = [...got].sort().join(",");

const listeners = new Set<() => void>();

export function unlock(id: AchId) {
	if (got.has(id)) return;
	got = new Set(got).add(id);
	snapshot = [...got].sort().join(",");
	try {
		localStorage.setItem(KEY, JSON.stringify([...got]));
	} catch {
		/* senza storage gli obiettivi valgono solo per questa visita */
	}
	listeners.forEach((l) => l());
	window.dispatchEvent(new CustomEvent("ach:unlock", { detail: id }));
}

export const hasAch = (id: AchId) => got.has(id);

/** Elenco degli obiettivi sbloccati, aggiornato in tempo reale. */
export function useAchievements(): Set<AchId> {
	useSyncExternalStore(
		(cb) => {
			listeners.add(cb);
			return () => listeners.delete(cb);
		},
		() => snapshot,
		() => "",
	);
	return got;
}
