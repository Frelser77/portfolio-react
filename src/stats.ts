import { useEffect, useState } from "react";
import { getStats, recordVisit, type Stats } from "./api";

/** Statistiche anonime (visite, mi piace) dal Worker + D1. Una sola richiesta per visita; null se non disponibili. */
let cache: Promise<(Stats & { db: boolean }) | null> | null = null;
const load = () => (cache ??= recordVisit().then(getStats));

export function useStats() {
	const [s, setS] = useState<Stats | null>(null);
	useEffect(() => {
		let alive = true;
		load().then((r) => alive && setS(r));
		return () => {
			alive = false;
		};
	}, []);
	return s;
}

export const resetStats = () => {
	cache = null;
};
