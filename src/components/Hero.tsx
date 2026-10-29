import { FiArrowRight, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";
import Terminal from "./Terminal";
import Typer from "./Typer";

const chips = [
	{ name: "React", mark: "Re", color: "#61dafb" },
	{ name: "TypeScript", mark: "TS", color: "#4a8fe7" },
	{ name: "NestJS", mark: "Ne", color: "#ff7d9a" },
	{ name: ".NET", mark: "NET", color: "#b08cff" },
];

export default function Hero() {
	const { t, lang } = usePrefs();
	return (
		<section className="hero" id="home" aria-labelledby="hero-title">
			<div>
				<p className="eyebrow">{t(ui.hero.hello)}</p>
				<h1 id="hero-title">
					Salvatore
					<br />
					D'Amico
				</h1>
				<p className="role">{t(ui.hero.role)}</p>
					<Typer lang={lang} />
				<p className="lead">{t(ui.hero.lead)}</p>
				<div className="row">
					<a className="btn pri" href="#progetti">
						{t(ui.hero.ctaWork)}
						<FiArrowRight aria-hidden="true" />
					</a>
					<a className="btn" href="#contatti">
						{t(ui.hero.ctaContact)}
						<FiMail aria-hidden="true" />
					</a>
				</div>
				<div className="row socials">
					<a className="ico" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
						<FaGithub aria-hidden="true" />
					</a>
					<a className="ico" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
						<FaLinkedin aria-hidden="true" />
					</a>
					<a className="ico" href={`mailto:${profile.email}`} aria-label={t(ui.hero.email)}>
						<FiMail aria-hidden="true" />
					</a>
				</div>
			</div>

			<div className="hero__side">
				<Terminal />
				<div className="glass tilt chipsbox" aria-hidden="true">
					<div className="chips">
						{chips.map((c) => (
							<div key={c.name} className="chip">
								<span style={{ background: c.color }}>{c.mark}</span>
								{c.name}
							</div>
						))}
					</div>
				</div>
				<a className="glass quote tilt" href="#competenze">
					<p>
						{t(ui.hero.quote)}
						<span className="sr-only"> {t(ui.hero.quoteGo)}</span>
					</p>
					<span className="ico" aria-hidden="true">
						<FiArrowRight />
					</span>
				</a>
			</div>
		</section>
	);
}
