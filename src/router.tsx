import { useEffect, useRef, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./prefs";

/**
 * Router minimo scritto a mano (History API): niente dipendenze, transizioni di pagina con View Transitions
 * dove il browser le supporta. Ogni percorso è servito dal Worker come SPA, quindi i link diretti funzionano.
 */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const read = () => clean(window.location.pathname);

/** Torna in cima subito (niente scroll animato: su iPhone si interrompeva a metà quando la pagina cambia). */
const toTop = () => {
	const jump = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
	jump();
	requestAnimationFrame(() => {
		jump();
		setTimeout(jump, 120);
	});
};

if (typeof window !== "undefined") {
	try {
		history.scrollRestoration = "manual";
	} catch {
		/* ignora */
	}
	window.addEventListener("popstate", () => {
		notify();
		toTop();
	});
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
	const target = clean(to.split("?")[0].split("#")[0]);
	if (target === read()) {
		window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
		return;
	}
	const go = () => {
		if (opts.replace) history.replaceState(null, "", target);
		else history.pushState(null, "", target);
		notify();
		toTop();
	};
	const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
	if (doc.startViewTransition && !prefersReducedMotion()) doc.startViewTransition(() => flushSync(go));
	else go();
}

export function usePath() {
	return useSyncExternalStore(
		(cb) => {
			listeners.add(cb);
			return () => listeners.delete(cb);
		},
		read,
		() => "/",
	);
}

export function Link({ to, onClick, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
	const handle = (e: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(e);
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
		e.preventDefault();
		navigate(to);
	};
	return (
		<a href={to} onClick={handle} {...rest}>
			{children}
		</a>
	);
}

/** Dopo ogni cambio pagina sposta il focus sul contenuto, così lettori di schermo e tastiera ripartono dall'alto. */
export function useRouteFocus(path: string) {
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		const main = document.getElementById("main");
		main?.focus({ preventScroll: true });
	}, [path]);
}

export type RouteName = "home" | "progetti" | "progetto" | "stack" | "lab" | "chi-sono" | "contatti" | "admin" | "404";

export function match(path: string): { name: RouteName; id?: string } {
	if (path === "/") return { name: "home" };
	if (path === "/progetti") return { name: "progetti" };
	const pm = path.match(/^\/progetti\/([a-z0-9-]+)$/);
	if (pm) return { name: "progetto", id: pm[1] };
	if (path === "/stack") return { name: "stack" };
	if (path === "/lab") return { name: "lab" };
	if (path === "/chi-sono") return { name: "chi-sono" };
	if (path === "/contatti") return { name: "contatti" };
	if (path === "/admin") return { name: "admin" };
	return { name: "404" };
}
