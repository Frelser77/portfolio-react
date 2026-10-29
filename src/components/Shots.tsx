import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import type { Project } from "../content/data";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";

type Shot = NonNullable<Project["shots"]>[number];

/**
 * Galleria di schermate: una grande alla volta (si scorre con il dito o con le frecce), anteprime sotto,
 * e un tocco apre la schermata a pieno schermo, dove si può anche ingrandirla alla dimensione reale.
 */
export default function Shots({ shots, portrait = false }: { shots: Shot[]; portrait?: boolean }) {
	const { t } = usePrefs();
	const track = useRef<HTMLUListElement>(null);
	const [i, setI] = useState(0);
	const [open, setOpen] = useState(false);
	const [zoom, setZoom] = useState(false);
	const opener = useRef<HTMLElement | null>(null);
	const closeBtn = useRef<HTMLButtonElement>(null);

	const go = useCallback(
		(n: number) => {
			const k = (n + shots.length) % shots.length;
			setI(k);
			setZoom(false);
			const el = track.current;
			if (el) el.scrollTo({ left: k * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
		},
		[shots.length],
	);

	// la barra di scorrimento aggiorna l'indicatore
	const onScroll = () => {
		const el = track.current;
		if (!el) return;
		const k = Math.round(el.scrollLeft / el.clientWidth);
		if (k !== i && k >= 0 && k < shots.length) setI(k);
	};

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
			else if (e.key === "ArrowRight") go(i + 1);
			else if (e.key === "ArrowLeft") go(i - 1);
		};
		document.addEventListener("keydown", onKey);
		document.documentElement.classList.add("noscroll");
		closeBtn.current?.focus();
		return () => {
			document.removeEventListener("keydown", onKey);
			document.documentElement.classList.remove("noscroll");
			opener.current?.focus();
		};
	}, [open, i, go]);

	const cur = shots[i];
	return (
		<div className={`shots${portrait ? " shots--phone" : ""}`} role="group" aria-roledescription="carousel" aria-label={t(ui2.shots.label)}>
			<div className="shots__stage">
				<ul className="shots__track" ref={track} onScroll={onScroll}>
					{shots.map((sh, n) => (
						<li key={sh.src} aria-hidden={portrait ? undefined : n !== i}>
							<button
								type="button"
								className="shots__slide"
								style={{ aspectRatio: `${shots[0].w} / ${shots[0].h}` }}
								onClick={(e) => {
									opener.current = e.currentTarget;
									setI(n);
									setZoom(false);
									setOpen(true);
								}}
								aria-label={`${t(ui2.shots.enlarge)}: ${t(sh.alt)}`}
								tabIndex={portrait || n === i ? 0 : -1}
							>
								<img src={portrait ? (sh.thumb ?? sh.src) : sh.src} width={sh.w} height={sh.h} alt={t(sh.alt)} loading={n === 0 ? "eager" : "lazy"} decoding="async" draggable={false} />
								<span className="shots__zoom" aria-hidden="true">
									<FiMaximize2 />
								</span>
							</button>
						</li>
					))}
				</ul>
				{shots.length > 1 && !portrait && (
					<>
						<button type="button" className="shots__nav prev" onClick={() => go(i - 1)} aria-label={t(ui2.shots.prev)}>
							<FiChevronLeft aria-hidden="true" />
						</button>
						<button type="button" className="shots__nav next" onClick={() => go(i + 1)} aria-label={t(ui2.shots.next)}>
							<FiChevronRight aria-hidden="true" />
						</button>
					</>
				)}
			</div>
			{shots.length > 1 && !portrait && (
				<div className="shots__thumbs" role="tablist" aria-label={t(ui2.shots.label)}>
					{shots.map((sh, n) => (
						<button key={sh.src} type="button" role="tab" aria-selected={n === i} className="shots__thumb" onClick={() => go(n)} aria-label={t(sh.alt)}>
							<img src={sh.src} alt="" width={160} height={Math.round((160 * sh.h) / sh.w)} loading="lazy" decoding="async" />
						</button>
					))}
				</div>
			)}
			<p className="shots__cap" aria-live="polite" hidden={portrait}>
				{t(cur.alt)} <span>· {i + 1}/{shots.length}</span>
			</p>

			{open &&
				createPortal(
				<div className="lbx" role="dialog" aria-modal="true" aria-label={t(cur.alt)} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
					<div className="lbx__bar">
						<span>
							{t(cur.alt)} · {i + 1}/{shots.length}
						</span>
						<button ref={closeBtn} type="button" className="lbx__x" onClick={() => setOpen(false)} aria-label={t(ui2.shots.close)}>
							<FiX aria-hidden="true" />
						</button>
					</div>
					<div className={`lbx__view${zoom ? " zoomed" : ""}`} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
						<img src={cur.src} alt={t(cur.alt)} width={cur.w} height={cur.h} draggable={false} onClick={() => setZoom((z) => !z)} style={zoom ? { width: cur.w } : undefined} />
					</div>
					<div className="lbx__foot">
						{shots.length > 1 && (
							<button type="button" className="btn glass sm" onClick={() => go(i - 1)} aria-label={t(ui2.shots.prev)}>
								<FiChevronLeft aria-hidden="true" />
							</button>
						)}
						<button type="button" className="btn glass sm" onClick={() => setZoom((z) => !z)} aria-pressed={zoom}>
							{zoom ? t(ui2.shots.fit) : t(ui2.shots.real)}
						</button>
						{shots.length > 1 && (
							<button type="button" className="btn glass sm" onClick={() => go(i + 1)} aria-label={t(ui2.shots.next)}>
								<FiChevronRight aria-hidden="true" />
							</button>
						)}
					</div>
				</div>,
				document.body,
			)}
		</div>
	);
}
