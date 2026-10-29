import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiX } from "react-icons/fi";
import { FaGithub } from "react-icons/fa6";
import { profile, projects, statusLabel, type Project } from "../content/data";
import { ui } from "../content/ui";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";
import LivePreview from "./LivePreview";

const gradient = (p: Project) => `linear-gradient(35deg, ${p.tint[0]} 0%, ${p.tint[1]} 55%, ${p.tint[2]} 100%)`;

export default function Projects() {
	const { t } = usePrefs();
	const dialog = useRef<HTMLDialogElement>(null);
	const [openId, setOpenId] = useState<string | null>(null);
	const current = projects.find((p) => p.id === openId) ?? null;

	useEffect(() => {
		const onOpen = (e: Event) => setOpenId((e as CustomEvent<string>).detail);
			// (l'obiettivo si sblocca qui sotto quando la finestra si apre)
		window.addEventListener("project:open", onOpen);
		return () => window.removeEventListener("project:open", onOpen);
	}, []);

	useEffect(() => {
		const d = dialog.current;
		if (openId && d && !d.open) {
			d.showModal();
			unlock("quest");
		}
	}, [openId]);

	return (
		<section className="sec" id="progetti" aria-labelledby="projects-title">
			<div className="card proj">
				<div>
					<p className="eyebrow">
						<b>04.</b>
						{t(ui.projects.eyebrow)}
					</p>
					<h2 id="projects-title">{t(ui.projects.title)}</h2>
					<p className="muted">{t(ui.projects.text)}</p>
					<a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
						<FaGithub aria-hidden="true" />
						{t(ui.projects.github)}
						<span className="sr-only">({t(ui.projects.newTab)})</span>
					</a>
				</div>

				<ul className="pcards" role="list">
					{projects.map((p, n) => {
						const live = p.status === "live" ? p.links?.[0] : undefined;
						return (
							<li key={p.id} className="pc glass tilt" data-lg-bezel="22">
								<button type="button" className="pc__open" aria-haspopup="dialog" onClick={() => setOpenId(p.id)}>
									<span className="thumb" style={{ background: gradient(p) }}>
										<span className={`status status--${p.status}`}>{t(statusLabel[p.status])}</span>
										<span className="qn" aria-hidden="true">
											{t(ui.projects.quest)} {String(n + 1).padStart(2, "0")}
										</span>
										<span className="mark" aria-hidden="true">
											{p.mark}
										</span>
									</span>
									<span className="pcb">
										<span>
											<b>{p.name}</b>
											<small>{t(p.tag)}</small>
										</span>
										<FiArrowRight aria-hidden="true" />
									</span>
									<span className="sr-only">{t(ui.projects.openDetails)}</span>
								</button>
								{live && (
									<a className="pc__go" href={live.href} target="_blank" rel="noopener noreferrer" title={t(live.label)}>
										<FiArrowUpRight aria-hidden="true" />
										<span className="sr-only">
											{t(live.label)} ({t(ui.projects.newTab)})
										</span>
									</a>
								)}
							</li>
						);
					})}
				</ul>
			</div>

			<dialog
				ref={dialog}
				className="dlg dlg--wide"
				aria-labelledby="project-title"
				onClose={() => setOpenId(null)}
				onClick={(e) => e.target === dialog.current && dialog.current?.close()}
			>
				{current && (
					<div className="dlg__inner">
						<div className="dlg__head">
							<div>
								<h2 id="project-title">{current.name}</h2>
								<p className="dlg__meta">
									<span className={`status status--${current.status}`}>{t(statusLabel[current.status])}</span>
									{current.years && <span>{current.years}</span>}
								</p>
							</div>
							<button type="button" className="ico" onClick={() => dialog.current?.close()}>
								<FiX aria-hidden="true" />
								<span className="sr-only">{t(ui.nav.close)}</span>
							</button>
						</div>

						<div className={`pdetail${current.preview ? " has-preview" : ""}`}>
							<div className="pdetail__text">
								<p className="pdetail__lead">{t(current.summary)}</p>
								<p>{t(current.details)}</p>
								<ul className="ticks" role="list">
									{current.highlights.map((h) => (
										<li key={h.it}>{t(h)}</li>
									))}
								</ul>
								{current.stack.length > 0 && (
									<>
										<p className="psub">{t(ui.projects.stack)}</p>
										<ul className="tags" role="list">
											{current.stack.map((s) => (
												<li key={s}>{s}</li>
											))}
										</ul>
									</>
								)}
								{current.links && (
									<>
										<p className="psub">{t(ui.projects.links)}</p>
										<ul className="plinks" role="list">
											{current.links.map((l) => (
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
							{current.preview && <LivePreview key={current.id} url={current.preview} />}
						</div>
					</div>
				)}
			</dialog>
		</section>
	);
}
