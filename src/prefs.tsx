import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { L, Lang } from "./content/data";

interface Prefs {
	lang: Lang;
	toggleLang: () => void;
	t: (text: L) => string;
}

const PrefsContext = createContext<Prefs | null>(null);

const read = (key: string) => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};
const write = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		/* storage non disponibile: la preferenza vale solo per questa visita */
	}
};

const initialLang = (): Lang => {
	const fromUrl = new URLSearchParams(window.location.search).get("lang");
	if (fromUrl === "it" || fromUrl === "en") return fromUrl;
	const saved = read("lang");
	if (saved === "it" || saved === "en") return saved;
	return navigator.language?.toLowerCase().startsWith("it") ? "it" : "en";
};

export function PrefsProvider({ children }: { children: ReactNode }) {
	const [lang, setLang] = useState<Lang>(initialLang);

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	const toggleLang = useCallback(() => {
		setLang((l) => {
			const next = l === "it" ? "en" : "it";
			write("lang", next);
			return next;
		});
	}, []);

	const value = useMemo<Prefs>(() => ({ lang, toggleLang, t: (text: L) => text[lang] }), [lang, toggleLang]);

	return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
	const ctx = useContext(PrefsContext);
	if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
	return ctx;
}

/** Vero se l'utente ha chiesto di ridurre le animazioni. */
export const prefersReducedMotion = () =>
	typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
