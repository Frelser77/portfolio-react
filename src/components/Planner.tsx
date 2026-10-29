import { useState } from "react";
import { FiArrowRight, FiCpu } from "react-icons/fi";
import { planWithAi } from "../api";
import { ui2 } from "../content/ui2";
import { localPlan } from "../lab/local";
import { usePrefs } from "../prefs";
import { pickNeed } from "../bus";
import type { Plan } from "../shared";

/** "Dal problema al piano": descrivi cosa non va e ottieni passi, tecnologie e tempi indicativi. */
export default function Planner() {
	const { t, lang } = usePrefs();
	const [problem, setProblem] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState(false);
	const [res, setRes] = useState<{ plan: Plan; ai: boolean; problem: string } | null>(null);

	const run = async (text: string) => {
		const p = text.trim();
		if (p.length < 12) {
			setErr(true);
			return;
		}
		setErr(false);
		setBusy(true);
		const ai = await planWithAi(p, lang);
		setRes({ plan: ai ?? localPlan(p, lang), ai: !!ai, problem: p });
		setBusy(false);
	};

	const send = () => {
		if (!res) return;
		const lines = [`${res.plan.title}`, res.problem, "", res.plan.steps.map((s, i) => `${i + 1}. ${s.title}`).join("\n")].join("\n");
		pickNeed(undefined, lines);
	};

	return (
		<div className="planner">
			<form
				className="glass brief"
				data-lg-bezel="26"
				onSubmit={(e) => {
					e.preventDefault();
					run(problem);
				}}
			>
				<h3>{t(ui2.lab.plan.title)}</h3>
				<label>
					<span>{t(ui2.lab.plan.label)}</span>
					<textarea rows={4} maxLength={800} value={problem} placeholder={t(ui2.lab.plan.placeholder)} onChange={(e) => setProblem(e.target.value)} aria-invalid={err} />
				</label>
				{err && (
					<p className="err" role="alert">
						{t(ui2.lab.plan.short)}
					</p>
				)}
				<ul className="chips" role="list">
					{ui2.lab.plan.samples.map((s) => (
						<li key={s.it}>
							<button
								type="button"
								className="cchip"
								onClick={() => {
									setProblem(t(s));
									run(t(s));
								}}
							>
								{t(s)}
							</button>
						</li>
					))}
				</ul>
				<button type="submit" className="btn pri" disabled={busy}>
					<FiCpu aria-hidden="true" />
					{busy ? t(ui2.lab.plan.busy) : t(ui2.lab.plan.go)}
				</button>
			</form>

			<div className="plan" aria-live="polite">
				{res && (
					<article className="glass planres" data-lg-bezel="26">
						<span className={`badge ${res.ai ? "live" : "offline"}`}>{res.ai ? t(ui2.lab.plan.fromAi) : t(ui2.lab.plan.fromRules)}</span>
						<h3>{res.plan.title}</h3>
						<p>{res.plan.summary}</p>
						<p className="psub">{t(ui2.lab.plan.steps)}</p>
						<ol className="psteps">
							{res.plan.steps.map((s, i) => (
								<li key={i}>
									<b>{s.title}</b>
									<span>{s.detail}</span>
								</li>
							))}
						</ol>
						<p className="psub">{t(ui2.lab.plan.stack)}</p>
						<ul className="tags" role="list">
							{res.plan.stack.map((s) => (
								<li key={s}>{s}</li>
							))}
						</ul>
						<p className="psub">{t(ui2.lab.plan.time)}</p>
						<p className="weeks">
							{res.plan.weeksMin}–{res.plan.weeksMax} {t(ui2.lab.plan.weeks)}
						</p>
						{res.plan.risks.length > 0 && (
							<>
								<p className="psub">{t(ui2.lab.plan.risks)}</p>
								<ul className="ticks" role="list">
									{res.plan.risks.map((r) => (
										<li key={r}>{r}</li>
									))}
								</ul>
							</>
						)}
						<p className="chat__note">{t(ui2.lab.plan.disclaimer)}</p>
						<button type="button" className="btn pri" onClick={send}>
							{t(ui2.lab.plan.send)}
							<FiArrowRight aria-hidden="true" />
						</button>
					</article>
				)}
			</div>
		</div>
	);
}
