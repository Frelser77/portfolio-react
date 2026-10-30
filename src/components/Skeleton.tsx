import type { CSSProperties } from "react";

/** Mattoncini di caricamento: stesso vetro e stesse proporzioni dei contenuti veri, così la pagina non salta quando arrivano i dati. */
export function Sk({ w = "100%", h = 14, r = 8, className = "", style }: { w?: number | string; h?: number | string; r?: number | string; className?: string; style?: CSSProperties }) {
	return <i className={`sk ${className}`} style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden="true" />;
}

/** Scheda di vetro con un titolo e qualche riga. */
export function SkCard({ lines = 3, title = true, className = "", children }: { lines?: number; title?: boolean; className?: string; children?: React.ReactNode }) {
	return (
		<div className={`glass sk-card ${className}`} data-lg="off" aria-hidden="true">
			{title && <Sk w="46%" h={22} r={10} />}
			{[...Array(lines)].map((_, i) => (
				<Sk key={i} w={i === lines - 1 ? "62%" : "100%"} h={13} />
			))}
			{children}
		</div>
	);
}

/** Righe alte come le voci di un elenco (richieste, repository, interruttori). */
export function SkRows({ n = 4, h = 64, gap = 10 }: { n?: number; h?: number; gap?: number }) {
	return (
		<div className="sk-rows" style={{ gap }} aria-hidden="true">
			{[...Array(n)].map((_, i) => (
				<Sk key={i} h={h} r={18} style={{ animationDelay: `${i * 90}ms` }} />
			))}
		</div>
	);
}
