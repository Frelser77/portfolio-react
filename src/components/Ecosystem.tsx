import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight, FiBox } from "react-icons/fi";
import { projects, skillGroups } from "../content/data";
import { icons } from "../content/icons";
import { LAYER_COLORS, buildEco } from "../content/eco";
import { ui2 } from "../content/ui2";
import { openProject } from "../bus";
import { prefersReducedMotion, usePrefs } from "../prefs";

const norm = (s: string) => s.toLowerCase().replace(/[\s.]/g, "");

/**
 * Sistema solare digitale: al centro un progetto, intorno in orbita le tecnologie che usa.
 * Le linee sono i dati: piccoli pacchetti viaggiano dal browser al server, al database e ai servizi.
 * Si disegna con requestAnimationFrame solo quando è visibile; con "movimento ridotto" resta fermo.
 */
export default function Ecosystem() {
	const { t } = usePrefs();
	const [mode, setMode] = useState("all");
	const [sel, setSel] = useState<string | null>(null);
	const [layer, setLayer] = useState<number | null>(null);
	const [w, setW] = useState(360);
	const box = useRef<HTMLDivElement>(null);
	const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
	const lineEls = useRef<Record<string, SVGLineElement | null>>({});
	const dotEls = useRef<Record<string, SVGCircleElement | null>>({});
	const hover = useRef(false);
	const selRef = useRef<string | null>(null);
	selRef.current = sel;

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

	const size = Math.round(Math.max(34, Math.min(mode === "all" ? 46 : 58, w / (mode === "all" ? 10.5 : 7.2))));
	const centerSize = Math.round(w * 0.27);

	// geometria e animazione
	useEffect(() => {
		const el = box.current;
		if (!el) return;
		const calm = prefersReducedMotion();
		const cx = w / 2;
		const cy = w / 2;
		const outer = w / 2 - size / 2 - 6;
		const inner = centerSize / 2 + size / 2 + 8;
		const ringR = (i: number) => (eco.rings <= 1 ? (inner + outer) / 2 : inner + ((outer - inner) * i) / (eco.rings - 1));
		const index = new Map(eco.nodes.map((n) => [n.key, n]));
		const pos = new Map<string, { x: number; y: number; s: number }>();
		let sim = 0;
		let last = performance.now();
		let speed = 1;
		let raf = 0;
		let visible = true;

		const frame = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			const target = selRef.current || hover.current ? 0.12 : 1;
			speed += (target - speed) * Math.min(1, dt * 4);
			if (!calm) sim += dt * speed;

			for (const n of eco.nodes) {
				const dir = n.ring % 2 ? -1 : 1;
				const omega = (0.5 / (1 + n.ring * 0.55)) * dir;
				const phase = (n.slot / n.slots) * Math.PI * 2 + n.ring * 0.9;
				const a = phase + sim * omega;
				const r = ringR(n.ring);
				const x = cx + Math.cos(a) * r;
				const y = cy + Math.sin(a) * r;
				const s = 0.92 + 0.08 * Math.sin(a);
				pos.set(n.key, { x, y, s });
				const b = nodeEls.current[n.key];
				if (b) b.style.transform = `translate(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px) scale(${s.toFixed(3)})`;
			}
			for (const n of eco.nodes) {
				const p = pos.get(n.key)!;
				const parent = n.parent ? pos.get(n.parent)! : { x: cx, y: cy, s: 1 };
				const ln = lineEls.current[n.key];
				if (ln) {
					ln.setAttribute("x1", p.x.toFixed(1));
					ln.setAttribute("y1", p.y.toFixed(1));
					ln.setAttribute("x2", parent.x.toFixed(1));
					ln.setAttribute("y2", parent.y.toFixed(1));
				}
				// due pacchetti per collegamento: uno va, uno torna
				for (let k = 0; k < 2; k++) {
					const d = dotEls.current[`${n.key}#${k}`];
					if (!d) continue;
					const base = (sim * 0.35 + (n.slot * 0.31 + n.ring * 0.17 + k * 0.5)) % 1;
					const tt = k === 0 ? base : 1 - base;
					d.setAttribute("cx", (p.x + (parent.x - p.x) * tt).toFixed(1));
					d.setAttribute("cy", (p.y + (parent.y - p.y) * tt).toFixed(1));
				}
			}
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
		void index;
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
				<svg className="eco__svg" width={w} height={w} viewBox={`0 0 ${w} ${w}`} aria-hidden="true">
					{Array.from({ length: eco.rings }, (_, i) => {
						const outer = w / 2 - size / 2 - 6;
						const inner = centerSize / 2 + size / 2 + 8;
						const r = eco.rings <= 1 ? (inner + outer) / 2 : inner + ((outer - inner) * i) / (eco.rings - 1);
						return <circle key={i} cx={w / 2} cy={w / 2} r={r} className="eco__orbit" />;
					})}
					{eco.nodes.map((n) => {
						const on = lit(n) && (!selected || chain.has(n.key));
						return (
							<g key={n.key} className={on ? "eco__link on" : "eco__link"} style={{ ["--c" as string]: n.color }}>
								<line ref={(el) => void (lineEls.current[n.key] = el)} />
								<circle ref={(el) => void (dotEls.current[`${n.key}#0`] = el)} r={3.2} />
								<circle ref={(el) => void (dotEls.current[`${n.key}#1`] = el)} r={2.2} />
							</g>
						);
					})}
				</svg>

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
