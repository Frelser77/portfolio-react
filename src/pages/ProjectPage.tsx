import { useEffect, useRef } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiUsers } from "react-icons/fi";
import { createPortal } from "react-dom";
import { projects, statusLabel } from "../content/data";
import { ui } from "../content/ui";
import { ui2 } from "../content/ui2";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";
import { pickNeed } from "../bus";
import ProjectStories from "../components/ProjectStories";
import { useProjects } from "../projectOrder";
import Shots from "../components/Shots";
import LivePreview from "../components/LivePreview";
import NotFound from "./NotFound";
import { useShown } from "../siteFlags";
import { Link, navigate } from "../router";
import { usePhone } from "../components/AppPager";

/** direzione dell'ultimo cambio con lo swipe: serve all'animazione di entrata */
let slideDir = 0;

export default function ProjectPage({ id }: { id: string }) {
	const { t } = usePrefs();
	const phone = usePhone();
	const shown = useShown();
	const ordered = useProjects();
	const p = projects.find((x) => x.id === id);
	const index = Math.max(0, ordered.findIndex((x) => x.id === id));

	useEffect(() => {
		if (p) unlock("quest");
	}, [p]);

	// swipe orizzontale su telefono: progetto precedente / successivo (non sulle cose che scorrono da sole)
	const sw = useRef<{ x: number; y: number; ok: boolean } | null>(null);
	const onTouchStart = (e: React.TouchEvent) => {
		const el = e.target as HTMLElement;
		const t0 = e.touches[0];
		sw.current = { x: t0.clientX, y: t0.clientY, ok: e.touches.length === 1 && !el.closest(".shots, .stories, .lbx, .lp, .scrollrow, input, textarea, iframe, [data-noswipe]") };
	};
	const onTouchEnd = (e: React.TouchEvent) => {
		const s0 = sw.current;
		sw.current = null;
		if (!s0?.ok) return;
		const t1 = e.changedTouches[0];
		const dx = t1.clientX - s0.x;
		const dy = t1.clientY - s0.y;
		if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 2.2) return;
		const n = ordered[index + (dx < 0 ? 1 : -1)];
		if (!n) return;
		slideDir = dx < 0 ? 1 : -1;
		navigate(`/progetti/${n.id}`);
	};
	const enter = slideDir;
	useEffect(() => {
		slideDir = 0;
	}, [id]);

	if (!p) return <NotFound />;

	const prev = ordered[index - 1];
	const nextP = ordered[index + 1];
	const ask = () => pickNeed(undefined, `${t(ui2.project.similar)} (${p.name})`);
	const P = {
		did: { it: "Cosa ho fatto", en: "What I did" },
		card: { it: "Scheda progetto", en: "Project facts" },
		status: { it: "Stato", en: "Status" },
		period: { it: "Periodo", en: "Period" },
		kind: { it: "Tipo", en: "Type" },
		with: { it: "Insieme a", en: "With" },
		similarText: { it: "Raccontami come lavori oggi: ti propongo una soluzione prima di scrivere codice.", en: "Tell me how you work today: I'll propose a solution before writing any code." },
		others: { it: "Altri progetti", en: "Other projects" },
	};

	return (
		<section className="sec" aria-labelledby="project-title" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
			{shown("ui.stories") && <ProjectStories list={ordered} current={p.id} />}
			<div key={p.id} className={`card ppage glass${enter ? (enter > 0 ? " slide-next" : " slide-prev") : ""}`} data-lg-bezel="30">
				<div className="dlg__head">
					<div>
						<p className="eyebrow">
							<b>{String(index + 1).padStart(2, "0")}.</b>
							{t(ui.projects.quest)}
						</p>
						{p.logo ? (
							<h1 id="project-title" className={`plogo-title${p.logo.plate ? " plate" : ""}`}>
								<img src={p.logo.src} width={p.logo.w} height={p.logo.h} alt={p.name} decoding="async" />
							</h1>
						) : (
							<h1 id="project-title" className="h2">
								{p.name}
							</h1>
						)}
						<p className="dlg__meta">
							<span className={`status status--${p.status}`}>{t(statusLabel[p.status])}</span>
							{p.years && <span>{p.years}</span>}
						</p>
					</div>
				</div>
				<p className="pdetail__lead plead">{t(p.summary)}</p>

				{p.shots && <Shots shots={p.shots} portrait={p.shotsPortrait} />}

				<div className="pgrid">
					<div className="pmain pdetail__text">
						{p.result && (
							<p className="pkpi">
								<b>{t(p.result.value)}</b>
								<span>{t(p.result.label)}</span>
							</p>
						)}
						<h2 className="psec">{t(P.did)}</h2>
						<p>{t(p.details)}</p>
						<ul className="ticks" role="list">
							{p.highlights.map((h) => (
								<li key={h.it}>{t(h)}</li>
							))}
						</ul>
						{p.links && (
							<>
								<p className="psub">{t(ui.projects.links)}</p>
								<ul className="plinks" role="list">
									{p.links.map((l) => (
										<li key={l.href}>
											<a className="btn sm" href={l.href} target="_blank" rel="noopener noreferrer">
												{t(l.label)}
												<FiArrowUpRight aria-hidden="true" />
												<span className="sr-only">({t(ui.projects.newTab)})</span>
											</a>
										</li>
									))}
								</ul>
							</>
						)}
					</div>
					<aside className="pside glass" data-lg="off" aria-label={t(P.card)}>
						<dl>
							<div>
								<dt>{t(P.status)}</dt>
								<dd>{t(statusLabel[p.status])}</dd>
							</div>
							{p.years && (
								<div>
									<dt>{t(P.period)}</dt>
									<dd>{p.years}</dd>
								</div>
							)}
							<div>
								<dt>{t(P.kind)}</dt>
								<dd>{t(p.tag)}</dd>
							</div>
							{p.collab && (
								<div>
									<dt>{t(P.with)}</dt>
									<dd className="collab">
										<FiUsers aria-hidden="true" />
										<span>
											{p.collab.name ? (
												p.collab.url ? (
													<a href={p.collab.url} target="_blank" rel="noopener noreferrer">
														{p.collab.name}
													</a>
												) : (
													p.collab.name
												)
											) : (
												t(p.collab.note)
											)}
										</span>
									</dd>
								</div>
							)}
						</dl>
						{p.stack.length > 0 && (
							<>
								<p className="psub">{t(ui.projects.stack)}</p>
								<ul className="tags" role="list">
									{p.stack.map((s) => (
										<li key={s}>{s}</li>
									))}
								</ul>
							</>
						)}
						<div className="psimilar">
							<p className="psimilar__t">{t(ui2.project.similar)}</p>
							<p className="psimilar__x">{t(P.similarText)}</p>
							<button type="button" className="btn pri" onClick={ask}>
								{t(ui2.project.ask)}
								<FiArrowRight aria-hidden="true" />
							</button>
						</div>
					</aside>
				</div>

				{p.preview && <LivePreview key={p.id} url={p.preview} />}

				<nav className="pnav" aria-label={t(P.others)}>
					{prev ? (
						<Link to={`/progetti/${prev.id}`}>
							<FiArrowLeft aria-hidden="true" />
							{prev.name}
						</Link>
					) : (
						<span />
					)}
					{nextP && (
						<Link to={`/progetti/${nextP.id}`}>
							{nextP.name}
							<FiArrowRight aria-hidden="true" />
						</Link>
					)}
				</nav>
			</div>
			{phone &&
				createPortal(
					<div className="pbar">
						<span>{t(ui2.project.similar)}</span>
						<button type="button" className="btn pri" onClick={ask}>
							{t(ui2.project.ask)}
						</button>
					</div>,
					document.body,
				)}
		</section>
	);
}
