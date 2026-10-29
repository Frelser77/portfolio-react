import { useCallback, useLayoutEffect, useRef } from "react";
import { FiFolder, FiHome, FiLayers, FiMail, FiUser } from "react-icons/fi";
import { Link, navigate, usePath } from "../router";
import { prefersReducedMotion, usePrefs } from "../prefs";
import { ui2 } from "../content/ui2";
import { isOn, routes } from "./Nav";

// "Lab AI" sta in alto, accanto al trofeo: sul telefono la barra in basso ha cinque schede
const tabs = routes.filter((r) => r.to !== "/lab");
const iconOf: Record<string, typeof FiHome> = { "/": FiHome, "/progetti": FiFolder, "/stack": FiLayers, "/chi-sono": FiUser, "/contatti": FiMail };

/**
 * Barra di navigazione in basso, solo su telefono, come la tab bar di iOS:
 * la scheda attuale ha una lente tonda; tenendo premuto e trascinando la lente segue il dito, ingrandisce
 * ciò che attraversa e solo al rilascio apre la pagina su cui si trova. Un semplice tocco funziona come sempre.
 */
export default function Dock() {
	const { t } = usePrefs();
	const path = usePath();
	const nav = useRef<HTMLElement>(null);
	const list = () => Array.from(nav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
	const st = useRef({ id: -1, sx: 0, drag: false, idx: -1, justDragged: false });

	const activeIndex = tabs.findIndex((r) => isOn(path, r.to));

	/** Mette la lente sopra la scheda `i` (centro in px dal bordo sinistro della barra). */
	const place = useCallback((cx: number) => {
		const el = nav.current;
		const first = list()[0];
		if (!el || !first) return;
		const w = first.offsetWidth;
		el.style.setProperty("--lw", `${w}px`);
		el.style.setProperty("--lx", `${cx - w / 2}px`);
	}, []);
	const centerOf = (i: number) => {
		const a = list()[i];
		return a ? a.offsetLeft + a.offsetWidth / 2 : 0;
	};

	const rest = useCallback(() => {
		const el = nav.current;
		if (!el) return;
		list().forEach((a) => {
			a?.style.removeProperty("--s");
			a?.classList.remove("hot");
		});
		el.classList.remove("dragging");
		place(centerOf(activeIndex < 0 ? 0 : activeIndex));
		el.classList.toggle("none", activeIndex < 0);
	}, [activeIndex, place]);

	useLayoutEffect(() => {
		rest();
		const on = () => rest();
		window.addEventListener("resize", on);
		return () => window.removeEventListener("resize", on);
	}, [rest]);

	const magnify = (cx: number) => {
		const calm = prefersReducedMotion();
		let best = 0;
		let bd = Infinity;
		list().forEach((a, i) => {
			if (!a) return;
			const d = Math.abs(centerOf(i) - cx);
			if (d < bd) {
				bd = d;
				best = i;
			}
			const k = Math.max(0, 1 - d / (a.offsetWidth * 1.15));
			a.style.setProperty("--s", calm ? "1" : (1 + 0.28 * k * k).toFixed(3));
		});
		list().forEach((a, i) => a?.classList.toggle("hot", i === best));
		return best;
	};

	const onDown = (e: React.PointerEvent) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		st.current = { ...st.current, id: e.pointerId, sx: e.clientX, drag: false, idx: -1 };
	};
	const onMove = (e: React.PointerEvent) => {
		const s = st.current;
		const el = nav.current;
		if (!el || s.id !== e.pointerId) return;
		if (!s.drag) {
			if (Math.abs(e.clientX - s.sx) < 8) return;
			s.drag = true;
			el.classList.add("dragging");
			el.classList.remove("none");
			try {
				el.setPointerCapture(e.pointerId);
			} catch {
				/* funziona lo stesso */
			}
		}
		const r = el.getBoundingClientRect();
		const w = list()[0]?.offsetWidth ?? 0;
		const cx = Math.min(Math.max(e.clientX - r.left, centerOf(0) - w * 0.15), centerOf(tabs.length - 1) + w * 0.15);
		place(cx);
		const idx = magnify(cx);
		if (idx !== s.idx) {
			s.idx = idx;
			try {
				navigator.vibrate?.(6);
			} catch {
				/* non supportato */
			}
		}
	};
	const onUp = (e: React.PointerEvent) => {
		const s = st.current;
		const el = nav.current;
		if (s.id !== e.pointerId) return;
		s.id = -1;
		if (!s.drag || !el) return;
		s.drag = false;
		s.justDragged = true;
		window.setTimeout(() => (s.justDragged = false), 120);
		try {
			el.releasePointerCapture(e.pointerId);
		} catch {
			/* già rilasciato */
		}
		const idx = s.idx < 0 ? activeIndex : s.idx;
		// la lente si posa sulla scheda scelta, poi si apre la pagina (se è diversa da quella attuale)
		list().forEach((a) => {
			a?.style.removeProperty("--s");
			a?.classList.remove("hot");
		});
		el.classList.remove("dragging");
		place(centerOf(idx));
		if (idx !== activeIndex && tabs[idx]) navigate(tabs[idx].to);
	};
	const onCancel = (e: React.PointerEvent) => {
		if (st.current.id !== e.pointerId) return;
		st.current.id = -1;
		st.current.drag = false;
		rest();
	};

	return (
		<nav
			ref={nav}
			className="dock glass"
			aria-label={t(ui2.nav.dock)}
			data-lg="off"
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onUp}
			onPointerCancel={onCancel}
		>
			<span className="dock__lens" aria-hidden="true" />
			{tabs.map((r, i) => {
				const Icon = iconOf[r.to];
				const on = i === activeIndex;
				return (
					<Link
						key={r.to}
						to={r.to}
						className={on ? "on" : undefined}
						aria-current={on ? "page" : undefined}
						onClick={(e) => {
							if (st.current.justDragged) {
								e.preventDefault();
								return;
							}
							try {
								navigator.vibrate?.(8);
							} catch {
								/* non supportato */
							}
						}}
						data-i={i}
					>
						<Icon aria-hidden="true" />
						<span>{t(r.label)}</span>
					</Link>
				);
			})}
		</nav>
	);
}
