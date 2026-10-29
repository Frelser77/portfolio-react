import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowUp, FiX } from "react-icons/fi";
import { profile } from "../content/data";
import { ui, withAge } from "../content/ui";
import { useActiveSection } from "../hooks";
import { unlock } from "../achievements";
import { prefersReducedMotion, usePrefs } from "../prefs";
import Bot3D from "./Bot3D";
import BotGL, { type Pose } from "./BotGL";

const STOPS = ["home", "metodo", "chi-sono", "competenze", "progetti", "contatti"] as const;
type Stop = (typeof STOPS)[number];

/** Da che lato dello schermo si ferma in ogni sezione (su telefono sta sempre a destra). */
const SIDE: Record<Stop, "l" | "r"> = { home: "r", metodo: "l", "chi-sono": "r", competenze: "l", progetti: "r", contatti: "l" };

type Mode = "auto" | "open" | "off";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * La guida: FR7 Bot in 3D che cammina da un lato all'altro della pagina, ti guarda mentre muovi il mouse,
 * commenta ogni sezione e, se vuoi, ti accompagna passo passo.
 */
export default function Guide() {
	const { t } = usePrefs();
	const active = useActiveSection([...STOPS]) as Stop;
	const [mode, setMode] = useState<Mode>("auto");
	const [tip, setTip] = useState(0);
	const [show, setShow] = useState(false);
	const [moving, setMoving] = useState(false);
	const [dir, setDir] = useState(1);
	const [spin, setSpin] = useState(false);
	const [wave, setWave] = useState(false);
	const [said, setSaid] = useState<string | null>(null);

	const [glOk, setGlOk] = useState(true);
	const fail = useCallback(() => setGlOk(false), []);
	const pose = useRef<Pose>({ lx: 0, ly: 0, walking: false, dir: 1, waving: false, spinAt: -1e9 });
	const root = useRef<HTMLDivElement>(null);
	const bot = useRef<HTMLDivElement>(null);
	const quiet = useRef(false);
	const sayTimer = useRef(0);
	const prevSide = useRef<"l" | "r">(SIDE.home);
	const timers = useRef<number[]>([]);
	const later = (fn: () => void, ms: number) => {
		const id = window.setTimeout(fn, ms);
		timers.current.push(id);
	};
	const clearTimers = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
	};

	const side = SIDE[active];
	const index = STOPS.indexOf(active);
	const messages = ui.guide[active];
	const text = said ?? withAge(t(messages[tip % messages.length]), profile.age);
	const last = index === STOPS.length - 1;

	// Al cambio di sezione: cammina, poi saluta e commenta
	useEffect(() => {
		clearTimers();
		setTip(0);
		setSaid(null);
		const changed = prevSide.current !== side;
		const calm = prefersReducedMotion();
		if (changed && !calm) {
			setDir(side === "l" ? -1 : 1);
			setMoving(true);
			later(() => setMoving(false), 1500);
		}
		prevSide.current = side;
		if (active === "contatti") unlock("end");
		const arrive = changed && !calm ? 1250 : 500;
		later(() => {
			if (!calm) {
				setWave(true);
				later(() => setWave(false), 1700);
			}
			if (mode === "auto" && !quiet.current && !(active === "home" && window.innerWidth < 720)) {
				setShow(true);
				later(() => setShow(false), 7500);
			} else if (mode === "open") setShow(true);
		}, arrive);
		// il fumetto sparisce mentre cammina e ricompare all'arrivo
		setShow(false);
		return clearTimers;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	// Lo sguardo segue il cursore (su touch ondeggia da solo, vedi CSS)
	useEffect(() => {
		if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		let raf = 0;
		const onMove = (e: PointerEvent) => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const el = bot.current ?? root.current;
				if (!el) return;
				const r = el.getBoundingClientRect();
				const dx = clamp((e.clientX - (r.left + r.width / 2)) / 420, -1, 1);
				const dy = clamp((e.clientY - (r.top + r.height * 0.28)) / 360, -1, 1);
				pose.current.lx = dx;
				pose.current.ly = dy;
				el.style.setProperty("--hy", `${(dx * 42).toFixed(1)}deg`);
				el.style.setProperty("--hx", `${(-dy * 24).toFixed(1)}deg`);
				el.style.setProperty("--by", `${(dx * 14).toFixed(1)}deg`);
				el.style.setProperty("--ex", `${(dx * 4).toFixed(1)}px`);
				el.style.setProperty("--ey", `${(dy * 3).toFixed(1)}px`);
			});
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
			cancelAnimationFrame(raf);
		};
	}, []);

	// il robot disegnato in WebGL segue lo stato della guida
	useEffect(() => {
		pose.current.walking = moving;
		pose.current.dir = dir;
	}, [moving, dir]);
	useEffect(() => {
		pose.current.waving = wave;
	}, [wave]);
	useEffect(() => {
		if (spin) pose.current.spinAt = performance.now();
	}, [spin]);

	const openBubble = useCallback(() => {
		unlock("party");
		quiet.current = false;
		setMode("open");
		setShow(true);
	}, []);

	// Il pulsante "Parti con FR7 Bot" nella sezione Chi sono
	useEffect(() => {
		const onTour = () => openBubble();
		window.addEventListener("guide:tour", onTour);
		return () => window.removeEventListener("guide:tour", onTour);
	}, [openBubble]);

	// Messaggi dal resto del sito (per esempio dal configuratore)
	useEffect(() => {
		const onSay = (e: Event) => {
			setSaid((e as CustomEvent<string>).detail);
			// messaggio breve dal resto del sito: compare qualche secondo, senza coprire quello che stai leggendo
			setShow(true);
			clearTimeout(sayTimer.current);
			sayTimer.current = window.setTimeout(() => {
				setShow(false);
				setSaid(null);
			}, 4500);
			if (!prefersReducedMotion()) {
				setWave(true);
				window.setTimeout(() => setWave(false), 1400);
			}
		};
		window.addEventListener("guide:say", onSay);
		return () => window.removeEventListener("guide:say", onSay);
	}, []);

	const poke = () => {
		setSaid(null);
		if (mode === "open" && show) setTip((n) => n + 1);
		else openBubble();
		if (!prefersReducedMotion()) {
			setSpin(true);
			later(() => setSpin(false), 900);
		}
	};

	const close = () => {
		setMode("off");
		setShow(false);
		quiet.current = true;
	};

	const next = () => {
		const calm = prefersReducedMotion();
		const id = last ? "home" : STOPS[index + 1];
		const el = document.getElementById(id);
		if (last) window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
		else el?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
	};

	const bubbleOpen = show && mode !== "off";
	const live = mode === "open";

	return (
		<div ref={root} className={`guide${moving ? " is-moving" : ""}`} data-side={side}>
			<div
				className={`gbubble${bubbleOpen ? " on" : ""}${live ? " live" : ""}`}
				role={live ? "status" : undefined}
				aria-hidden={bubbleOpen ? undefined : true}
				inert={bubbleOpen ? undefined : true}
			>
				<p>{text}</p>
				{live && (
					<div className="gactions">
						<button type="button" className="btn pri sm" onClick={next}>
							{last ? t(ui.guide.top) : t(ui.guide.next)}
							{last ? <FiArrowUp aria-hidden="true" /> : <FiArrowRight aria-hidden="true" />}
						</button>
						<span className="gstep" aria-hidden="true">
							{index + 1}/{STOPS.length}
						</span>
						<button type="button" className="ico gclose" onClick={close}>
							<FiX aria-hidden="true" />
							<span className="sr-only">{t(ui.guide.close)}</span>
						</button>
					</div>
				)}
			</div>
			<button type="button" className="gbtn" onClick={poke} aria-label={t(ui.guide.label)}>
				{glOk ? (
					<div className="botgl">
						<div className="glshadow" />
						<BotGL pose={pose} onFail={fail} />
					</div>
				) : (
					<div
						ref={bot}
						className={`bot${moving ? " walk" : ""}${wave ? " wave" : ""}${spin ? " spin" : ""}`}
						style={{ ["--dir" as string]: dir }}
					>
						<Bot3D />
					</div>
				)}
			</button>
		</div>
	);
}
