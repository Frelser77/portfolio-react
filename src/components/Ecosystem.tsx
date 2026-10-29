import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight, FiBox } from "react-icons/fi";
import { projects, skillGroups } from "../content/data";
import { icons } from "../content/icons";
import { LAYER_COLORS, buildEco } from "../content/eco";
import { ui2 } from "../content/ui2";
import { openProject } from "../bus";
import { prefersReducedMotion, usePrefs } from "../prefs";

const norm = (s: string) => s.toLowerCase().replace(/[\s.]/g, "");

const rnd = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Part {
	key: string;
	t: number;
	v: number;
	kind: 0 | 1 | 2; // 0 punto di luce · 1 bit (0/1) · 2 qubit
	dir: 1 | -1;
	ch: string;
	ph: number;
}

/**
 * Cosmo digitale: al centro un progetto, intorno in orbita le tecnologie che usa.
 * Niente linee: bit (0 e 1), punti di luce e qubit scorrono lungo archi invisibili tra un pianeta e l'altro,
 * in mezzo a stelle e polvere. Si disegna su canvas con requestAnimationFrame solo quando è visibile;
 * con "movimento ridotto" resta un fotogramma fermo.
 */
export default function Ecosystem() {
	const { t } = usePrefs();
	const [mode, setMode] = useState("all");
	const [sel, setSel] = useState<string | null>(null);
	const [layer, setLayer] = useState<number | null>(null);
	const [w, setW] = useState(360);
	const box = useRef<HTMLDivElement>(null);
	const cvs = useRef<HTMLCanvasElement>(null);
	const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
	const hover = useRef(false);
	const selRef = useRef<string | null>(null);
	selRef.current = sel;
	const focus = useRef<{ chain: Set<string> | null; layer: number | null }>({ chain: null, layer: null });

	const eco = useMemo(() => buildEco(mode), [mode]);
	const proj = projects.find((p) => p.id === mode);
	const selected = eco.nodes.find((n) => n.key === sel) ?? null;

	useEffect(() => {
		setSel(null);
		setLayer(null);
	}, [mode]);

	useEffect(() => {
		const el = box.current;
		if (!el) return;
		const ro = new ResizeObserver(() => setW(el.clientWidth));
		ro.observe(el);
		setW(el.clientWidth);
		return () => ro.disconnect();
	}, []);

	const size = Math.round(Math.max(38, Math.min(mode === "all" ? 48 : 60, w / (mode === "all" ? 9.5 : 6.8))));
	const centerSize = Math.round(w * 0.26);

	// catena evidenziata: dal pianeta scelto fino al centro
	const chain = useMemo(() => {
		const set = new Set<string>();
		let cur = selected;
		while (cur) {
			set.add(cur.key);
			cur = cur.parent ? (eco.nodes.find((n) => n.key === cur!.parent) ?? null) : null;
		}
		return set;
	}, [selected, eco]);
	focus.current = { chain: selected ? chain : null, layer };

	// geometria e animazione
	useEffect(() => {
		const el = box.current;
		const canvas = cvs.current;
		const ctx = canvas?.getContext("2d");
		if (!el || !canvas || !ctx) return;
		const calm = prefersReducedMotion();
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = canvas.height = Math.round(w * dpr);
		const cx = w / 2;
		const cy = w / 2;
		const outer = w / 2 - size / 2 - 6;
		const inner = centerSize / 2 + size / 2 + 8;
		const ringR = (i: number) => (eco.rings <= 1 ? (inner + outer) / 2 : inner + ((outer - inner) * i) / (eco.rings - 1));
		const pos = new Map<string, { x: number; y: number }>();

		const r = rnd(7 + eco.nodes.length);
		const stars = Array.from({ length: Math.round(w / 5) }, () => ({ x: r() * w, y: r() * w, s: 0.4 + r() * 1.1, ph: r() * 6.28, sp: 0.4 + r() * 0.9 }));
		const dust = Array.from({ length: Math.round(w / 9) }, () => ({ rad: 0.15 * w + r() * 0.36 * w, a: r() * 6.28, sp: (r() - 0.5) * 0.05, s: 0.8 + r() * 1.6, hue: r() }));
		const parts: Part[] = [];
		for (const n of eco.nodes) {
			const count = 7;
			for (let k = 0; k < count; k++) {
				parts.push({ key: n.key, t: (k / count + n.slot * 0.137) % 1, v: 0.045 + r() * 0.04, kind: k === 0 ? 2 : k % 2 ? 1 : 0, dir: k % 2 ? 1 : -1, ch: r() > 0.5 ? "1" : "0", ph: r() * 6.28 });
			}
		}
		const byKey = new Map(eco.nodes.map((n) => [n.key, n]));

		let sim = 0;
		let last = performance.now();
		let speed = 1;
		let raf = 0;
		let visible = true;

		const frame = (now: number) => {
			const dt = Math.min(0.034, (now - last) / 1000);
			last = now;
			const target = selRef.current || hover.current ? 0.25 : 1;
			speed += (target - speed) * Math.min(1, dt * 1.6);
			if (!calm) sim += dt * speed;

			for (const n of eco.nodes) {
				const dir = n.ring % 2 ? -1 : 1;
				const omega = (0.17 / (1 + n.ring * 0.55)) * dir;
				const phase = (n.slot / n.slots) * Math.PI * 2 + n.ring * 0.9;
				const a = phase + sim * omega;
				const rad = ringR(n.ring);
				const x = cx + Math.cos(a) * rad;
				const y = cy + Math.sin(a) * rad;
				pos.set(n.key, { x, y });
				const b = nodeEls.current[n.key];
				if (b) b.style.transform = `translate(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px) scale(${(0.94 + 0.06 * Math.sin(a)).toFixed(3)})`;
			}

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, w);
			ctx.globalCompositeOperation = "lighter";

			// stelle che brillano piano
			ctx.fillStyle = "#fff";
			for (const s of stars) {
				ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.ph + sim * s.sp));
				ctx.fillRect(s.x, s.y, s.s, s.s);
			}
			// polvere cosmica, rosa e azzurra, che gira lenta intorno al centro
			for (const d of dust) {
				const a = d.a + sim * d.sp;
				ctx.globalAlpha = 0.35;
				ctx.fillStyle = d.hue > 0.5 ? "#ffb3d9" : "#9fd0ff";
				ctx.beginPath();
				ctx.arc(cx + Math.cos(a) * d.rad, cy + Math.sin(a) * d.rad, d.s, 0, 6.283);
				ctx.fill();
			}
			// orbite appena accennate
			ctx.globalAlpha = 0.1;
			ctx.strokeStyle = "#fff";
			ctx.lineWidth = 1;
			ctx.setLineDash([1.5, 9]);
			for (let i = 0; i < eco.rings; i++) {
				ctx.beginPath();
				ctx.arc(cx, cy, ringR(i), 0, 6.283);
				ctx.stroke();
			}
			ctx.setLineDash([]);

			// bit, luce e qubit che passano da un pianeta all'altro lungo archi invisibili
			const f = focus.current;
			ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			for (const p of parts) {
				const n = byKey.get(p.key)!;
				const a = pos.get(n.key)!;
				const b = n.parent ? pos.get(n.parent)! : { x: cx, y: cy };
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const len = Math.hypot(dx, dy) || 1;
				const bend = len * 0.24 * (n.slot % 2 ? 1 : -1);
				const qx = (a.x + b.x) / 2 - (dy / len) * bend;
				const qy = (a.y + b.y) / 2 + (dx / len) * bend;
				const dim = (f.layer !== null && n.layer !== f.layer) || (f.chain !== null && !f.chain.has(n.key)) ? 0.12 : 1;
				const prog = (p.t + sim * p.v) % 1;
				const at = (u: number) => {
					const k = p.dir > 0 ? u : 1 - u;
					const m = 1 - k;
					return [m * m * a.x + 2 * m * k * qx + k * k * b.x, m * m * a.y + 2 * m * k * qy + k * k * b.y] as const;
				};
				const env = Math.sin(Math.PI * prog); // nasce e si spegne vicino ai pianeti
				const [x, y] = at(prog);
				ctx.fillStyle = n.color;
				if (p.kind === 1) {
					ctx.globalAlpha = 0.85 * env * dim;
					ctx.fillText(p.ch, x, y);
					continue;
				}
				// scia
				for (let k = 3; k >= 1; k--) {
					const u = prog - k * 0.022;
					if (u < 0) continue;
					const [tx, ty] = at(u);
					ctx.globalAlpha = 0.22 * (1 - k / 4) * env * dim;
					ctx.beginPath();
					ctx.arc(tx, ty, 1.5, 0, 6.283);
					ctx.fill();
				}
				ctx.globalAlpha = 0.28 * env * dim;
				ctx.beginPath();
				ctx.arc(x, y, 6, 0, 6.283);
				ctx.fill();
				if (p.kind === 2) {
					// qubit: due punti che si girano attorno e un anello di sovrapposizione
					const th = sim * 2.4 + p.ph;
					ctx.globalAlpha = 0.9 * env * dim;
					for (const sgn of [1, -1]) {
						ctx.beginPath();
						ctx.arc(x + Math.cos(th) * 4.5 * sgn, y + Math.sin(th) * 4.5 * sgn, 1.6, 0, 6.283);
						ctx.fill();
					}
					ctx.globalAlpha = 0.3 * env * dim;
					ctx.strokeStyle = n.color;
					ctx.beginPath();
					ctx.arc(x, y, 4.5, 0, 6.283);
					ctx.stroke();
				} else {
					ctx.globalAlpha = 0.95 * env * dim;
					ctx.beginPath();
					ctx.arc(x, y, 1.9, 0, 6.283);
					ctx.fill();
				}
			}
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = "source-over";

			if (!calm && visible && !document.hidden) raf = requestAnimationFrame(frame);
			else raf = 0;
		};
		const start = () => {
			if (!raf) {
				last = performance.now();
				raf = requestAnimationFrame(frame);
			}
		};
		frame(performance.now());
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible && !calm) start();
		});
		io.observe(el);
		const vis = () => !document.hidden && !calm && start();
		document.addEventListener("visibilitychange", vis);
		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			document.removeEventListener("visibilitychange", vis);
		};
	}, [eco, w, size, centerSize]);

	const lit = (n: { key: string; layer: number }) => {
		if (layer !== null && n.layer !== layer) return false;
		return true;
	};
	const usedIn = selected ? projects.filter((p) => p.stack.some((s) => norm(s).includes(norm(selected.skill.replace(" Core", ""))) || norm(selected.skill.replace(" Core", "")).includes(norm(s)))) : [];
	const layersPresent = [...new Set(eco.nodes.map((n) => n.layer))].sort();

	return (
		<div className="eco">
			<div className="eco__head">
				<p className="eyebrow">{t(ui2.stack.eco.eyebrow)}</p>
				<h2 id="eco-title">{t(ui2.stack.eco.title)}</h2>
				<p className="muted">{t(ui2.stack.eco.text)}</p>
			</div>

			<div className="eco__modes" role="group" aria-label={t(ui2.stack.eco.pick)}>
				<button type="button" className="cchip" aria-pressed={mode === "all"} onClick={() => setMode("all")}>
					{t(ui2.stack.eco.all)}
				</button>
				{projects
					.filter((p) => p.stack.length > 1)
					.map((p) => (
						<button key={p.id} type="button" className="cchip" aria-pressed={mode === p.id} onClick={() => setMode(p.id)}>
							{p.name}
						</button>
					))}
			</div>

			<div
				ref={box}
				className="eco__sky"
				role="group"
				aria-label={t(ui2.stack.eco.canvas)}
				onPointerEnter={(e) => (hover.current = e.pointerType === "mouse")}
				onPointerLeave={() => (hover.current = false)}
				onPointerDown={() => (hover.current = true)}
				onPointerUp={(e) => (hover.current = e.pointerType === "mouse")}
				onPointerCancel={() => (hover.current = false)}
			>
				<canvas ref={cvs} className="eco__cv" style={{ width: w, height: w }} aria-hidden="true" />

				<div
					className="eco__center"
					style={{
						width: centerSize,
						height: centerSize,
						background: proj ? `radial-gradient(circle at 30% 25%, ${proj.tint[2]}, ${proj.tint[1]} 55%, ${proj.tint[0]})` : undefined,
					}}
				>
					<b>{proj ? proj.mark : "FR7"}</b>
					<small>{proj ? proj.name : "Salvatore"}</small>
				</div>

				{eco.nodes.map((n) => {
					const Icon = icons[n.skill] ?? icons[n.name];
					const dim = !lit(n) || (selected !== null && !chain.has(n.key));
					return (
						<button
							key={n.key}
							ref={(el) => void (nodeEls.current[n.key] = el)}
							type="button"
							className={`eco__node${sel === n.key ? " sel" : ""}${dim ? " dim" : ""}`}
							style={{ width: size, height: size, ["--c" as string]: n.color }}
							aria-pressed={sel === n.key}
							aria-label={`${n.name}, ${t(skillGroups[n.layer].title)}`}
							onClick={() => setSel(sel === n.key ? null : n.key)}
						>
							{Icon ? <Icon aria-hidden="true" /> : <span aria-hidden="true">{n.mark}</span>}
							<em>{n.name}</em>
						</button>
					);
				})}
			</div>

			<div className="eco__legend" role="group" aria-label={t(ui2.stack.eco.layers)}>
				{layersPresent.map((l) => (
					<button key={l} type="button" className="eco__pill" aria-pressed={layer === l} style={{ ["--c" as string]: LAYER_COLORS[l] }} onClick={() => setLayer(layer === l ? null : l)}>
						<i aria-hidden="true" />
						{t(skillGroups[l].title)}
					</button>
				))}
			</div>

			<div className="eco__info glass" data-lg-bezel="22" aria-live="polite">
				{selected ? (
					<>
						<div className="eco__ico" style={{ ["--c" as string]: selected.color }}>
							{(() => {
								const I = icons[selected.skill] ?? icons[selected.name] ?? FiBox;
								return <I aria-hidden="true" />;
							})()}
						</div>
						<div>
							<b>{selected.name}</b>
							<small>{t(skillGroups[selected.layer].title)}</small>
							{usedIn.length > 0 && (
								<p>
									{t(ui2.stack.eco.used)} {usedIn.length} {t(ui2.stack.eco.missions)}:{" "}
									{usedIn.slice(0, 3).map((p, i) => (
										<button key={p.id} type="button" className="link" onClick={() => openProject(p.id)}>
											{p.name}
											{i < Math.min(usedIn.length, 3) - 1 ? "," : ""}
										</button>
									))}
								</p>
							)}
						</div>
					</>
				) : (
					<p className="eco__hint">
						{proj ? (
							<>
								{t(ui2.stack.eco.inThis)}: <b>{proj.name}</b>.{" "}
								<button type="button" className="link" onClick={() => openProject(proj.id)}>
									{t(ui2.stack.eco.open)}
									<FiArrowRight aria-hidden="true" />
								</button>
							</>
						) : (
							t(ui2.stack.eco.hint)
						)}
					</p>
				)}
			</div>
		</div>
	);
}
