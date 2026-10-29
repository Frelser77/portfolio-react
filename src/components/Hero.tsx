import { FiArrowRight, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

const chips = [
	{ name: "React", mark: "Re", color: "#61dafb" },
	{ name: "TypeScript", mark: "TS", color: "#4a8fe7" },
	{ name: "NestJS", mark: "Ne", color: "#ff7d9a" },
	{ name: ".NET", mark: "NET", color: "#b08cff" },
];

export default function Hero() {
	const { t } = usePrefs();
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
				<div className="glass code" aria-hidden="true">
					<div className="dots">
						<i />
						<i />
						<i />
					</div>
					<div className="ln" style={{ width: "42%" }} />
					<div className="ln" style={{ width: "70%", marginLeft: "6%", background: "#c4a8ff55" }} />
					<div className="ln" style={{ width: "55%", marginLeft: "6%" }} />
					<div className="ln" style={{ width: "30%", marginLeft: "12%", background: "#7fdcff55" }} />
					<div className="ln" style={{ width: "62%" }} />
					<div className="chips">
						{chips.map((c) => (
							<div key={c.name} className="chip">
								<span style={{ background: c.color }}>{c.mark}</span>
								{c.name}
							</div>
						))}
					</div>
				</div>
				<a className="glass quote" href="#competenze">
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
