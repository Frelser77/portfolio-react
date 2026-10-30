import { FiCompass, FiHeart, FiMessageCircle } from "react-icons/fi";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

const valueIcons = [FiCompass, FiHeart, FiMessageCircle];

export default function Method() {
	const { t } = usePrefs();
	return (
		<section className="sec" id="metodo" aria-labelledby="method-title">
			<div className="card">
				<div className="method">
					<div>
						<p className="eyebrow">
							<b>00.</b>
							{t(ui.method.eyebrow)}
						</p>
						<h2 id="method-title">{t(ui.method.title)}</h2>
						<p className="muted">{t(ui.method.text)}</p>
					</div>
					<ul className="values" role="list">
						{ui.method.values.map((v, i) => {
							const Icon = valueIcons[i];
							return (
								<li key={i} className="value glass tilt" data-lg-bezel="24">
									<span className="value__ico" aria-hidden="true">
										<Icon />
									</span>
									<h3>{t(v.title)}</h3>
									<p>{t(v.text)}</p>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="flow">
					<h3>{t(ui.method.stepsTitle)}</h3>
					<ol className="flow__steps">
						{ui.method.steps.map((s, i) => (
							<li key={i} className="fstep glass tilt" data-lg-bezel="24">
								<span className="fstep__n" aria-hidden="true">
									{i + 1}
								</span>
								<h4>{t(s.title)}</h4>
								<p>{t(s.text)}</p>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
