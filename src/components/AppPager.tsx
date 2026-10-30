import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefs } from "../prefs";

const Q = "(max-width: 720px)";
export function usePhone() {
	const [m, setM] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(Q).matches);
	useEffect(() => {
		const mq = window.matchMedia(Q);
		const on = () => setM(mq.matches);
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	return m;
}

export type PagerPane = { id: string; label: string; node: ReactNode };

/** Su telefono: pagine laterali a tutto schermo con barra di sezioni; la pagina non scorre in verticale. */
export default function AppPager({ panes, title }: { panes: PagerPane[]; title?: ReactNode }) {
	const { t } = usePrefs();
	const ref = useRef<HTMLDivElement>(null);
	const [i, setI] = useState(0);
	useEffect(() => {
		document.documentElement.classList.add("home-app");
		return () => document.documentElement.classList.remove("home-app");
	}, []);
	const go = (k: number) => ref.current?.scrollTo({ left: k * ref.current.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
	return (
		<div className="happ">
			{title}
			{panes.length > 1 && (
				<div className="htabs" role="tablist" aria-label={t({ it: "Sezioni", en: "Sections" })}>
					{panes.map((p, k) => (
						<button key={p.id} type="button" role="tab" aria-selected={i === k} className={i === k ? "on" : ""} onClick={() => go(k)}>
							{p.label}
						</button>
					))}
				</div>
			)}
			<div className="hpager" ref={ref} onScroll={() => ref.current && setI(Math.round(ref.current.scrollLeft / Math.max(1, ref.current.clientWidth)))}>
				{panes.map((p) => (
					<div key={p.id} data-pane={p.id}>
						{p.node}
					</div>
				))}
			</div>
		</div>
	);
}
