import { useRef, useState } from "react";
import AiShowcase from "../components/AiShowcase";
import Digest from "../components/Digest";
import Hero from "../components/Hero";
import { usePrefs } from "../prefs";
import { useShown } from "../siteFlags";
import Method from "../components/Method";
import Portal from "../components/Portal";

type Pane = "need" | "ai" | "now" | "go";
const labels: Record<Pane, { it: string; en: string }> = {
	need: { it: "Su misura", en: "Tailored" },
	ai: { it: "Prova l'AI", en: "Try the AI" },
	now: { it: "Ora", en: "Now" },
	go: { it: "Esplora", en: "Explore" },
};

export default function Home() {
	const shown = useShown();
	const { t } = usePrefs();
	// su telefono la home è a schede: una alla volta, con swipe; su schermi grandi si vede tutto
	const panes: Pane[] = (["need", ...(shown("home.ai") ? ["ai"] : []), ...(shown("home.digest") ? ["now"] : []), ...(shown("home.portal") ? ["go"] : [])] as Pane[]).filter(
		(x) => x !== "need" || shown("home.hero.config") || shown("home.method"),
	);
	const [tab, setTab] = useState<Pane>("need");
	const cur = panes.includes(tab) ? tab : panes[0];
	const start = useRef<[number, number] | null>(null);
	const go = (d: number) => {
		const i = panes.indexOf(cur) + d;
		if (i >= 0 && i < panes.length) setTab(panes[i]);
	};
	const strip = panes.length > 1 && (
		<div className="htabs" role="tablist" aria-label={t({ it: "Sezioni", en: "Sections" })}>
			{panes.map((p) => (
				<button key={p} type="button" role="tab" aria-selected={cur === p} className={cur === p ? "on" : ""} onClick={() => setTab(p)}>
					{t(labels[p])}
				</button>
			))}
		</div>
	);
	return (
		<div
			className="hometabs"
			data-tab={cur}
			onTouchStart={(e) => {
				const x = e.touches[0];
				start.current = [x.clientX, x.clientY];
			}}
			onTouchEnd={(e) => {
				const s = start.current;
				start.current = null;
				if (!s) return;
				const x = e.changedTouches[0];
				const dx = x.clientX - s[0];
				const dy = x.clientY - s[1];
				if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && !(e.target as HTMLElement).closest("textarea,input,.lens,.hscroll,[data-noswipe]")) go(dx < 0 ? 1 : -1);
			}}
		>
			<Hero tabs={strip} />
			{shown("home.ai") && (
				<div data-pane="ai">
					<AiShowcase />
				</div>
			)}
			{shown("home.digest") && (
				<div data-pane="now">
					<Digest />
				</div>
			)}
			{shown("home.portal") && (
				<div data-pane="go">
					<Portal />
				</div>
			)}
			{shown("home.method") && (
				<div data-pane="need">
					<Method />
				</div>
			)}
		</div>
	);
}
