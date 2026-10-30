import { projects } from "../content/data";
import { usePrefs } from "../prefs";
import { Link } from "../router";

const L = {
	title: { it: "Risultati concreti", en: "Real results" },
};

/** I risultati veri dei progetti (quelli con un campo "result"), in una riga: card su desktop, carosello su telefono. */
export default function Results({ compact = false }: { compact?: boolean }) {
	const { t } = usePrefs();
	// prima il numero più forte, poi gli altri
	const first = ["primed", "casaurea", "bite-the-trouble"];
	const list = projects.filter((p) => p.result).sort((a, b) => (first.indexOf(a.id) >>> 0) - (first.indexOf(b.id) >>> 0));
	if (!list.length) return null;
	return (
		<section className={`results${compact ? " results--compact" : " sec"}`} aria-labelledby={compact ? "res-title-m" : "res-title"}>
			<h2 id={compact ? "res-title-m" : "res-title"} className="results__title">
				{t(L.title)}
			</h2>
			<ul className="results__list" role="list">
				{list.map((p) => (
					<li key={p.id}>
						<Link className="results__card glass" to={`/progetti/${p.id}`} data-lg="off">
							<b>{t(p.result!.value)}</b>
							<span>{t(p.result!.label)}</span>
							<small>{p.name}</small>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
