import { useActiveSection } from "../hooks";
import { usePrefs } from "../prefs";
import { ui } from "../content/ui";

/** id = sezione osservata per l'evidenziazione, href = dove porta il link */
const links = [
	{ id: "home", href: "#top", label: ui.nav.home },
	{ id: "chi-sono", href: "#chi-sono", label: ui.nav.about },
	{ id: "competenze", href: "#competenze", label: ui.nav.skills },
	{ id: "progetti", href: "#progetti", label: ui.nav.projects },
	{ id: "contatti", href: "#contatti", label: ui.nav.contact },
];

export default function Nav() {
	const { t, lang, toggleLang } = usePrefs();
	const active = useActiveSection(links.map((l) => l.id));

	return (
		<header className="nav">
			<a className="brand" href="#top" aria-label="FR7, home">
				FR7
			</a>
			<nav className="glass pill" aria-label={t(ui.nav.label)}>
				{links.map((l) => (
					<a key={l.id} href={l.href} className={active === l.id ? "on" : undefined} aria-current={active === l.id ? "true" : undefined}>
						{t(l.label)}
					</a>
				))}
			</nav>
			<button type="button" className="ico lang" onClick={toggleLang} title={t(ui.nav.lang)}>
				<span aria-hidden="true">{lang === "it" ? "EN" : "IT"}</span>
				<span className="sr-only">{t(ui.nav.lang)}</span>
			</button>
		</header>
	);
}
