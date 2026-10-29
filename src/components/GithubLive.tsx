import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FiExternalLink, FiLock, FiStar, FiUserPlus } from "react-icons/fi";
import { getGithub, type GithubData } from "../api";
import { profile } from "../content/data";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";

const ago = (iso: string, lang: "it" | "en") => {
	const d = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
	if (d === 0) return lang === "it" ? "oggi" : "today";
	if (d < 30) return lang === "it" ? `${d} g fa` : `${d}d ago`;
	const m = Math.round(d / 30);
	return lang === "it" ? `${m} mesi fa` : `${m}mo ago`;
};

/** Attività reale su GitHub, letta dal Worker (che la tiene in cache un'ora). */
export default function GithubLive() {
	const { t, lang } = usePrefs();
	const [data, setData] = useState<GithubData | null>(null);
	const [state, setState] = useState<"loading" | "ok" | "off">("loading");

	useEffect(() => {
		let alive = true;
		getGithub().then((d) => {
			if (!alive) return;
			if (d && Array.isArray(d.recent)) {
				setData(d);
				setState("ok");
			} else setState("off");
		});
		return () => {
			alive = false;
		};
	}, []);

	const max = Math.max(1, ...(data?.languages.map((l) => l.count) ?? [1]));
	const weeks = data?.calendar?.slice(-26) ?? [];
	const peak = Math.max(1, ...weeks.flat());
	const lvl = (n: number) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / peak) * 4)));
	return (
		<section className="sec" aria-labelledby="gh-title">
			<div className="card gh">
				<div>
					<p className="eyebrow">{t(ui2.stack.live.eyebrow)}</p>
					<h2 id="gh-title">{t(ui2.stack.live.title)}</h2>
					<p className="muted">{t(ui2.stack.live.text)}</p>
					<div className="ghcta">
						<a className="btn pri" href={profile.github} target="_blank" rel="noopener noreferrer">
							<FiUserPlus aria-hidden="true" />
							{t(ui2.stack.live.follow)}
						</a>
						<a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
							<FaGithub aria-hidden="true" />
							{t(ui2.stack.live.profile)}
						</a>
					</div>
				</div>
				<div className="glass ghbox" data-lg-bezel="26" aria-live="polite">
					{state === "loading" && <p className="muted">{t(ui2.stack.live.loading)}</p>}
					{state === "off" && <p className="muted">{t(ui2.stack.live.off)}</p>}
					{state === "ok" && data && (
						<>
							<dl className="ghnum">
								<div>
									<dt>{t(data?.percent ? ui2.stack.live.reposAll : ui2.stack.live.repos)}</dt>
									<dd>{data.repos}</dd>
								</div>
								<div>
									<dt>{t(ui2.stack.live.followers)}</dt>
									<dd>{data.followers}</dd>
								</div>
								{typeof data.contributions === "number" && (
									<div>
										<dt>{t(ui2.stack.live.contrib)}</dt>
										<dd>{data.contributions}</dd>
									</div>
								)}
							</dl>
							{weeks.length > 0 && (
								<div className="heat" role="img" aria-label={t(ui2.stack.live.contrib)}>
									{weeks.map((w, i) => (
										<span key={i}>
											{w.map((n, j) => (
												<i key={j} data-l={lvl(n)} />
											))}
										</span>
									))}
								</div>
							)}
							<p className="psub">{t(ui2.stack.live.langs)}</p>
							<ul className="bars" role="list">
								{data.languages.slice(0, 5).map((l) => (
									<li key={l.name}>
										<span>{l.name}</span>
										<i style={{ ["--w" as string]: `${Math.round((l.count / max) * 100)}%` }} />
										<b>{data.percent ? `${l.count}%` : l.count}</b>
									</li>
								))}
							</ul>
							{data.featured && data.featured.length > 0 ? (
								<>
									<p className="psub">{t(ui2.stack.live.featured)}</p>
									<ul className="recent" role="list">
										{data.featured.slice(0, 8).map((r) => {
											const inner = (
												<>
													<b>
														{r.private && <FiLock aria-label={t(ui2.stack.live.privateRepo)} />}
														{r.name}
													</b>
													{r.blurb && <span className="rblurb">{r.blurb}</span>}
													<small>{[r.language, r.pushedAt && ago(r.pushedAt, lang)].filter(Boolean).join(" · ") || "—"}</small>
												</>
											);
											return (
												<li key={r.name} className={r.link ? "hasgo" : undefined}>
													{r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div className="rstatic">{inner}</div>}
													{r.link && (
														<a className="rgo" href={r.link} target="_blank" rel="noopener noreferrer" title={t(ui2.stack.live.openSite)}>
															<FiExternalLink aria-hidden="true" />
															<span className="sr-only">{t(ui2.stack.live.openSite)}</span>
														</a>
													)}
												</li>
											);
										})}
									</ul>
								</>
							) : (
								<>
									<p className="psub">{t(ui2.stack.live.recent)}</p>
									<ul className="recent" role="list">
										{data.recent.slice(0, 4).map((r) => (
											<li key={r.name}>
												<a href={r.url} target="_blank" rel="noopener noreferrer">
													<b>{r.name}</b>
													<small>
														{r.language || "—"} · {ago(r.pushedAt, lang)}
													</small>
												</a>
												{r.stars > 0 && (
													<span className="stars">
														<FiStar aria-hidden="true" />
														{r.stars}
													</span>
												)}
											</li>
										))}
									</ul>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
