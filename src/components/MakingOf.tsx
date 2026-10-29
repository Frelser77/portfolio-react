import { FiCheck, FiInfo } from "react-icons/fi";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";

export default function MakingOf() {
	const { t } = usePrefs();
	const m = ui2.lab.making;
	return (
		<div className="making">
			<p className="muted lead2">{t(m.text)}</p>
			<ol className="layers" role="list">
				{m.layers.map((l, i) => (
					<li key={l.tag} className="layer glass tilt" data-lg-bezel="22">
						<span className="layer__tag">{l.tag}</span>
						<b>{t(l.title)}</b>
						<p>{t(l.text)}</p>
						{i < m.layers.length - 1 && <i className="layer__arrow" aria-hidden="true" />}
					</li>
				))}
			</ol>
			<div className="glass principles" data-lg-bezel="24">
				<h3>{t(m.principles.title)}</h3>
				<ul className="ticks" role="list">
					{m.principles.items.map((p) => (
						<li key={p.it}>
							<FiCheck aria-hidden="true" />
							{t(p)}
						</li>
					))}
				</ul>
			</div>
			<p className="note">
				<FiInfo aria-hidden="true" />
				{t(m.limit)}
			</p>
		</div>
	);
}
