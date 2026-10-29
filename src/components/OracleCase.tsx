import { useEffect, useRef, useState } from "react";
import { FiPlay, FiRotateCcw } from "react-icons/fi";
import { ui } from "../content/ui";
import { prefersReducedMotion, usePrefs } from "../prefs";

const BEFORE = 20; // secondi reali
const AFTER = 3;
const SCALE = 5; // 1 s di animazione = 5 s reali

type Phase = "rest" | "running" | "done";

export default function OracleCase() {
	const { t, lang } = usePrefs();
	const [phase, setPhase] = useState<Phase>("rest");
	const [elapsed, setElapsed] = useState(0); // secondi reali simulati
	const raf = useRef<number>(0);

	useEffect(() => () => cancelAnimationFrame(raf.current), []);

	const start = () => {
		cancelAnimationFrame(raf.current);
		if (prefersReducedMotion()) {
			setElapsed(BEFORE);
			setPhase("done");
			return;
		}
		setPhase("running");
		setElapsed(0);
		const t0 = performance.now();
		const tick = (now: number) => {
			const sim = Math.min(((now - t0) / 1000) * SCALE, BEFORE);
			setElapsed(sim);
			if (sim < BEFORE) raf.current = requestAnimationFrame(tick);
			else setPhase("done");
		};
		raf.current = requestAnimationFrame(tick);
	};

	// A riposo mostro il risultato finale: l'informazione c'è anche senza interagire.
	const shown = phase === "rest" ? BEFORE : elapsed;
	const before = Math.min(shown, BEFORE);
	const after = Math.min(shown, AFTER);
	const fmt = (n: number) => n.toLocaleString(lang === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

	return (
		<section id="caso-studio" className="section case" aria-labelledby="case-title">
			<div className="wrap case__grid">
				<div className="case__copy">
					<h2 id="case-title">{t(ui.oracle.title)}</h2>
					<p className="section__intro">{t(ui.oracle.intro)}</p>
					<ol className="case__steps">
						{ui.oracle.steps.map((s) => (
							<li key={s.it}>{t(s)}</li>
						))}
					</ol>
				</div>

				<div className="race">
					<div className="race__row">
						<div className="race__label">
							<span>{t(ui.oracle.before)}</span>
							<span className="race__sub">Classic ASP + Oracle 9i</span>
						</div>
						<div className="race__track">
							<div className="race__bar race__bar--before" style={{ width: `${(before / BEFORE) * 100}%` }} />
						</div>
						<output className="race__time">{fmt(before)} s</output>
					</div>
					<div className="race__row">
						<div className="race__label">
							<span>{t(ui.oracle.after)}</span>
							<span className="race__sub">NestJS + Oracle 9i</span>
						</div>
						<div className="race__track">
							<div className="race__bar race__bar--after" style={{ width: `${(after / BEFORE) * 100}%` }} />
						</div>
						<output className="race__time">
							{after >= AFTER ? "~" : ""}
							{fmt(after)} s
						</output>
					</div>
					<div className="race__foot">
						<button type="button" className="btn btn--ghost" onClick={start} disabled={phase === "running"}>
							{phase === "done" ? <FiRotateCcw aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
							{phase === "running" ? t(ui.oracle.running) : phase === "done" ? t(ui.oracle.again) : t(ui.oracle.run)}
						</button>
						<p className="race__note">{t(ui.oracle.scale)}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
