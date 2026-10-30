import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { uiAi } from "../content/ai";
import { usePrefs } from "../prefs";
import { Link } from "../router";
import Chat from "./Chat";
import FitCheck from "./FitCheck";
import Planner from "./Planner";

type Tab = (typeof uiAi.tabs)[number]["id"];

/** Home: l'AI non è nascosta in una pagina a parte, si prova subito, qui. */
export default function AiShowcase() {
	const { t } = usePrefs();
	const [tab, setTab] = useState<Tab>("fit");
	const cur = uiAi.tabs.find((x) => x.id === tab)!;
	return (
		<section className="sec aishow" id="ai" aria-labelledby="ai-title">
			<div className="card">
				<p className="eyebrow">
					{t(uiAi.eyebrow)}
				</p>
				<h2 id="ai-title">{t(uiAi.title)}</h2>
				<p className="muted">{t(uiAi.text)}</p>
				<ul className="aishow__how" role="list">
					{uiAi.how.map((h) => (
						<li key={h.it}>
							<FiCheck aria-hidden="true" />
							{t(h)}
						</li>
					))}
				</ul>
				<div className="tabs glass aishow__tabs" role="tablist" aria-label={t(uiAi.eyebrow)} data-lg-bezel="18">
					{uiAi.tabs.map((x) => (
						<button
							key={x.id}
							type="button"
							role="tab"
							id={`ai-tab-${x.id}`}
							aria-selected={tab === x.id}
							aria-controls="ai-panel"
							tabIndex={tab === x.id ? 0 : -1}
							onClick={() => setTab(x.id)}
							onKeyDown={(e) => {
								if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
								const ids = uiAi.tabs.map((y) => y.id);
								const n = ids[(ids.indexOf(tab) + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
								setTab(n);
								document.getElementById(`ai-tab-${n}`)?.focus();
							}}
						>
							{t(x.label)}
						</button>
					))}
				</div>
				<p className="aishow__hint">{t(cur.hint)}</p>
				<div role="tabpanel" id="ai-panel" aria-labelledby={`ai-tab-${tab}`}>
					{tab === "fit" && <FitCheck />}
					{tab === "plan" && <Planner />}
					{tab === "chat" && <Chat />}
				</div>
				<Link className="link" to="/lab">
					{t(uiAi.more)}
					<FiArrowRight aria-hidden="true" />
				</Link>
			</div>
		</section>
	);
}
