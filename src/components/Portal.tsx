import { FiArrowUpRight } from "react-icons/fi";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";
import { Link } from "../router";

/** Quattro porte verso le altre pagine, grandi e facili da toccare. */
export default function Portal() {
	const { t } = usePrefs();
	return (
		<section className="sec" aria-labelledby="portal-title">
			<div className="card">
				<p className="eyebrow">{t(ui2.portal.eyebrow)}</p>
				<h2 id="portal-title">{t(ui2.portal.title)}</h2>
				<ul className="portals" role="list">
					{ui2.portal.items.map((p, i) => (
						<li key={p.to} className="portal glass tilt" data-lg-bezel="24" style={{ ["--h" as string]: i * 70 + 200 }}>
							<Link to={p.to}>
								<span className="portal__n" aria-hidden="true">
									0{i + 1}
								</span>
								<b>{t(p.title)}</b>
								<span>{t(p.text)}</span>
								<FiArrowUpRight aria-hidden="true" />
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
