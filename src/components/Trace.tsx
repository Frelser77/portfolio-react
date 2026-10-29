import { useState, type CSSProperties } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { SITE_URL, layers, projects } from "../content/data";
import { ui } from "../content/ui";
import { openProject, usePrefs } from "../prefs";

/**
 * La "traccia" di una richiesta, in stile cascata di DevTools:
 * ogni livello attraversato è una cosa che so fare.
 */
export default function Trace() {
	const { t } = usePrefs();
	const [selected, setSelected] = useState("api");
	const [run, setRun] = useState(0);
	const layer = layers.find((l) => l.id === selected)!;

	return (
		<div className="trace" aria-labelledby="trace-label">
			<div className="trace__head">
				<p id="trace-label" className="trace__label">
					{t(ui.trace.label)}
				</p>
				<button type="button" className="trace__replay" onClick={() => setRun((r) => r + 1)}>
					<FiRotateCcw aria-hidden="true" />
					<span>{t(ui.trace.replay)}</span>
				</button>
			</div>

			<div className="trace__url" aria-hidden="true">
				<span className="trace__method">GET</span>
				<span>{new URL(SITE_URL).host}/</span>
			</div>

			<ul className="trace__rows" key={run} role="list">
				{layers.map((l, i) => {
					const isOn = l.id === selected;
					return (
						<li key={l.id}>
							<button
								type="button"
								className={`trace__row ${isOn ? "is-on" : ""}`}
								aria-pressed={isOn}
								aria-controls="trace-detail"
								onClick={() => setSelected(l.id)}
							>
								<span className="trace__tag">{l.tag}</span>
								<span className="trace__name">{t(l.name)}</span>
								<span className="trace__track" aria-hidden="true">
									<span
										className="trace__bar"
										style={
											{
												"--x": `${l.bar[0]}%`,
												"--w": `${l.bar[1]}%`,
												"--i": i,
											} as CSSProperties
										}
									/>
								</span>
							</button>
						</li>
					);
				})}
			</ul>

			<div id="trace-detail" className="trace__detail" aria-live="polite">
				<p className="trace__what">{t(layer.what)}</p>
				<p className="trace__sub">{t(ui.trace.tools)}</p>
				<ul className="chips" role="list">
					{layer.tools.map((tool) => (
						<li key={tool} className="chip">
							{tool}
						</li>
					))}
				</ul>
				<p className="trace__sub">{t(ui.trace.seenIn)}</p>
				<ul className="chips" role="list">
					{layer.projects.map((id) => {
						const p = projects.find((pr) => pr.id === id);
						if (!p) return null;
						return (
							<li key={id}>
								<button type="button" className="chip chip--link" onClick={() => openProject(id)}>
									{p.name}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
			<p className="trace__hint">{t(ui.trace.hint)}</p>
		</div>
	);
}
