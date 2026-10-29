/**
 * Cache "mostra subito, controlla dopo": i dati già visti compaiono subito e la rete si usa solo quando serve.
 * - entro `ttl` dall'ultimo controllo non parte nessuna richiesta;
 * - dopo, si chiede al Worker "è cambiato?" con l'ETag: se no, risponde 304 senza dati (e senza chiamare GitHub);
 * - `onData` viene richiamato di nuovo solo se i dati sono davvero diversi.
 * Ritorna true se ha consegnato almeno un dato.
 */
interface Rec<T> {
	t: number;
	etag: string;
	data: T;
}

export async function swr<T>(key: string, url: string, ttl: number, onData: (d: T) => void, valid: (d: unknown) => boolean = () => true): Promise<boolean> {
	let rec: Rec<T> | null = null;
	try {
		const j = JSON.parse(localStorage.getItem(key) ?? "null") as Rec<T> | null;
		if (j && typeof j.t === "number" && valid(j.data)) rec = j;
	} catch {
		/* senza memoria locale si va in rete */
	}
	if (rec) onData(rec.data);
	if (rec && Date.now() - rec.t < ttl) return true;
	const save = (r: Rec<T>) => {
		try {
			localStorage.setItem(key, JSON.stringify(r));
		} catch {
			/* ok */
		}
	};
	try {
		const ctl = new AbortController();
		const timer = setTimeout(() => ctl.abort(), 12000);
		const res = await fetch(url, { headers: rec?.etag ? { "if-none-match": rec.etag } : undefined, signal: ctl.signal });
		clearTimeout(timer);
		if (res.status === 304 && rec) {
			save({ ...rec, t: Date.now() });
			return true;
		}
		if (!res.ok || !(res.headers.get("content-type") ?? "").includes("application/json")) return !!rec;
		const data = (await res.json()) as T;
		if (!valid(data)) return !!rec;
		const etag = res.headers.get("etag") ?? "";
		const changed = !rec || JSON.stringify(stable(rec.data)) !== JSON.stringify(stable(data));
		save({ t: Date.now(), etag, data });
		if (changed) onData(data);
		return true;
	} catch {
		return !!rec;
	}
}

/** Confronto senza l'orario di lettura, che cambia a ogni richiesta ma non è un dato nuovo. */
const stable = (d: unknown) => (d && typeof d === "object" ? { ...(d as Record<string, unknown>), fetchedAt: undefined } : d);
