import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import { kindLabel, projects, statusLabel, type Project, type ProjectKind } from "../content/data";
import { ui } from "../content/ui";
import { prefersReducedMotion, usePrefs } from "../prefs";
import LivePreview from "./LivePreview";

type Filter = "all" | ProjectKind;
const filters: Filter[] = ["all", "client", "work", "personal", "training"];
const featured = projects.filter((p) => p.status === "live");
const rest = projects.filter((p) => p.status !== "live");

export default function Projects() {
	const { t } = usePrefs();
	const [filter, setFilter] = useState<Filter>("all");
	const [openId, setOpenId] = useState<string | null>(null);

	const visible = useMemo(() => (filter === "all" ? rest : rest.filter((p) => p.kind === filter)), [filter]);
	const countOf = (f: Filter) => (f === "all" ? rest.length : rest.filter((p) => p.kind === f).length);

	// Apertura richiesta da altri punti della pagina (es. la traccia nell'hero)
	useEffect(() => {
		const onOpen = (e: Event) => {
			const id = (e as CustomEvent<string>).detail;
			const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
			if (featured.some((p) => p.id === id)) {
				document.getElementById(`project-${id}`)?.scrollIntoView({ behavior, block: "start" });
				return;
			}
			setFilter("all");
			setOpenId(id);
			requestAnimationFrame(() => {
				const el = document.getElementById(`project-${id}`);
				el?.scrollIntoView({ behavior, block: "start" });
				el?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
			});
		};
		window.addEventListener("open-project", onOpen);
		return () => window.removeEventListener("open-project", onOpen);
	}, []);

	return (
		<section id="progetti" className="section wrap" aria-labelledby="projects-title">
			<div className="section__head">
				<h2 id="projects-title">{t(ui.projects.title)}</h2>
				<p className="section__intro">{t(ui.projects.intro)}</p>
			</div>

			{featured.map((p) => (
				<FeaturedProject key={p.id} project={p} />
			))}

			<div className="filters" role="group" aria-label={t(ui.projects.title)}>
				{filters.map((f) => (
					<button
						key={f}
						type="button"
						className="filter"
						aria-pressed={filter === f}
						onClick={() => setFilter(f)}
					>
						{f === "all" ? t(ui.projects.all) : t(kindLabel[f])}
						<span className="filter__count">{countOf(f)}</span>
					</button>
				))}
			</div>

			{visible.length === 0 ? (
				<p className="empty">
					{t(ui.projects.empty)}{" "}
					<button type="button" className="link-btn" onClick={() => setFilter("all")}>
						{t(ui.projects.showAll)}
					</button>
				</p>
			) : (
				<ul className="plist" role="list">
					{visible.map((p) => (
						<ProjectRow
							key={p.id}
							project={p}
							open={openId === p.id}
							onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
						/>
					))}
				</ul>
			)}
		</section>
	);
}

function StatusPill({ project }: { project: Project }) {
	const { t } = usePrefs();
	return <span className={`status status--${project.status}`}>{t(statusLabel[project.status])}</span>;
}

function ExternalLinks({ project }: { project: Project }) {
	const { t } = usePrefs();
	if (!project.links?.length) return null;
	return (
		<ul className="plinks" role="list">
			{project.links.map((l) => (
				<li key={l.href}>
					<a href={l.href} target="_blank" rel="noopener noreferrer" className="plink">
						{t(l.label)}
						<FiArrowUpRight aria-hidden="true" />
						<span className="sr-only">({t(ui.projects.openNewTab)})</span>
					</a>
				</li>
			))}
		</ul>
	);
}

function Stack({ items }: { items: string[] }) {
	const { t } = usePrefs();
	if (!items.length) return null;
	return (
		<>
			<p className="psub">{t(ui.projects.stack)}</p>
			<ul className="chips" role="list">
				{items.map((s) => (
					<li key={s} className="chip">
						{s}
					</li>
				))}
			</ul>
		</>
	);
}

function FeaturedProject({ project }: { project: Project }) {
	const { t } = usePrefs();
	return (
		<article id={`project-${project.id}`} className="featured" aria-labelledby={`title-${project.id}`}>
			<div className="featured__copy">
				<p className="featured__kicker">
					<span className="pulse" aria-hidden="true" />
					{t(ui.projects.featured)}
				</p>
				<h3 id={`title-${project.id}`} className="featured__title">
					{project.name}
				</h3>
				<p className="featured__summary">{t(project.summary)}</p>
				<p>{t(project.details)}</p>
				<ul className="ticks" role="list">
					{project.highlights.map((h) => (
						<li key={h.it}>{t(h)}</li>
					))}
				</ul>
				<Stack items={project.stack} />
				<ExternalLinks project={project} />
			</div>
			{project.preview && <LivePreview url={project.preview} />}
		</article>
	);
}

function ProjectRow({ project, open, onToggle }: { project: Project; open: boolean; onToggle: () => void }) {
	const { t } = usePrefs();
	const panelId = `panel-${project.id}`;
	return (
		<li id={`project-${project.id}`} className={`prow ${open ? "is-open" : ""}`}>
			<h3 className="prow__h">
				<button type="button" className="prow__btn" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
					<span className="prow__name">{project.name}</span>
					<span className="prow__summary">{t(project.summary)}</span>
					<span className="prow__meta">
						<span className="prow__kind">{t(kindLabel[project.kind])}</span>
						<StatusPill project={project} />
					</span>
					<FiChevronDown className="prow__chev" aria-hidden="true" />
				</button>
			</h3>
			<div id={panelId} className="prow__panel" hidden={!open}>
				<div className="prow__body">
					{project.years && <p className="prow__years">{project.years}</p>}
					<p>{t(project.details)}</p>
					<ul className="ticks" role="list">
						{project.highlights.map((h) => (
							<li key={h.it}>{t(h)}</li>
						))}
					</ul>
					<Stack items={project.stack} />
					<ExternalLinks project={project} />
				</div>
			</div>
		</li>
	);
}
