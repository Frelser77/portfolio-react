import { useEffect, useState } from "react";

/** Chi sta guardando il sito: chi cerca uno sviluppatore (recruiter, azienda) o chi ha un progetto. */
export type Audience = "job" | "proj";
const KEY = "fr7-aud";
const EV = "fr7:aud";

function read(): Audience {
	try {
		const v = localStorage.getItem(KEY);
		return v === "proj" ? "proj" : "job";
	} catch {
		return "job";
	}
}

export function setAudience(a: Audience) {
	try {
		localStorage.setItem(KEY, a);
	} catch {
		/* senza storage vale solo per questa pagina */
	}
	window.dispatchEvent(new CustomEvent(EV, { detail: a }));
}

export function useAudience(): Audience {
	const [a, setA] = useState<Audience>(read);
	useEffect(() => {
		const on = (e: Event) => setA((e as CustomEvent<Audience>).detail);
		window.addEventListener(EV, on);
		return () => window.removeEventListener(EV, on);
	}, []);
	return a;
}
