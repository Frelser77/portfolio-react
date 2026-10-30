import { FiArrowRight, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { pickNeed } from "../bus";
import { usePrefs } from "../prefs";
import Configurator from "./Configurator";
import Lens from "./Lens";
import Results from "./Results";
import { useShown } from "../siteFlags";

const L = {
	avail: { it: "Disponibile per un ruolo in azienda e per progetti su misura", en: "Available for a role and for custom projects" },
	h1: { it: "Full stack developer,", en: "Full stack developer," },
	h2: { it: "software su misura", en: "custom software" },
	h3: { it: "dall'idea alla messa online.", en: "from idea to launch." },
	lead: {
		it: "Gestionali, siti, menu digitali e integrazioni tra i tuoi strumenti, in React, NestJS e .NET. In azienda ho riscritto moduli legacy e collegato telefonia, Slack e CRM. Oria (BR), anche da remoto.",
		en: "Management tools, websites, digital menus and integrations between your tools, in React, NestJS and .NET. At a company I rewrote legacy modules and wired in telephony, Slack and CRM. Oria (Italy), remote too.",
	},
	cv: { it: "Scarica il CV", en: "Download CV" },
};

export default function Hero({ noSide }: { noSide?: boolean }) {
	const { t, lang } = usePrefs();
	const shown = useShown();
	return (
		<section className="hero" id="home" aria-labelledby="hero-title">
			<div className="hero__main" data-pane="hero">
				<p className="avail">
					<i aria-hidden="true" />
					{t(L.avail)}
				</p>
				<p className="eyebrow">{t(ui.hero.eyebrow)}</p>
				<h1 id="hero-title">
					<span>{t(L.h1)}</span> <em className="liq">{t(L.h2)}</em> <span>{t(L.h3)}</span>
				</h1>
				<p className="lead">{t(L.lead)}</p>
				<div className="row">
					<button type="button" className="btn pri mag" onClick={() => pickNeed("altro")}>
						{t(ui.hero.ctaBrief)}
						<FiArrowRight aria-hidden="true" />
					</button>
					<a className="btn glass" href={lang === "it" ? profile.cv : profile.cvEn} download data-lg-bezel="14">
						<FiDownload aria-hidden="true" />
						{t(L.cv)}
					</a>
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
				{noSide && <Results compact />}
			</div>

			{!noSide && shown("home.hero.config") && (
				<div className="hero__side">
					<Configurator />
				</div>
			)}
			<Lens />
		</section>
	);
}
