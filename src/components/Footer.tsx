import { FiArrowUp } from "react-icons/fi";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Footer() {
	const { t } = usePrefs();
	return (
		<footer className="foot">
			<span className="brand">FR7</span>
			<span>
				© {new Date().getFullYear()} Salvatore D'Amico. {t(ui.footer.rights)}
			</span>
			<nav aria-label={t(ui.footer.menu)}>
				<a href="#top">{t(ui.nav.home)}</a>
				<a href="#metodo">{t(ui.nav.method)}</a>
				<a href="#chi-sono">{t(ui.nav.about)}</a>
				<a href="#competenze">{t(ui.nav.skills)}</a>
				<a href="#progetti">{t(ui.nav.projects)}</a>
				<a href="#contatti">{t(ui.nav.contact)}</a>
			</nav>
			<a className="ico" href="#top" aria-label={t(ui.footer.top)}>
				<FiArrowUp aria-hidden="true" />
			</a>
		</footer>
	);
}
