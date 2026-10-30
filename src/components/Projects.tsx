import { useState } from "react";
import AppPager, { usePhone, type PagerPane } from "./AppPager";
import { FiArrowRight, FiArrowUpRight, FiUsers } from "react-icons/fi";
import { FaGithub } from "react-icons/fa6";
import { kindLabel, profile, statusLabel, type Project, type ProjectKind } from "../content/data";
import { ui } from "../content/ui";
import { ui2 } from "../content/ui2";
import { Link } from "../router";
import { usePrefs } from "../prefs";
import { useProjects } from "../projectOrder";

const gradient = (p: Project) => `linear-gradient(35deg, ${p.tint[0]} 0%, ${p.tint[1]} 55%, ${p.tint[2]} 100%)`;

export default function Projects() {
	const { t } = usePrefs();
	const projects = useProjects();
	const renderCard = (p: (typeof projects)[number], n: number) => {
						const live = p.status === "live" ? p.links?.[0] : undefined;
						return (
							<li key={p.id} className="pc glass tilt" data-lg-bezel="22">
								<Link className="pc__open" to={`/progetti/${p.id}`}>
									<span className="thumb" style={{ background: gradient(p) }}>
										<span className={`status status--${p.status}`}>{t(statusLabel[p.status])}</span>
										<span className="qn" aria-hidden="true">
											{t(ui.projects.quest)} {String(n + 1).padStart(2, "0")}
										</span>
										{p.logo ? (
											<img className="plogo" src={p.logo.src} width={p.logo.w} height={p.logo.h} alt="" loading="lazy" decoding="async" />
										) : (
											<span className="mark" aria-hidden="true">
												{p.mark}
											</span>
										)}
									</span>
									<span className="pcb">
										<span>
											<b>{p.name}</b>
											<small>{t(p.tag)}</small>
											{p.collab && (
												<small className="collabline">
													<FiUsers aria-hidden="true" />
													{t(ui2.project.collabShort)}
												</small>
											)}
										</span>
										<FiArrowRight aria-hidden="true" />
									</span>
									<span className="sr-only">{t(ui.projects.openDetails)}</span>
								</Link>
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
	};
	const phone = usePhone();
	const [filter, setFilter] = useState<"all" | ProjectKind>("all");
	if (phone) {
		const shownList = filter === "all" ? projects : projects.filter((p) => p.kind === filter);
		const count = (k: ProjectKind) => projects.filter((p) => p.kind === k).length;
		const pages: PagerPane[] = [
			{
				id: "list",
				label: "",
				node: (
					<>
						<div className="pfilt" role="radiogroup" aria-label={t({ it: "Filtra i progetti", en: "Filter projects" })}>
							<button type="button" role="radio" aria-checked={filter === "all"} className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
								{t({ it: "Tutti", en: "All" })} {projects.length}
							</button>
							{(Object.keys(kindLabel) as ProjectKind[]).filter((k) => count(k)).map((k) => (
								<button key={k} type="button" role="radio" aria-checked={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
									{t(kindLabel[k])}
								</button>
							))}
						</div>
						<ul className="pcards pcards--list" role="list">
							{shownList.map((p) => renderCard(p, projects.indexOf(p)))}
						</ul>
					</>
				),
			},
		];
		return (
			<AppPager
				panes={pages}
				title={
					<div className="apphead">
						<h2 id="projects-title">{t(ui.projects.title)}</h2>
						<a className="ico glass" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-lg="off">
							<FaGithub aria-hidden="true" />
						</a>
					</div>
				}
			/>
		);
	}
	return (
		<section className="sec" id="progetti" aria-labelledby="projects-title">
			<div className="card proj">
				<div className="pjhead glass" data-lg-bezel="26">
					<p className="eyebrow">
						<b>01.</b>
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
					{projects.map((p, n) => renderCard(p, n))}
				</ul>
			</div>

		</section>
	);
}
