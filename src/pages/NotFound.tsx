import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";
import { Link } from "../router";

export default function NotFound() {
	const { t } = usePrefs();
	return (
		<section className="sec">
			<div className="card">
				<h1 className="h2">{t(ui2.notFound.title)}</h1>
				<p className="muted">{t(ui2.notFound.text)}</p>
				<Link className="btn pri" to="/">
					{t(ui2.nav.home)}
				</Link>
			</div>
		</section>
	);
}
