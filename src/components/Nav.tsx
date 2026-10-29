import { Link, usePath } from "../router";
import { usePrefs } from "../prefs";
import { AchievementsHud } from "./Achievements";
import { ui2 } from "../content/ui2";
import { ui } from "../content/ui";

export const routes = [
	{ to: "/", label: ui2.nav.home },
	{ to: "/progetti", label: ui2.nav.projects },
	{ to: "/stack", label: ui2.nav.stack },
	{ to: "/lab", label: ui2.nav.lab },
	{ to: "/chi-sono", label: ui2.nav.about },
	{ to: "/contatti", label: ui2.nav.contact },
];

export const isOn = (path: string, to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(to + "/"));

export default function Nav() {
	const { t, lang, toggleLang } = usePrefs();
	const path = usePath();

	return (
		<header className="nav">
			<Link className="brand" to="/" aria-label="FR7, home">
				FR7
			</Link>
			<nav className="glass pill" aria-label={t(ui.nav.label)}>
				{routes.map((l) => {
					const on = isOn(path, l.to);
					return (
						<Link key={l.to} to={l.to} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
							{t(l.label)}
						</Link>
					);
				})}
			</nav>
			<div className="nav__tools">
				<AchievementsHud />
				<button type="button" className="ico lang glass" onClick={toggleLang} title={t(ui.nav.lang)}>
					<span aria-hidden="true">{lang === "it" ? "EN" : "IT"}</span>
					<span className="sr-only">{t(ui.nav.lang)}</span>
				</button>
			</div>
		</header>
	);
}
