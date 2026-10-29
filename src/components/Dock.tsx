import { FiCpu, FiFolder, FiHome, FiLayers, FiMail, FiUser } from "react-icons/fi";
import { Link, usePath } from "../router";
import { usePrefs } from "../prefs";
import { ui2 } from "../content/ui2";
import { isOn, routes } from "./Nav";

const icons = [FiHome, FiFolder, FiLayers, FiCpu, FiUser, FiMail];

/** Barra di navigazione in basso, solo su telefono: vetro che galleggia, raggiungibile con il pollice. */
export default function Dock() {
	const { t } = usePrefs();
	const path = usePath();
	return (
		<nav className="dock glass" aria-label={t(ui2.nav.dock)} data-lg-bezel="18">
			{routes.map((r, i) => {
				const Icon = icons[i];
				const on = isOn(path, r.to);
				return (
					<Link
						key={r.to}
						to={r.to}
						className={on ? "on" : undefined}
						aria-current={on ? "page" : undefined}
						onClick={() => {
							try {
								navigator.vibrate?.(8);
							} catch {
								/* non supportato */
							}
						}}
					>
						<Icon aria-hidden="true" />
						<span>{t(r.label)}</span>
					</Link>
				);
			})}
		</nav>
	);
}
