import { FiArrowUp } from "react-icons/fi";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Footer() {
	const { t } = usePrefs();
	return (
		<footer className="footer">
			<div className="wrap footer__inner">
				<p>
					© {new Date().getFullYear()} Salvatore Alessandro D'Amico. {t(ui.footer.made)}
				</p>
				<a href="#top" className="footer__top">
					<FiArrowUp aria-hidden="true" />
					{t(ui.footer.top)}
				</a>
			</div>
		</footer>
	);
}
