import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";
import { useStats } from "../stats";

/** Contatore di visite anonimo: compare solo se il database D1 risponde. */
export default function Counter() {
	const { t } = usePrefs();
	const s = useStats();
	if (!s) return null;
	return (
		<span className="counter">
			{" · "}
			{s.visits.toLocaleString()} {t(ui2.counter.visits)} ({s.today} {t(ui2.counter.today)})
		</span>
	);
}
