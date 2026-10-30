import { FiArrowUp } from "react-icons/fi";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";
import { Link } from "../router";
import { routes } from "./Nav";
import Logo from "./Logo";

export default function Footer() {
	const { t } = usePrefs();
	return (
		<footer className="foot">
			<span className="brand">
				<Logo small />
			</span>
			<span>
				© {new Date().getFullYear()} Salvatore D'Amico. {t(ui.footer.rights)}
			</span>
			<nav aria-label={t(ui.footer.menu)}>
				{routes.map((r) => (
					<Link key={r.to} to={r.to}>
						{t(r.label)}
					</Link>
				))}
			</nav>
			<button type="button" className="ico" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t(ui.footer.top)}>
				<FiArrowUp aria-hidden="true" />
			</button>
		</footer>
	);
}
