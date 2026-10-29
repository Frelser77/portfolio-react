import { useState } from "react";
import { FiArrowRight, FiCheck, FiCloud, FiGrid, FiMessageCircle, FiRefreshCw, FiShare2, FiSmartphone } from "react-icons/fi";
import type { IconType } from "react-icons";
import { needs, type Need } from "../content/data";
import { ui } from "../content/ui";
import { openProject, pickNeed, say } from "../bus";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";

const icons: Record<Need["id"], IconType> = {
	gestionale: FiGrid,
	sito: FiSmartphone,
	integrazioni: FiShare2,
	legacy: FiRefreshCw,
	online: FiCloud,
	altro: FiMessageCircle,
};

/** "Di cosa hai bisogno?": scegli una voce e vedi come viene affrontata, con un esempio vero. */
export default function Configurator() {
	const { t } = usePrefs();
	const [id, setId] = useState<Need["id"] | null>(null);
	const need = needs.find((n) => n.id === id);

	const choose = (n: Need) => {
		setId(n.id);
		unlock("need");
		say(`${t(ui.config.saidPrefix)} ${t(n.pitch)}`);
	};

	return (
		<div className="glass cfg tilt" data-lg-bezel="26">
			<div className="cfg__head">
				<h2 className="cfg__title">{t(ui.config.title)}</h2>
				<p>{t(ui.config.hint)}</p>
			</div>
			<div className="cfg__chips" role="group" aria-label={t(ui.config.title)}>
				{needs.map((n) => {
					const Icon = icons[n.id];
					return (
						<button key={n.id} type="button" className="cchip" aria-pressed={id === n.id} onClick={() => choose(n)}>
							<Icon aria-hidden="true" />
							{t(n.title)}
						</button>
					);
				})}
			</div>

			<div className="cfg__out" aria-live="polite">
				{need ? (
					<div key={need.id} className="cfg__res">
						<p className="cfg__how">{t(ui.config.how)}</p>
						<ul role="list">
							{need.steps.map((s, i) => (
								<li key={i} style={{ ["--i" as string]: i }}>
									<FiCheck aria-hidden="true" />
									{t(s)}
								</li>
							))}
						</ul>
						{need.example && (
							<p className="cfg__ex">
								<b>{t(ui.config.done)}:</b> {t(need.example.label)}
								{need.example.projectId && (
									<button type="button" className="link" onClick={() => openProject(need.example!.projectId!)}>
										{t(ui.config.open)}
										<FiArrowRight aria-hidden="true" />
									</button>
								)}
							</p>
						)}
						<button type="button" className="btn pri" onClick={() => pickNeed(need.id)}>
							{t(ui.config.cta)}
							<FiArrowRight aria-hidden="true" />
						</button>
					</div>
				) : (
					<p className="cfg__empty" aria-hidden="true">
						{t(ui.config.hint)}
					</p>
				)}
			</div>
		</div>
	);
}
