import { useEffect, useRef, useState } from "react";
import AiShowcase from "../components/AiShowcase";
import Configurator from "../components/Configurator";
import Digest from "../components/Digest";
import Hero from "../components/Hero";
import { usePrefs } from "../prefs";
import { useShown } from "../siteFlags";
import Method from "../components/Method";
import Portal from "../components/Portal";
import { usePhone } from "../components/AppPager";

type Pane = "hero" | "need" | "ai" | "now" | "go";
const labels: Record<Pane, { it: string; en: string }> = {
	hero: { it: "Start", en: "Start" },
	need: { it: "Su misura", en: "Tailored" },
	ai: { it: "AI", en: "AI" },
	now: { it: "Ora", en: "Now" },
	go: { it: "Esplora", en: "Explore" },
};

export default function Home() {
	const shown = useShown();
	const { t } = usePrefs();
	const phone = usePhone();
	const pager = useRef<HTMLDivElement>(null);
	const [i, setI] = useState(0);
	const needOn = shown("home.hero.config") || shown("home.method");
	const panes: Pane[] = ["hero", ...(needOn ? ["need"] : []), ...(shown("home.ai") ? ["ai"] : []), ...(shown("home.digest") ? ["now"] : []), ...(shown("home.portal") ? ["go"] : [])] as Pane[];

	// su telefono la home è un'app a pagine: si scorre di lato, la pagina non scorre in verticale
	useEffect(() => {
		if (!phone) return;
		document.documentElement.classList.add("home-app");
		return () => document.documentElement.classList.remove("home-app");
	}, [phone]);

	const go = (k: number) => {
		const el = pager.current;
		if (el) el.scrollTo({ left: k * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
	};
	const onScroll = () => {
		const el = pager.current;
		if (el) setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
	};

	const body = (
		<>
			<Hero noSide={phone} />
			{phone && needOn && (
				<div data-pane="need">
					{shown("home.hero.config") && <Configurator />}
					{shown("home.method") && <Method />}
				</div>
			)}
			{!phone && shown("home.method") && (
				<div>
					<Method />
				</div>
			)}
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
		</>
	);
	if (!phone) return <>{body}</>;
	return (
		<div className="happ">
			<div className="htabs" role="tablist" aria-label={t({ it: "Sezioni", en: "Sections" })}>
				{panes.map((p, k) => (
					<button key={p} type="button" role="tab" aria-selected={i === k} className={i === k ? "on" : ""} onClick={() => go(k)}>
						{t(labels[p])}
					</button>
				))}
			</div>
			<div className="hpager" ref={pager} onScroll={onScroll}>
				{body}
			</div>
		</div>
	);
}
