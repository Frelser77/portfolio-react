import { FiDownload } from "react-icons/fi";
import { profile } from "../content/data";
import { Link, usePath } from "../router";
import { usePrefs } from "../prefs";
import { AchievementsHud } from "./Achievements";
import { ui2 } from "../content/ui2";
import { ui } from "../content/ui";
import Logo from "./Logo";

export const routes = [
	{ to: "/", label: ui2.nav.home },
	{ to: "/progetti", label: ui2.nav.projects },
	{ to: "/chi-sono", label: ui2.nav.about },
	{ to: "/stack", label: ui2.nav.stack },
	{ to: "/lab", label: ui2.nav.lab },
	{ to: "/contatti", label: ui2.nav.contact },
];

export const isOn = (path: string, to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(to + "/"));

export default function Nav() {
	const { t, lang, toggleLang } = usePrefs();
	const path = usePath();

	return (
		<header className="nav">
			<Link className="brand" to="/" aria-label="FR7, home">
				<Logo />
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
				<a className="glass cvbtn" href={lang === "it" ? profile.cv : profile.cvEn} download title={t(ui2.nav.cv)} data-lg="off">
					<FiDownload aria-hidden="true" />
					<span className="cvbtn__t">{t(ui2.nav.cv)}</span>
				</a>
				<AchievementsHud />
				<button type="button" className="ico lang glass" onClick={toggleLang} title={t(ui.nav.lang)}>
					<span aria-hidden="true">{lang === "it" ? "EN" : "IT"}</span>
					<span className="sr-only">{t(ui.nav.lang)}</span>
				</button>
			</div>
		</header>
	);
}
