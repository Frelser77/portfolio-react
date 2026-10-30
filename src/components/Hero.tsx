import { FiArrowRight, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { pickNeed } from "../bus";
import { usePrefs } from "../prefs";
import { Link } from "../router";
import Configurator from "./Configurator";
import Lens from "./Lens";
import QuickProfile from "./QuickProfile";
import Results from "./Results";
import { useShown } from "../siteFlags";
import { setAudience, useAudience } from "../audience";

const L = {
	who: { it: "Chi sei?", en: "Who are you?" },
	job: { it: "Cerco uno sviluppatore", en: "I'm hiring a developer" },
	proj: { it: "Ho un progetto", en: "I have a project" },
	jAvail: { it: "Disponibile: posto in azienda, in Puglia o da remoto", en: "Available: a role in Puglia or remote" },
	j1: { it: "Full stack developer.", en: "Full stack developer." },
	j2: { it: "React, NestJS, .NET.", en: "React, NestJS, .NET." },
	jLead: {
		it: "In azienda ho riscritto moduli legacy in NestJS e integrato telefonia, Slack e CRM. Oggi porto gestionali e siti dall'idea alla messa online, dominio ed email compresi. Oria (BR), anche da remoto.",
		en: "At a company I rewrote legacy modules in NestJS and wired in telephony, Slack and CRM. Today I take management tools and websites from idea to launch, domain and email included. Oria (Italy), remote too.",
	},
	jCv: { it: "Scarica il CV", en: "Download CV" },
	jMore: { it: "Profilo e percorso", en: "Profile and path" },
};

export default function Hero({ noSide }: { noSide?: boolean }) {
	const { t, lang } = usePrefs();
	const shown = useShown();
	const aud = useAudience();
	const job = aud === "job";
	return (
		<section className={`hero hero--${aud}`} id="home" aria-labelledby="hero-title">
			<div className="hero__main" data-pane="hero">
				<div className="aud" role="radiogroup" aria-label={t(L.who)}>
					<button type="button" role="radio" aria-checked={job} className={job ? "on" : ""} onClick={() => setAudience("job")}>
						{t(L.job)}
					</button>
					<button type="button" role="radio" aria-checked={!job} className={!job ? "on" : ""} onClick={() => setAudience("proj")}>
						{t(L.proj)}
					</button>
				</div>
				<p className="avail">
					<i aria-hidden="true" />
					{job ? t(L.jAvail) : t(ui.hero.avail)}
				</p>
				<p className="eyebrow">{t(ui.hero.eyebrow)}</p>
				{job ? (
					<h1 id="hero-title">
						<span>{t(L.j1)}</span> <em className="liq">{t(L.j2)}</em>
					</h1>
				) : (
					<h1 id="hero-title">
						<span>{t(ui.hero.l1)}</span> <em className="liq">{t(ui.hero.l2)}</em> <span>{t(ui.hero.l3)}</span>
					</h1>
				)}
				<p className="lead">{job ? t(L.jLead) : t(ui.hero.lead)}</p>
				{job ? (
					<div className="row">
						<a className="btn pri mag" href={lang === "it" ? profile.cv : profile.cvEn} download>
							<FiDownload aria-hidden="true" />
							{t(L.jCv)}
						</a>
						<Link className="btn glass" to="/chi-sono" data-lg-bezel="14">
							{t(L.jMore)}
						</Link>
					</div>
				) : (
					<div className="row">
						<button type="button" className="btn pri mag" onClick={() => pickNeed("altro")}>
							{t(ui.hero.ctaBrief)}
							<FiArrowRight aria-hidden="true" />
						</button>
						<Link className="btn glass" to="/progetti" data-lg-bezel="14">
							{t(ui.hero.ctaWork)}
						</Link>
					</div>
				)}
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

			{!noSide &&
				(job ? (
					<div className="hero__side">
						<QuickProfile />
					</div>
				) : (
					shown("home.hero.config") && (
						<div className="hero__side">
							<Configurator />
						</div>
					)
				))}
			{!job && <Lens />}
		</section>
	);
}
