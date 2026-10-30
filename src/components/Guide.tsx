import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiArrowRight, FiEyeOff, FiHome, FiRotateCcw, FiX } from "react-icons/fi";
import { profile } from "../content/data";
import { ui, withAge } from "../content/ui";
import { navigate, usePath } from "../router";
import { ui2 } from "../content/ui2";
import type { L } from "../content/data";
import { unlock } from "../achievements";
import { prefersReducedMotion, usePrefs } from "../prefs";
import Bot3D from "./Bot3D";
import BotGL, { type Pose } from "./BotGL";

/** Le tappe del giro guidato: una per pagina. */
const STOPS = ["/", "/progetti", "/stack", "/lab", "/chi-sono", "/contatti"] as const;
type Stop = (typeof STOPS)[number];

/** Da che lato dello schermo si ferma in ogni pagina (su telefono sta sempre a destra). */
const SIDE: Record<Stop, "l" | "r"> = { "/": "r", "/progetti": "l", "/stack": "r", "/lab": "l", "/chi-sono": "r", "/contatti": "l" };

/** Pagina corrente → tappa del giro e messaggi da dire. */
function where(path: string): { stop: Stop; messages: L[]; key: string } {
	const stop = (STOPS.find((s) => s !== "/" && (path === s || path.startsWith(s + "/"))) ?? "/") as Stop;
	if (path.startsWith("/progetti/")) return { stop, messages: ui2.guide.progetto, key: "progetto" };
	switch (stop) {
		case "/progetti":
			return { stop, messages: ui.guide.progetti, key: stop };
		case "/stack":
			return { stop, messages: [...ui.guide.competenze, ...ui2.guide.stack], key: stop };
		case "/lab":
			return { stop, messages: ui2.guide.lab, key: stop };
		case "/chi-sono":
			return { stop, messages: ui.guide["chi-sono"], key: stop };
		case "/contatti":
			return { stop, messages: ui.guide.contatti, key: stop };
		default:
			return { stop, messages: [...ui.guide.home, ...ui.guide.metodo], key: "/" };
	}
}

/** Su telefono il fumetto compare da solo una volta per pagina, poi sta zitto finché non lo tocchi. */
const seen = new Set<string>();

type Mode = "auto" | "open" | "off";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Dove l'hai lasciato, come frazione dello spazio libero: così resta al suo posto anche se ridimensioni la finestra. */
interface Pos {
	x: number;
	y: number;
}
const POS_KEY = "fr7-guide-pos";
const HINT_KEY = "fr7-guide-hint";
function loadPos(): Pos | null {
	try {
		const j = JSON.parse(localStorage.getItem(POS_KEY) ?? "null") as Pos | null;
		if (j && typeof j.x === "number" && typeof j.y === "number") return { x: clamp(j.x, 0, 1), y: clamp(j.y, 0, 1) };
	} catch {
		/* senza memoria locale torna al suo posto */
	}
	return null;
}
function savePos(p: Pos | null) {
	try {
		if (p) localStorage.setItem(POS_KEY, JSON.stringify(p));
		else localStorage.removeItem(POS_KEY);
	} catch {
		/* ok */
	}
}
const pickOne = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

/**
 * La guida: FR7 Bot in 3D che cammina da un lato all'altro della pagina, ti guarda mentre muovi il mouse,
 * commenta ogni sezione e, se vuoi, ti accompagna passo passo.
 */
