import { FiArrowRight } from "react-icons/fi";
import { skillGroups } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Skills() {
	const { t } = usePrefs();
	return (
		<section className="sec" id="competenze" aria-labelledby="skills-title">
			<div className="glass card skills">
				<div>
					<p className="eyebrow">
						<b>02.</b>
						{t(ui.skills.eyebrow)}
					</p>
					<h2 id="skills-title">{t(ui.skills.title)}</h2>
					<p className="muted">{t(ui.skills.text)}</p>
					<a className="btn" href="#progetti">
						{t(ui.skills.cta)}
						<FiArrowRight aria-hidden="true" />
					</a>
				</div>
				<div className="groups">
					{skillGroups.map((g) => (
						<div key={g.title.it} role="group" aria-label={t(g.title)}>
							<h3 className="gtitle">{t(g.title)}</h3>
							<ul className="tiles" role="list">
								{g.items.map((s) => (
									<li key={s.name} className="tile">
										<span aria-hidden="true" style={{ background: s.color }}>
											{s.mark}
										</span>
										{s.name}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
