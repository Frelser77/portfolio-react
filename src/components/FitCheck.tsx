import { useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiCpu, FiTarget } from "react-icons/fi";
import { fitWithAi } from "../api";
import { uiAi } from "../content/ai";
import { localFit } from "../lab/local";
import { usePrefs } from "../prefs";
import { pickNeed } from "../bus";
import type { Fit } from "../shared";

/** "Annuncio → compatibilità": incolli un annuncio e l'AI lo confronta con le competenze vere. */
export default function FitCheck() {
	const { t, lang } = usePrefs();
	const [job, setJob] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState(false);
	const [copied, setCopied] = useState(false);
	const [res, setRes] = useState<{ fit: Fit; ai: boolean; job: string } | null>(null);

	const run = async (text: string) => {
		const j = text.trim();
		if (j.length < 40) {
			setErr(true);
			return;
		}
		setErr(false);
		setBusy(true);
		setCopied(false);
		const ai = await fitWithAi(j, lang);
		setRes({ fit: ai ?? localFit(j, lang), ai: !!ai, job: j });
		setBusy(false);
	};

	const copy = async () => {
		if (!res) return;
		try {
			await navigator.clipboard.writeText(res.fit.pitch);
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		} catch {
			/* niente appunti: l'utente può selezionare il testo a mano */
		}
	};

	const f = res?.fit;
	return (
		<div className="planner fit">
			<form
				className="glass brief"
				data-lg-bezel="26"
				onSubmit={(e) => {
					e.preventDefault();
					run(job);
				}}
			>
				<h3>{t(uiAi.fit.title)}</h3>
				<label>
					<span>{t(uiAi.fit.label)}</span>
					<textarea rows={6} maxLength={3500} value={job} placeholder={t(uiAi.fit.placeholder)} onChange={(e) => setJob(e.target.value)} aria-invalid={err} />
				</label>
				{err && (
					<p className="err" role="alert">
						{t(uiAi.fit.short)}
					</p>
				)}
				<div className="row">
					<button type="submit" className="btn pri" disabled={busy}>
						<FiCpu aria-hidden="true" />
						{busy ? t(uiAi.fit.busy) : t(uiAi.fit.go)}
					</button>
					<button
						type="button"
						className="btn glass"
						data-lg-bezel="14"
						disabled={busy}
						onClick={() => {
							setJob(t(uiAi.fit.sampleText));
							run(t(uiAi.fit.sampleText));
						}}
					>
						{t(uiAi.fit.sample)}
					</button>
				</div>
				<p className="chat__note">{t(uiAi.fit.note)}</p>
			</form>

			<div className="plan" aria-live="polite">
				{busy && !res && <div className="fit__wait glass" data-lg="off" aria-hidden="true"><i /><i /><i /></div>}
				{f && res && (
					<article className="glass planres fitres" data-lg-bezel="26">
						<span className={`badge ${res.ai ? "live" : "offline"}`}>{res.ai ? t(uiAi.fit.fromAi) : t(uiAi.fit.fromRules)}</span>
						<div className="fit__top">
							<div className="fit__ring" style={{ ["--p" as string]: f.score }} role="img" aria-label={`${t(uiAi.fit.score)} ${f.score}%`}>
								<b>{f.score}</b>
								<small>%</small>
							</div>
							<div>
								{f.role && <p className="fit__role">{f.role}</p>}
								<p>{f.verdict}</p>
							</div>
						</div>
						<p className="psub">{t(uiAi.fit.matches)}</p>
						<ul className="fit__list" role="list">
							{f.matches.map((m) => (
								<li key={m.skill}>
									<FiCheck aria-hidden="true" />
									<span>
										<b>{m.skill}</b> {m.why}
									</span>
								</li>
							))}
						</ul>
						{f.gaps.length > 0 && (
							<>
								<p className="psub">{t(uiAi.fit.gaps)}</p>
								<ul className="fit__list gaps" role="list">
									{f.gaps.map((g) => (
										<li key={g}>
											<FiTarget aria-hidden="true" />
											<span>{g}</span>
										</li>
									))}
								</ul>
							</>
						)}
						<p className="psub">{t(uiAi.fit.pitch)}</p>
						<blockquote className="fit__pitch">{f.pitch}</blockquote>
						<div className="row">
							<button type="button" className="btn glass" data-lg-bezel="14" onClick={copy}>
								{copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
								{copied ? t(uiAi.fit.copied) : t(uiAi.fit.copy)}
							</button>
							<button type="button" className="btn pri" onClick={() => pickNeed(undefined, `${f.role || "Ruolo"}: ${f.pitch}`)}>
								{t(uiAi.fit.send)}
								<FiArrowRight aria-hidden="true" />
							</button>
						</div>
					</article>
				)}
			</div>
		</div>
	);
}
