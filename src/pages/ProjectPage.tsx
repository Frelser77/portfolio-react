import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiHeart, FiUsers } from "react-icons/fi";
import { projects, statusLabel } from "../content/data";
import { ui } from "../content/ui";
import { ui2 } from "../content/ui2";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";
import { pickNeed } from "../bus";
import { likeProject } from "../api";
import { useStats } from "../stats";
import ProjectStories from "../components/ProjectStories";
import { useProjects } from "../projectOrder";
import Shots from "../components/Shots";
import LivePreview from "../components/LivePreview";
import NotFound from "./NotFound";
import { useShown } from "../siteFlags";
import { navigate } from "../router";

/** direzione dell'ultimo cambio con lo swipe: serve all'animazione di entrata */
let slideDir = 0;

export default function ProjectPage({ id }: { id: string }) {
	const { t } = usePrefs();
	const stats = useStats();
	const shown = useShown();
	const ordered = useProjects();
	const p = projects.find((x) => x.id === id);
	const index = Math.max(0, ordered.findIndex((x) => x.id === id));
	const [likes, setLikes] = useState<number | null>(null);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (p) unlock("quest");
	}, [p]);
	useEffect(() => {
		if (!stats || !p) return;
		setLikes(stats.likes[p.id] ?? 0);
		setLiked(stats.liked.includes(p.id));
	}, [stats, p]);

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

	const like = async () => {
		if (liked) return;
		setLiked(true);
		setLikes((n) => (n ?? 0) + 1);
		const r = await likeProject(p.id);
		if (r) setLikes(r.likes);
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
					{likes !== null && (
						<button type="button" className="btn glass like" data-lg-bezel="14" aria-pressed={liked} onClick={like}>
							<FiHeart aria-hidden="true" className={liked ? "fill" : undefined} />
							{liked ? t(ui2.project.liked) : t(ui2.project.like)} · {likes}
						</button>
					)}
				</div>

				{p.shots && <Shots shots={p.shots} portrait={p.shotsPortrait} />}

				<div className={`pdetail${p.preview ? " has-preview" : ""}`}>
					<div className="pdetail__text">
						<p className="pdetail__lead">{t(p.summary)}</p>
						{p.collab && (
							<p className="collab">
								<FiUsers aria-hidden="true" />
								<span>
									{t(p.collab.note)}
									{p.collab.name && (
										<>
											{": "}
											{p.collab.url ? (
												<a href={p.collab.url} target="_blank" rel="noopener noreferrer">
													{p.collab.name}
												</a>
											) : (
												p.collab.name
											)}
										</>
									)}
								</span>
							</p>
						)}
						<p>{t(p.details)}</p>
						<ul className="ticks" role="list">
							{p.highlights.map((h) => (
								<li key={h.it}>{t(h)}</li>
							))}
						</ul>
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
						<div className="psimilar">
							<p className="psub">{t(ui2.project.similar)}</p>
							<button type="button" className="btn pri" onClick={() => pickNeed(undefined, `${t(ui2.project.similar)} (${p.name})`)}>
								{t(ui2.project.ask)}
								<FiArrowRight aria-hidden="true" />
							</button>
						</div>
					</div>
					{p.preview && <LivePreview key={p.id} url={p.preview} />}
				</div>

			</div>
		</section>
	);
}
