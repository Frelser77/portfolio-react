/**
 * Liquid glass: rifrazione vera dello sfondo sui bordi (e nelle lenti), con dispersione dei colori.
 *
 * Come funziona: per ogni elemento `.glass` si disegna su un canvas una mappa di spostamento
 * (il colore di ogni pixel dice di quanto "piegare" lo sfondo in quel punto), la si passa a un filtro SVG
 * (feDisplacementMap) e il filtro si usa come `backdrop-filter`. È una tecnica che oggi funziona solo
 * nei browser Chromium (Chrome, Edge, Brave, Opera): altrove resta il vetro sfocato con riflessi,
 * senza la piegatura dei bordi. Per non pesare sulla GPU il filtro si attiva solo per gli elementi visibili.
 */

const NS = "http://www.w3.org/2000/svg";

export const supportsRefraction = () => {
	const ua = navigator.userAgent;
	const chromium = /Chrome\/|Chromium\/|Edg\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
	return chromium && typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "blur(1px)");
};

interface Entry {
	el: HTMLElement;
	id: string;
	filter: SVGFilterElement;
	key: string;
	visible: boolean;
	css: string;
}

type Profile = "bezel" | "lens";

/** Mappa di spostamento per un rettangolo arrotondato (o un cerchio per la lente). */
function makeMap(w: number, h: number, radius: number, bezel: number, profile: Profile, res: number): string {
	const cw = Math.max(2, Math.round(w * res));
	const ch = Math.max(2, Math.round(h * res));
	const canvas = document.createElement("canvas");
	canvas.width = cw;
	canvas.height = ch;
	const ctx = canvas.getContext("2d")!;
	const img = ctx.createImageData(cw, ch);
	const data = img.data;
	const hx = w / 2;
	const hy = h / 2;
	const r = Math.min(radius, hx, hy);
	for (let y = 0; y < ch; y++) {
		for (let x = 0; x < cw; x++) {
			const px = (x + 0.5) / res - hx;
			const py = (y + 0.5) / res - hy;
			const qx = Math.abs(px) - (hx - r);
			const qy = Math.abs(py) - (hy - r);
			const ox = Math.max(qx, 0);
			const oy = Math.max(qy, 0);
			const dist = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r; // <0 dentro
			const depth = -dist;
			let dx = 0;
			let dy = 0;
			if (depth > 0 && depth < bezel) {
				// normale uscente
				let nx: number;
				let ny: number;
				if (ox > 0 || oy > 0) {
					const l = Math.hypot(ox, oy) || 1;
					nx = (ox / l) * Math.sign(px || 1);
					ny = (oy / l) * Math.sign(py || 1);
				} else if (qx > qy) {
					nx = Math.sign(px || 1);
					ny = 0;
				} else {
					nx = 0;
					ny = Math.sign(py || 1);
				}
				const t = depth / bezel; // 0 sul bordo, 1 a fine smusso
				let m: number;
				if (profile === "lens") {
					const rho = 1 - t; // 1 sul bordo, 0 al centro
					m = Math.pow(rho, 1.35);
				} else {
					m = Math.pow(1 - t, 2.4);
				}
				// si campiona verso l'interno: l'immagine dietro il bordo viene "spinta" verso il bordo
				dx = -nx * m;
				dy = -ny * m;
			}
			const i = (y * cw + x) * 4;
			data[i] = 128 + dx * 127;
			data[i + 1] = 128 + dy * 127;
			data[i + 2] = 128;
			data[i + 3] = 255;
		}
	}
	ctx.putImageData(img, 0, 0);
	return canvas.toDataURL("image/png");
}

function buildFilter(id: string, w: number, h: number, href: string, scale: number, dispersion: number) {
	const f = document.createElementNS(NS, "filter");
	f.setAttribute("id", id);
	f.setAttribute("x", "0");
	f.setAttribute("y", "0");
	f.setAttribute("width", String(w));
	f.setAttribute("height", String(h));
	f.setAttribute("filterUnits", "userSpaceOnUse");
	f.setAttribute("primitiveUnits", "userSpaceOnUse");
	f.setAttribute("color-interpolation-filters", "sRGB");
	const img = document.createElementNS(NS, "feImage");
	img.setAttribute("href", href);
	img.setAttribute("x", "0");
	img.setAttribute("y", "0");
	img.setAttribute("width", String(w));
	img.setAttribute("height", String(h));
	img.setAttribute("preserveAspectRatio", "none");
	img.setAttribute("result", "map");
	f.appendChild(img);
	const channels: [string, string, number][] = [
		["r", "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", 1],
		["g", "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", 1 + dispersion],
		["b", "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", 1 + dispersion * 2],
	];
	for (const [name, matrix, k] of channels) {
		const d = document.createElementNS(NS, "feDisplacementMap");
		d.setAttribute("in", "SourceGraphic");
		d.setAttribute("in2", "map");
		d.setAttribute("scale", String(scale * 2 * k));
		d.setAttribute("xChannelSelector", "R");
		d.setAttribute("yChannelSelector", "G");
		d.setAttribute("result", `d${name}`);
		f.appendChild(d);
		const m = document.createElementNS(NS, "feColorMatrix");
		m.setAttribute("in", `d${name}`);
		m.setAttribute("type", "matrix");
		m.setAttribute("values", matrix);
		m.setAttribute("result", name);
		f.appendChild(m);
	}
	const b1 = document.createElementNS(NS, "feBlend");
	b1.setAttribute("in", "r");
	b1.setAttribute("in2", "g");
	b1.setAttribute("mode", "screen");
	b1.setAttribute("result", "rg");
	f.appendChild(b1);
	const b2 = document.createElementNS(NS, "feBlend");
	b2.setAttribute("in", "rg");
	b2.setAttribute("in2", "b");
	b2.setAttribute("mode", "screen");
	f.appendChild(b2);
	return f;
}