export default function Guide() {
	const { t } = usePrefs();
	const path = usePath();
	const here = where(path);
	const active = here.stop;
	const [mode, setMode] = useState<Mode>("auto");
	const [tip, setTip] = useState(0);
	const [show, setShow] = useState(false);
	const [moving, setMoving] = useState(false);
	const [dir, setDir] = useState(1);
	const [spin, setSpin] = useState(false);
	const [wave, setWave] = useState(false);
	const [said, setSaid] = useState<string | null>(null);
	const [pos, setPos] = useState<Pos | null>(() => loadPos());
	const [dragging, setDragging] = useState(false);
	const [gone, setGone] = useState(false);
	const [angry, setAngry] = useState(false);
	const posRef = useRef(pos);
	posRef.current = pos;
	const angryRef = useRef(false);
	angryRef.current = angry;
	const busyRef = useRef(false);
	busyRef.current = dragging || angry || gone || moving;
	const modeRef = useRef<Mode>("auto");
	modeRef.current = mode;
	const incidents = useRef<number[]>([]);
	const drag = useRef<{ id: number; dx: number; dy: number; sx: number; sy: number; moved: boolean; x: number; y: number; vx: number; vy: number; t: number; hist: { x: number; y: number; t: number }[] } | null>(null);
	const suppress = useRef(false);
	const lastDodge = useRef(0);

	const [glOk, setGlOk] = useState(true);
	const fail = useCallback(() => setGlOk(false), []);
	const pose = useRef<Pose>({ lx: 0, ly: 0, walking: false, dir: 1, face: -1, waving: false, spinAt: -1e9, hopAt: -1e9 });
	const root = useRef<HTMLDivElement>(null);
	const bot = useRef<HTMLDivElement>(null);
	const quiet = useRef(false);
	const sayTimer = useRef(0);
	const prevSide = useRef<"l" | "r">(SIDE["/"]);
	const calmTimer = useRef(0);
	useEffect(() => () => clearTimeout(calmTimer.current), []);
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
	const messages = here.messages;
	const text = said ?? withAge(t(messages[tip % messages.length]), profile.age);
	const last = index === STOPS.length - 1;

	// Al cambio di sezione: cammina, poi saluta e commenta
	useEffect(() => {
		clearTimers();
		setTip(0);
		setSaid(null);
		const changed = prevSide.current !== side;
		const calm = prefersReducedMotion();
		if (changed && !calm && !posRef.current) {
			setDir(side === "l" ? -1 : 1);
			setMoving(true);
			later(() => setMoving(false), 1500);
		}
		prevSide.current = side;
		if (active === "/contatti") unlock("end");
		const arrive = changed && !calm && !posRef.current ? 1250 : 500;
		later(() => {
			if (!calm) {
				setWave(true);
				later(() => setWave(false), 1700);
			}
			const phone = window.innerWidth < 720;
			const skip = phone && (here.key === "/" || seen.has(here.key));
			seen.add(here.key);
			if (mode === "auto" && !quiet.current && !skip) {
				setShow(true);
				later(() => setShow(false), phone ? 3800 : 6000);
			} else if (mode === "open") setShow(true);
		}, arrive);
		// il fumetto sparisce mentre cammina e ricompare all'arrivo
		setShow(false);
		return clearTimers;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [here.key]);

	// Lo sguardo segue il cursore (su touch ondeggia da solo, vedi CSS)
	useEffect(() => {
		if (prefersReducedMotion()) return;
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
			window.addEventListener("pointerdown", onMove, { passive: true });
		return () => {
			window.removeEventListener("pointermove", onMove);
				window.removeEventListener("pointerdown", onMove);
			cancelAnimationFrame(raf);
		};
	}, []);

	// Una vita sua: ogni tanto si guarda attorno, saltella, saluta, fa due passi o dice qualcosa.
	// Niente è a ritmo fisso: tempi e gesti sono a caso, e si ferma quando lo stai prendendo o è arrabbiato.
	useEffect(() => {
		if (prefersReducedMotion()) return;
		const phone = window.innerWidth < 720;
		let id = 0;
		let off = 0; // quanto si è spostato con le passeggiate, in px
		const reach = phone ? 26 : 46;
		const timers: number[] = [];
		const after = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
		const look = () => {
			const P = pose.current;
			P.lx = (Math.random() * 2 - 1) * 0.9;
			P.ly = (Math.random() * 2 - 1) * 0.35;
			after(() => {
				if (Math.random() < 0.5) {
					P.lx = (Math.random() * 2 - 1) * 0.9;
					P.ly = 0.1;
				}
			}, 1100);
			after(() => {
				P.lx = 0;
				P.ly = 0;
			}, 2300);
		};
		const stroll = () => {
			const btn = root.current?.querySelector<HTMLElement>(".gbtn");
			if (!btn) return;
			const dir = off > 0 ? -1 : off < 0 ? 1 : Math.random() < 0.5 ? -1 : 1;
			off = off === 0 ? dir * reach : 0;
			const P = pose.current;
			P.dir = dir;
			P.walking = true;
			btn.style.setProperty("--sx", `${off}px`);
			after(() => {
				P.walking = false;
				P.face = -dir;
			}, 1000);
		};
		const tick = () => {
			id = window.setTimeout(tick, 5500 + Math.random() * 7500);
			if (document.hidden || busyRef.current || drag.current) return;
			const r = Math.random();
			if (r < 0.32) look();
			else if (r < 0.52) pose.current.hopAt = performance.now();
			else if (r < 0.66) {
				setWave(true);
				after(() => setWave(false), 1500);
			} else if (r < 0.82) stroll();
			else if (!phone && modeRef.current === "auto" && !quiet.current) speak(t0.current(pickOne(ui2.pet.idle)), 3800);
			else look();
		};
		id = window.setTimeout(tick, 4000 + Math.random() * 3000);
		return () => {
			clearTimeout(id);
			timers.forEach(clearTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Scorrendo la pagina: guarda nella direzione dello scorrimento e, su telefono, si fa trasparente e zitto per non coprire il testo
	useEffect(() => {
		const el = root.current;
		if (!el) return;
		let lastY = window.scrollY;
		let timer = 0;
		const onScroll = () => {
			const y = window.scrollY;
			const dy = y - lastY;
			lastY = y;
			if (Math.abs(dy) < 2) return;
			if (!prefersReducedMotion() && !busyRef.current) {
				pose.current.ly = dy > 0 ? 0.75 : -0.6;
				pose.current.lx *= 0.4;
			}
			if (window.innerWidth < 720) {
				el.classList.add("scrolling");
				if (modeRef.current !== "open") setShow(false);
			}
			clearTimeout(timer);
			timer = window.setTimeout(() => {
				el.classList.remove("scrolling");
				if (!busyRef.current) pose.current.ly = 0;
			}, 750);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			clearTimeout(timer);
		};
	}, []);

	// il robot disegnato in WebGL segue lo stato della guida
	useEffect(() => {
		pose.current.walking = moving;
		pose.current.dir = dir;
	}, [moving, dir]);
	useEffect(() => {
		// da fermo guarda verso il centro della pagina
		pose.current.face = window.innerWidth < 720 || side === "r" ? -1 : 1;
	}, [side]);
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
			}, window.innerWidth < 720 ? 3000 : 4500);
			if (!prefersReducedMotion()) {
				setWave(true);
				window.setTimeout(() => setWave(false), 1400);
			}
		};
		window.addEventListener("guide:say", onSay);
		return () => window.removeEventListener("guide:say", onSay);
	}, []);

	const t0 = useRef(t);
	t0.current = t;
	/** Un messaggio breve, che sparisce da solo. */
	const speak = useCallback((text: string, ms = 4200) => {
		setSaid(text);
		setShow(true);
		clearTimeout(sayTimer.current);
		sayTimer.current = window.setTimeout(() => {
			setShow(false);
			setSaid(null);
		}, ms);
	}, []);

	const place = (p: Pos | null) => {
		setPos(p);
		savePos(p);
	};
	const fracOf = (left: number, top: number): Pos => {
		const el = root.current;
		const w = el?.offsetWidth ?? 150;
		const h = el?.offsetHeight ?? 100;
		return { x: clamp((left - 8) / Math.max(1, window.innerWidth - w - 16), 0, 1), y: clamp((top - 8) / Math.max(1, window.innerHeight - h - 16), 0, 1) };
	};
	const hop = () => {
		if (!prefersReducedMotion()) pose.current.spinAt = performance.now();
	};

	/** Ogni volta che lo "butti fuori" (lo nascondi o lo lanci): alla terza, in pochi minuti, si arrabbia. */
	const incident = () => {
		const now = Date.now();
		incidents.current = [...incidents.current.filter((x) => now - x < 6 * 60_000), now];
		return incidents.current.length >= 3;
	};
	const dodge = () => {
		const now = Date.now();
		if (now - lastDodge.current < 450) return;
		lastDodge.current = now;
		const cur = posRef.current ?? { x: side === "r" || window.innerWidth < 720 ? 1 : 0, y: 1 };
		let n: Pos = cur;
		for (let i = 0; i < 6 && Math.hypot(n.x - cur.x, n.y - cur.y) < 0.4; i++) n = { x: Math.random(), y: Math.random() };
		place(n);
		hop();
		if (Math.random() < 0.6) speak(t0.current(pickOne(ui2.pet.dodge)), 1800);
	};
	const getAngry = () => {
		setAngry(true);
		speak(t0.current(pickOne(ui2.pet.mad)), 4500);
		later(dodge, 700);
		// almeno 10 secondi in cui non si lascia prendere
		// timer a parte: il cambio pagina svuota `timers`, e così non tornava mai calmo
		clearTimeout(calmTimer.current);
		calmTimer.current = window.setTimeout(() => {
			setAngry(false);
			incidents.current = [];
			speak(t0.current(ui2.pet.calm), 4200);
		}, 9_000);
	};
	const hide = () => {
		if (angryRef.current) return dodge();
		if (incident()) return getAngry();
		setGone(true);
		setShow(false);
		later(() => {
			setGone(false);
			setWave(true);
			later(() => setWave(false), 1500);
			speak(t0.current(pickOne(ui2.pet.back)), 5200);
		}, 30_000);
	};
	const goHome = () => {
		place(null);
		hop();
	};

	// dove sta: sulle variabili CSS, così segue la finestra
	useLayoutEffect(() => {
		const el = root.current;
		if (!el) return;
		const apply = () => {
			if (!pos) {
				el.style.removeProperty("--gx");
				el.style.removeProperty("--gy");
				return;
			}
			el.style.setProperty("--gx", `${8 + pos.x * Math.max(0, window.innerWidth - el.offsetWidth - 16)}px`);
			el.style.setProperty("--gy", `${8 + pos.y * Math.max(0, window.innerHeight - el.offsetHeight - 16)}px`);
		};
		apply();
		window.addEventListener("resize", apply);
		return () => window.removeEventListener("resize", apply);
	}, [pos]);

	const onDown = (e: React.PointerEvent) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		if (angryRef.current) {
			e.preventDefault();
			dodge();
			return;
		}
		const el = root.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		drag.current = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false, x: r.left, y: r.top, vx: 0, vy: 0, t: performance.now(), hist: [] };
		try {
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		} catch {
			/* senza cattura il trascinamento funziona lo stesso */
		}
	};
	const onMove = (e: React.PointerEvent) => {
		const d = drag.current;
		const el = root.current;
		if (!d || !el || d.id !== e.pointerId) return;
		if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 7) return;
		if (!d.moved) {
			d.moved = true;
			setDragging(true);
			document.documentElement.classList.add("petdrag");
			setShow(false);
			pose.current.walking = true; // sgambetta mentre lo tieni in braccio
		}
		const now = performance.now();
		const x = clamp(e.clientX - d.dx, 8, window.innerWidth - el.offsetWidth - 8);
		const y = clamp(e.clientY - d.dy, 8, window.innerHeight - el.offsetHeight - 8);
		d.hist.push({ x, y, t: now });
		d.hist = d.hist.filter((h, i, a) => now - h.t < 160 || i >= a.length - 2);
		if (Math.abs(x - d.x) > 0.5) pose.current.dir = x > d.x ? 1 : -1;
		d.x = x;
		d.y = y;
		d.t = now;
		el.style.setProperty("--gx", `${x}px`);
		el.style.setProperty("--gy", `${y}px`);
	};
	const onUp = (e: React.PointerEvent) => {
		const d = drag.current;
		const el = root.current;
		drag.current = null;
		if (!d || !el) return;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* già rilasciato */
		}
		if (!d.moved) return;
		suppress.current = true;
		setDragging(false);
		document.documentElement.classList.remove("petdrag");
		pose.current.walking = false;
		// velocità del rilascio: spostamento negli ultimi ~100 ms
		const h0 = d.hist[0];
		const h1 = d.hist[d.hist.length - 1];
		if (h0 && h1 && h1.t > h0.t) {
			d.vx = (h1.x - h0.x) / Math.max(16, h1.t - h0.t);
			d.vy = (h1.y - h0.y) / Math.max(16, h1.t - h0.t);
		}
		const speed = Math.hypot(d.vx, d.vy);
		if (speed > 0.8 && !prefersReducedMotion()) {
			// lanciato: scivola e rimbalza sui bordi
			let { x, y, vx, vy } = d;
			let last = performance.now();
			const W = window.innerWidth - el.offsetWidth - 8;
			const H = window.innerHeight - el.offsetHeight - 8;
			const step = (now: number) => {
				const dt = Math.min(32, now - last);
				last = now;
				x += vx * dt;
				y += vy * dt;
				if (x < 8 || x > W) {
					vx = -vx * 0.6;
					x = clamp(x, 8, W);
				}
				if (y < 8 || y > H) {
					vy = -vy * 0.6;
					y = clamp(y, 8, H);
				}
				const f = Math.pow(0.992, dt);
				vx *= f;
				vy *= f;
				el.style.setProperty("--gx", `${x}px`);
				el.style.setProperty("--gy", `${y}px`);
				if (Math.hypot(vx, vy) > 0.04) requestAnimationFrame(step);
				else {
					place(fracOf(x, y));
					hop();
				}
			};
			requestAnimationFrame(step);
			if (incident()) later(getAngry, 900);
			else speak(t0.current(ui2.pet.thrown), 2600);
		} else place(fracOf(d.x, d.y));
	};

	const poke = () => {
		if (suppress.current) {
			suppress.current = false;
			return;
		}
		if (angryRef.current) return dodge();
		setSaid(null);
		let hint = false;
		try {
			hint = localStorage.getItem(HINT_KEY) === "1";
			if (!hint) localStorage.setItem(HINT_KEY, "1");
		} catch {
			hint = true;
		}
		if (!hint) {
			speak(t0.current(ui2.pet.drag), 6500);
			return;
		}
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

	const next = () => navigate(last ? "/" : STOPS[index + 1]);

	const bubbleOpen = show && mode !== "off";
	const live = mode === "open";

	const pinned = pos !== null;
	const sideNow = pinned ? (pos.x < 0.5 ? "l" : "r") : side;
	const cls = [
		"guide",
		moving ? "is-moving" : "",
		active === "/lab" || path.startsWith("/admin") ? "nogo" : "",
		active === "/lab" || active === "/contatti" || here.key === "progetto" ? "nomob" : "",
		pinned ? "pinned" : "",
		pinned && pos.y < 0.28 ? "below" : "",
		dragging ? "dragging" : "",
		gone ? "gone" : "",
		angry ? "angry" : "",
		bubbleOpen ? "ctl" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div ref={root} className={cls} data-side={sideNow}>
			<div
				onClick={() => !live && setShow(false)}
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
							{last ? <FiRotateCcw aria-hidden="true" /> : <FiArrowRight aria-hidden="true" />}
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
			<div className="gctl">
				<button type="button" className="gc" onClick={hide} title={t(ui2.pet.hide)} aria-label={t(ui2.pet.hide)}>
					<FiEyeOff aria-hidden="true" />
				</button>
				{pinned && (
					<button type="button" className="gc" onClick={goHome} title={t(ui2.pet.home)} aria-label={t(ui2.pet.home)}>
						<FiHome aria-hidden="true" />
					</button>
				)}
			</div>
			<button
				type="button"
				className="gbtn"
				onClick={poke}
				onPointerDown={onDown}
				onPointerMove={onMove}
				onPointerUp={onUp}
				onPointerCancel={onUp}
				onPointerEnter={(e) => e.pointerType === "mouse" && angryRef.current && dodge()}
				aria-label={t(ui.guide.label)}
			>
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
