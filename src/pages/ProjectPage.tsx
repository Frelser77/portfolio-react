import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiHeart, FiUsers } from "react-icons/fi";
import { projects, statusLabel } from "../content/data";
import { ui } from "../content/ui";
import { ui2 } from "../content/ui2";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";
import { Link } from "../router";
import { pickNeed } from "../bus";
import { likeProject } from "../api";
import { useStats } from "../stats";
import Shots from "../components/Shots";
import LivePreview from "../components/LivePreview";
import NotFound from "./NotFound";

export default function ProjectPage({ id }: { id: string }) {
	const { t } = usePrefs();
	const stats = useStats();
	const index = projects.findIndex((p) => p.id === id);
	const p = projects[index];
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

	if (!p) return <NotFound />;
	const prev = projects[(index - 1 + projects.length) % projects.length];
	const next = projects[(index + 1) % projects.length];

	const like = async () => {
		if (liked) return;
		setLiked(true);
		setLikes((n) => (n ?? 0) + 1);
		const r = await likeProject(p.id);
		if (r) setLikes(r.likes);
	};

	return (
		<section className="sec" aria-labelledby="project-title">
			<div className="card ppage glass" data-lg-bezel="30">
				<Link className="back" to="/progetti">
					<FiArrowLeft aria-hidden="true" />
					{t(ui2.project.back)}
				</Link>
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

				<nav className="pnav" aria-label={t(ui.projects.title)}>
					<Link className="glass pnav__a" to={`/progetti/${prev.id}`} data-lg-bezel="16">
						<small>{t(ui2.project.prev)}</small>
						<b>{prev.name}</b>
					</Link>
					<Link className="glass pnav__a r" to={`/progetti/${next.id}`} data-lg-bezel="16">
						<small>{t(ui2.project.next)}</small>
						<b>{next.name}</b>
					</Link>
				</nav>
			</div>
		</section>
	);
}
