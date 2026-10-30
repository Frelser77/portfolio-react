import { useEffect, useRef, useState } from "react";
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
	const [id, setId] = useState<Need["id"]>(needs[0].id);
	const [auto, setAuto] = useState(true);
	const need = needs.find((n) => n.id === id) ?? needs[0];
	const box = useRef<HTMLDivElement>(null);

	// Demo automatica: scorre le voci finché non tocchi qualcosa tu (e solo se la card si vede)
	useEffect(() => {
		if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let seen = true;
		const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { threshold: 0.3 });
		if (box.current) io.observe(box.current);
		const iv = window.setInterval(() => {
			if (!seen || document.hidden) return;
			setId((cur) => needs[(needs.findIndex((n) => n.id === cur) + 1) % (needs.length - 1)].id);
		}, 5200);
		return () => {
			io.disconnect();
			clearInterval(iv);
		};
	}, [auto]);

	const choose = (n: Need) => {
		setAuto(false);
		setId(n.id);
		unlock("need");
		say(`${t(ui.config.saidPrefix)} ${t(n.pitch)}`);
	};

	return (
		<div className="glass cfg tilt" data-lg-bezel="26" ref={box}>
			<div className="cfg__head">
				<p className="cfg__step">
					<b>1</b>
					{t(ui.config.step)}
				</p>
				<h2 className="cfg__title">{t(ui.config.title)}</h2>
				<p>{t(ui.config.hint)}</p>
			</div>
			<div className="needgrid" role="group" aria-label={t(ui.config.title)}>
				{needs.map((n) => {
					const Icon = icons[n.id];
					return (
						<button key={n.id} type="button" className={`need${n.id === "altro" ? " need--wide" : ""}`} aria-pressed={id === n.id} onClick={() => choose(n)}>
							<Icon aria-hidden="true" />
							<span>{t(n.title)}</span>
							{auto && id === n.id && <i className="need__bar" aria-hidden="true" />}
						</button>
					);
				})}
			</div>

			<div className="cfg__out" aria-live={auto ? "off" : "polite"}>
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
			</div>
		</div>
	);
}
