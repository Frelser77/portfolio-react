import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { uiDigest } from "../content/ai";
import { profile } from "../content/data";
import { usePrefs } from "../prefs";
import { swr } from "../swr";

interface Data {
	text: string | null;
	facts: { contributions: number | null; languages: string[]; recent: { name: string; language: string; pushedAt: string }[]; weeks: number[] };
	at: string;
}
const valid = (d: unknown): d is Data => !!d && typeof d === "object" && !!(d as Data).facts && Array.isArray((d as Data).facts.recent);

const ago = (iso: string, lang: "it" | "en") => {
	const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
	if (m < 60) return lang === "it" ? `${m} min fa` : `${m} min ago`;
	const h = Math.round(m / 60);
	if (h < 24) return lang === "it" ? `${h} h fa` : `${h} h ago`;
	const d = Math.round(h / 24);
	return lang === "it" ? `${d} g fa` : `${d} d ago`;
};

/** "In questo momento": riassunto scritto dall'AI sull'attività GitHub vera, aggiornato al massimo ogni ora. */
export default function Digest() {
	const { t, lang } = usePrefs();
	const [d, setD] = useState<Data | null>(null);
	useEffect(() => {
		setD(null);
		void swr<Data>(`fr7-digest-${lang}`, `/api/digest?lang=${lang}`, 10 * 60_000, setD, valid);
	}, [lang]);
	if (!d || (!d.text && !d.facts.recent.length)) return null;
	const w = d.facts.weeks;
	const max = Math.max(1, ...w);
	const last = d.facts.recent[0];
	return (
		<section className="sec digest" aria-labelledby="digest-title">
			<div className="glass digest__card" data-lg-bezel="28">
				<div className="digest__head">
					<h2 id="digest-title" className="h3">
						<i className="digest__live" aria-hidden="true" />
						{t(uiDigest.title)}
					</h2>
					<span className="digest__ago">
						{t(uiDigest.ago)} {ago(d.at, lang)}
					</span>
				</div>
				<p className="digest__text">
					{d.text ?? (last ? `${t(uiDigest.last)}: ${last.name}${last.language ? ` (${last.language})` : ""}, ${last.pushedAt}.` : "")}
				</p>
				{w.length > 1 && (
					<div className="digest__spark" role="img" aria-label={t(uiDigest.weeks)}>
						{w.map((n, i) => (
							<i key={i} style={{ height: `${Math.max(8, Math.round((n / max) * 100))}%`, ["--i" as string]: i }} />
						))}
					</div>
				)}
				{d.facts.recent.length > 0 && (
					<ul className="digest__repos" role="list">
						{d.facts.recent.map((r) => (
							<li key={r.name}>
								<a className="cchip" href={`${profile.github.replace(/\/$/, "")}/${r.name}`} target="_blank" rel="noopener noreferrer">
									{r.name}
									{r.language && <small>{r.language}</small>}
									<FiArrowUpRight aria-hidden="true" />
								</a>
							</li>
						))}
					</ul>
				)}
				{d.text && <p className="digest__by">✦ {t(uiDigest.byAi)}</p>}
			</div>
		</section>
	);
}