/** Avvia il liquid glass su tutti gli `.glass` (e quelli aggiunti dopo). Restituisce la funzione di pulizia. */
export function initLiquidGlass(): () => void {
	const root = document.documentElement;
	if (!supportsRefraction()) {
		root.dataset.refract = "off";
		return () => {};
	}
	root.dataset.refract = "on";

	const svg = document.createElementNS(NS, "svg");
	svg.setAttribute("width", "0");
	svg.setAttribute("height", "0");
	svg.setAttribute("aria-hidden", "true");
	svg.style.cssText = "position:absolute;width:0;height:0;pointer-events:none";
	const defs = document.createElementNS(NS, "defs");
	svg.appendChild(defs);
	document.body.appendChild(svg);

	const entries = new Map<HTMLElement, Entry>();
	let counter = 0;

	const apply = (e: Entry) => {
		e.el.style.backdropFilter = e.visible ? e.css : "";
		e.el.style.setProperty("-webkit-backdrop-filter", e.visible ? e.css : "");
	};

	const rebuild = (e: Entry) => {
		const w = Math.round(e.el.offsetWidth);
		const h = Math.round(e.el.offsetHeight);
		if (w < 8 || h < 8) return;
		const key = `${w}x${h}`;
		if (key === e.key) return;
		e.key = key;
		const cs = getComputedStyle(e.el);
		const radius = parseFloat(cs.borderTopLeftRadius) || Math.min(w, h) / 2;
		const lens = e.el.dataset.lg === "lens";
		const small = Math.min(w, h);
		const bezel = lens ? small / 2 : Number(e.el.dataset.lgBezel) || Math.max(10, Math.min(small * 0.3, 30));
		const strength = Number(e.el.dataset.lgScale) || (lens ? small * 0.2 : Math.max(10, Math.min(bezel * 1.25, 34)));
		const blur = Number(e.el.dataset.lgBlur ?? (lens ? 0 : small > 200 ? 6 : 3));
		// per elementi grandi la mappa si disegna a metà risoluzione: è liscia e costa meno
		const res = w * h > 160_000 ? 0.5 : 1;
		const href = makeMap(w, h, radius, bezel, lens ? "lens" : "bezel", res);
		const old = defs.querySelector(`#${e.id}`);
		const filter = buildFilter(e.id, w, h, href, strength, lens ? 0.06 : 0.05);
		if (old) old.replaceWith(filter);
		else defs.appendChild(filter);
		e.filter = filter;
		const boost = lens ? "saturate(1.5) brightness(1.06)" : "saturate(1.9) brightness(1.12)";
		e.css = `url(#${e.id}) blur(${blur}px) ${boost}`;
		apply(e);
	};

	const io = new IntersectionObserver(
		(list) => {
			for (const it of list) {
				const e = entries.get(it.target as HTMLElement);
				if (!e) continue;
				const was = e.visible;
				e.visible = it.isIntersecting;
				if (e.visible) rebuild(e);
				if (was !== e.visible) apply(e);
			}
		},
		{ rootMargin: "120px 0px" },
	);

	let timer = 0;
	const pending = new Set<HTMLElement>();
	const ro = new ResizeObserver((list) => {
		for (const it of list) pending.add(it.target as HTMLElement);
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			for (const el of pending) {
				const e = entries.get(el);
				if (e?.visible) rebuild(e);
				else if (e) e.key = "";
			}
			pending.clear();
		}, 120);
	});

	const add = (el: HTMLElement) => {
		if (entries.has(el) || el.dataset.lg === "off") return;
		const id = `lg-${++counter}`;
		const entry: Entry = { el, id, filter: null as unknown as SVGFilterElement, key: "", visible: false, css: "" };
		entries.set(el, entry);
		io.observe(el);
		ro.observe(el);
	};

	const scan = () => document.querySelectorAll<HTMLElement>(".glass").forEach(add);
	scan();
	const mo = new MutationObserver(scan);
	mo.observe(document.body, { childList: true, subtree: true });

	return () => {
		mo.disconnect();
		io.disconnect();
		ro.disconnect();
		clearTimeout(timer);
		entries.forEach((e) => {
			e.el.style.backdropFilter = "";
			e.el.style.removeProperty("-webkit-backdrop-filter");
		});
		svg.remove();
		delete root.dataset.refract;
	};
}
