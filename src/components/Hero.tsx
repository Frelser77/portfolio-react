import { usePrefs } from "../prefs";
import { ui } from "../content/ui";
import Trace from "./Trace";

export default function Hero() {
	const { t } = usePrefs();
	return (
		<section id="top" className="hero wrap" aria-labelledby="hero-title">
			<div className="hero__copy">
				<p className="hero__hello">
					<img
						src="/img/salvatore-160.webp"
						srcSet="/img/salvatore-160.webp 160w, /img/salvatore-320.webp 320w"
						sizes="56px"
						width="56"
						height="56"
						alt=""
						className="hero__avatar"
					/>
					<span>{t(ui.hero.hello)}</span>
				</p>
				<h1 id="hero-title" className="hero__title">
					{t(ui.hero.title)}
				</h1>
				<p className="hero__lead">{t(ui.hero.lead)}</p>
				<div className="hero__actions">
					<a href="#progetti" className="btn btn--solid">
						{t(ui.hero.ctaWork)}
					</a>
					<a href="#contatti" className="btn btn--ghost">
						{t(ui.hero.ctaContact)}
					</a>
				</div>
				<p className="hero__status">
					<span className="pulse" aria-hidden="true" />
					{t(ui.hero.available)}
				</p>
			</div>
			<Trace />
		</section>
	);
}
