import { FiArrowRight } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { pickNeed } from "../bus";
import { usePrefs } from "../prefs";
import { Link } from "../router";
import Configurator from "./Configurator";
import Lens from "./Lens";
import { useShown } from "../siteFlags";
import type { ReactNode } from "react";

export default function Hero({ tabs }: { tabs?: ReactNode }) {
	const { t } = usePrefs();
	const shown = useShown();
	return (
		<section className="hero" id="home" aria-labelledby="hero-title">
			<div className="hero__main">
				<p className="avail">
					<i aria-hidden="true" />
					{t(ui.hero.avail)}
				</p>
				<p className="eyebrow">{t(ui.hero.eyebrow)}</p>
				<h1 id="hero-title">
					<span>{t(ui.hero.l1)}</span> <em className="liq">{t(ui.hero.l2)}</em> <span>{t(ui.hero.l3)}</span>
				</h1>
				<p className="lead">{t(ui.hero.lead)}</p>
				<div className="row">
					<button type="button" className="btn pri mag" onClick={() => pickNeed("altro")}>
						{t(ui.hero.ctaBrief)}
						<FiArrowRight aria-hidden="true" />
					</button>
					<Link className="btn glass" to="/progetti" data-lg-bezel="14">
						{t(ui.hero.ctaWork)}
					</Link>
				</div>
				<div className="row socials">
					<a className="ico glass" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
						<FaGithub aria-hidden="true" />
					</a>
					<a className="ico glass" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
						<FaLinkedin aria-hidden="true" />
					</a>
					<a className="ico glass" href={`mailto:${profile.email}`} aria-label={t(ui.hero.email)}>
						<FiMail aria-hidden="true" />
					</a>
				</div>
			</div>

			{tabs}
			{shown("home.hero.config") && (
				<div className="hero__side" data-pane="need">
					<Configurator />
				</div>
			)}
			<Lens />
		</section>
	);
}
