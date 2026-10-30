import { useState } from "react";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";
import Chat from "../components/Chat";
import Planner from "../components/Planner";
import FitCheck from "../components/FitCheck";
import MakingOf from "../components/MakingOf";

type Tab = "chat" | "plan" | "fit" | "making";

export default function LabPage() {
	const { t } = usePrefs();
	const [tab, setTab] = useState<Tab>("chat");
	return (
		<section className="sec" aria-labelledby="lab-title">
			<div className="card lab">
				<p className="eyebrow">
					<b>03.</b>
					{t(ui2.lab.eyebrow)}
				</p>
				<h1 id="lab-title" className="h2">
					{t(ui2.lab.title)}
				</h1>
				<p className="muted">{t(ui2.lab.text)}</p>
				<div className="tabs glass" role="tablist" aria-label={t(ui2.lab.tabsLabel)} data-lg-bezel="18">
					{ui2.lab.tabs.map((x) => (
						<button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-selected={tab === x.id} aria-controls={`panel-${x.id}`} tabIndex={tab === x.id ? 0 : -1} onClick={() => setTab(x.id)}
							onKeyDown={(e) => {
								const ids = ui2.lab.tabs.map((y) => y.id);
								const i = ids.indexOf(tab);
								if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
									const n = ids[(i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
									setTab(n);
									document.getElementById(`tab-${n}`)?.focus();
								}
							}}>
							{t(x.label)}
						</button>
					))}
				</div>
				<div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
					{tab === "chat" && <Chat />}
					{tab === "plan" && <Planner />}
					{tab === "fit" && <FitCheck />}
					{tab === "making" && <MakingOf />}
				</div>
			</div>
		</section>
	);
}
