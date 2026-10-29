import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { L, Lang } from "./content/data";

type Theme = "light" | "dark";

interface Prefs {
	lang: Lang;
	toggleLang: () => void;
	theme: Theme;
	toggleTheme: () => void;
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

const initialTheme = (): Theme =>
	document.documentElement.dataset.theme === "dark" ? "dark" : "light";

export function PrefsProvider({ children }: { children: ReactNode }) {
	const [lang, setLang] = useState<Lang>(initialLang);
	const [theme, setTheme] = useState<Theme>(initialTheme);

	useEffect(() => {
		document.documentElement.lang = lang;
		document.title =
			lang === "it"
				? "Salvatore D'Amico, sviluppatore full stack"
				: "Salvatore D'Amico, full stack developer";
	}, [lang]);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute("content", theme === "dark" ? "#0d1724" : "#f3f5f7");
	}, [theme]);

	const toggleLang = useCallback(() => {
		setLang((l) => {
			const next = l === "it" ? "en" : "it";
			write("lang", next);
			return next;
		});
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme((th) => {
			const next = th === "dark" ? "light" : "dark";
			write("theme", next);
			return next;
		});
	}, []);

	const value = useMemo<Prefs>(
		() => ({ lang, toggleLang, theme, toggleTheme, t: (text: L) => text[lang] }),
		[lang, theme, toggleLang, toggleTheme],
	);

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

/** Apre un progetto nella sezione Progetti da qualunque punto della pagina. */
export const openProject = (id: string) =>
	window.dispatchEvent(new CustomEvent<string>("open-project", { detail: id }));
