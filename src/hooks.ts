import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

/** True se il dispositivo ha un puntatore preciso (mouse o trackpad) che può passare sopra gli elementi. */
const finePointer = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;

/** Sezione attualmente al centro dello schermo; in fondo alla pagina vale l'ultima. */
export function useActiveSection(ids: string[]) {
	const [active, setActive] = useState(ids[0]);
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
			},
			{ rootMargin: "-40% 0px -55% 0px" },
		);
		ids.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		const onScroll = () => {
			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) setActive(ids[ids.length - 1]);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", onScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return active;
}

/**
 * Effetti legati al puntatore e allo scroll, tutti scritti come variabili CSS sulla radice:
 * - --p: avanzamento dello scroll (0-1)
 * - --px / --py: posizione del mouse (-0.5..0.5) per il parallasse dello sfondo
 * - --mx / --my sulle carte di vetro: luce che segue il cursore
 * - --tx / --ty sugli elementi .tilt: inclinazione 3D
 */
export function usePointerFx() {
	useEffect(() => {
		const root = document.documentElement;
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const max = root.scrollHeight - window.innerHeight;
				root.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
				root.style.setProperty("--sy", String(Math.round(window.scrollY)));
			});
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		const calm = prefersReducedMotion();
		const fine = finePointer();
		let move: ((e: PointerEvent) => void) | undefined;
		let leave: ((e: PointerEvent) => void) | undefined;
		if (fine && !calm) {
			let frame = 0;
			move = (e: PointerEvent) => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => {
					root.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
					root.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
					const target = e.target as Element | null;
					const glass = target?.closest<HTMLElement>(".glass");
					if (glass) {
						const r = glass.getBoundingClientRect();
						glass.style.setProperty("--mx", `${e.clientX - r.left}px`);
						glass.style.setProperty("--my", `${e.clientY - r.top}px`);
						const a = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
						glass.style.setProperty("--ang", `${a.toFixed(0)}deg`);
					}
					const mag = target?.closest<HTMLElement>(".mag");
					if (mag) {
						const r = mag.getBoundingClientRect();
						mag.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 12}px, ${((e.clientY - r.top) / r.height - 0.5) * 10}px)`;
					}
					const tilt = target?.closest<HTMLElement>(".tilt");
					if (tilt) {
						const r = tilt.getBoundingClientRect();
						const x = (e.clientX - r.left) / r.width - 0.5;
						const y = (e.clientY - r.top) / r.height - 0.5;
						tilt.style.setProperty("--ty", `${(x * 12).toFixed(2)}deg`);
						tilt.style.setProperty("--tx", `${(-y * 12).toFixed(2)}deg`);
					}
				});
			};
			leave = (e: PointerEvent) => {
				const mg = (e.target as Element | null)?.closest<HTMLElement>(".mag");
				if (mg && !mg.contains(e.relatedTarget as Node | null)) mg.style.transform = "";
				const tilt = (e.target as Element | null)?.closest<HTMLElement>(".tilt");
				if (tilt && !tilt.contains(e.relatedTarget as Node | null)) {
					tilt.style.setProperty("--tx", "0deg");
					tilt.style.setProperty("--ty", "0deg");
				}
			};
			window.addEventListener("pointermove", move, { passive: true });
			document.addEventListener("pointerout", leave);
		}
		// Telefono e tablet: niente cursore, quindi il dito accende la luce sul vetro e l'inclinazione del telefono muove lo sfondo
		let touch: ((e: PointerEvent) => void) | undefined;
		let tilt: ((e: DeviceOrientationEvent) => void) | undefined;
		if (!fine && !calm) {
			touch = (e: PointerEvent) => {
				root.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
				root.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
				const glass = (e.target as Element | null)?.closest<HTMLElement>(".glass");
				if (glass) {
					const r = glass.getBoundingClientRect();
					glass.style.setProperty("--mx", `${e.clientX - r.left}px`);
					glass.style.setProperty("--my", `${e.clientY - r.top}px`);
				}
			};
			window.addEventListener("pointerdown", touch, { passive: true });
			const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown } | undefined;
			if (DOE && typeof DOE.requestPermission !== "function") {
				let last = 0;
				tilt = (e: DeviceOrientationEvent) => {
					const now = performance.now();
					if (now - last < 50) return;
					last = now;
					const g = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 40)) / 2;
					const b = Math.max(-1, Math.min(1, ((e.beta ?? 50) - 50) / 40)) / 2;
					root.style.setProperty("--px", g.toFixed(3));
					root.style.setProperty("--py", b.toFixed(3));
				};
				window.addEventListener("deviceorientation", tilt, { passive: true });
			}
		}
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			if (move) window.removeEventListener("pointermove", move);
			if (leave) document.removeEventListener("pointerout", leave);
			if (touch) window.removeEventListener("pointerdown", touch);
			if (tilt) window.removeEventListener("deviceorientation", tilt);
		};
	}, []);
}

/** Fa comparire gli elementi con data-rv quando entrano nello schermo. */
export function useReveal(deps: unknown = null) {
	useEffect(() => {
		if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
		const selector = [".hero > *", ".hero__side > *", ".card", ".stat", ".step", ".pc", ".tile", ".cb", ".info li", ".tour"].join(",");
		const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries)
					if (e.isIntersecting) {
						(e.target as HTMLElement).dataset.rv = "in";
						observer.unobserve(e.target);
					}
			},
			{ threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
		);
		items.forEach((el, i) => {
			el.dataset.rv = "out";
			// scaglionamento breve tra fratelli, per un effetto a cascata
			const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : i;
			el.style.setProperty("--rv-d", `${Math.min(index, 8) * 55}ms`);
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, [deps]);
}

/** Conta da 0 a `to` quando l'elemento entra nello schermo. */
export function useCountUp(to: number, duration = 1400) {
	const ref = useRef<HTMLElement>(null);
	const [value, setValue] = useState(prefersReducedMotion() ? to : 0);
	useEffect(() => {
		if (prefersReducedMotion() || !ref.current) {
			setValue(to);
			return;
		}
		let raf = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				const start = performance.now();
				const tick = (now: number) => {
					const k = Math.min(1, (now - start) / duration);
					setValue(Math.round(to * (1 - Math.pow(1 - k, 3))));
					if (k < 1) raf = requestAnimationFrame(tick);
				};
				raf = requestAnimationFrame(tick);
			},
			{ threshold: 0.6 },
		);
		observer.observe(ref.current);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(raf);
		};
	}, [to, duration]);
	return { ref, value };
}
