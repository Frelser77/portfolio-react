import { projects, skillGroups } from "./data";

/** Livelli dell'ecosistema, dal più vicino all'utente al più lontano. Coincidono con i gruppi di skillGroups. */
export const LAYER_COLORS = ["#b08cff", "#6aa2ff", "#ffb347", "#6fe3a0", "#ff8fd0"];

const layerByName: Record<string, number> = {};
const put = (layer: number, names: string[]) => names.forEach((n) => (layerByName[n.toLowerCase()] = layer));
put(0, ["React", "Next.js", "Vite", "Redux", "TypeScript", "JavaScript", "MUI", "Context API", "Tailwind CSS", "Electron"]);
put(1, ["ASP.NET", "ASP.NET Core", "NestJS", "Node.js", "C#", "WebSocket"]);
put(2, ["Oracle", "Oracle 9i", "SQL Server", "MySQL", "MongoDB", "Redis"]);
put(3, ["Render", "Cloudflare", "Cloudflare Tunnel", "Nginx", "PM2", "Linux", "Git"]);
put(4, ["3CX", "Slack", "Slack API", "Salesforce", "Stripe", "Coinbase API", "Lodgify API", "ICS"]);

/** Nomi usati nei progetti → nome della competenza nella scheda (per icona e colore). */
const alias: Record<string, string> = {
	"oracle 9i": "Oracle",
	"slack api": "Slack",
	"cloudflare tunnel": "Cloudflare",
	aspnet: "ASP.NET Core",
	"asp.net": "ASP.NET Core",
};

export interface EcoNode {
	key: string;
	name: string;
	/** nome della competenza nell'inventario, se c'è (per icona e conteggio) */
	skill: string;
	layer: number;
	color: string;
	mark: string;
	/** posizione dentro il proprio anello */
	ring: number;
	slot: number;
	slots: number;
	parent: string | null;
}

export interface EcoMap {
	nodes: EcoNode[];
	rings: number;
}

const skillColor = new Map(skillGroups.flatMap((g) => g.items.map((i) => [i.name, i.color] as const)));
const skillMark = new Map(skillGroups.flatMap((g) => g.items.map((i) => [i.name, i.mark] as const)));
export const layerOf = (name: string) => layerByName[name.toLowerCase()] ?? 1;

/** Costruisce la mappa: tutte le competenze, oppure quelle dello stack di un progetto. */
export function buildEco(mode: string): EcoMap {
	const proj = projects.find((p) => p.id === mode);
	const raw: { name: string; layer: number }[] = proj
		? proj.stack.map((n) => ({ name: n, layer: layerOf(n) }))
		: skillGroups.flatMap((g, i) => g.items.map((s) => ({ name: s.name, layer: i })));

	const used = [...new Set(raw.map((r) => r.layer))].sort((a, b) => a - b);
	const ringOf = new Map(used.map((l, i) => [l, i]));
	const byLayer = new Map<number, typeof raw>();
	raw.forEach((r) => byLayer.set(r.layer, [...(byLayer.get(r.layer) ?? []), r]));

	const nodes: EcoNode[] = [];
	used.forEach((layer) => {
		const list = byLayer.get(layer)!;
		list.forEach((r, slot) => {
			const skill = alias[r.name.toLowerCase()] ?? r.name;
			nodes.push({
				key: `${layer}-${r.name}`,
				name: r.name,
				skill,
				layer,
				color: skillColor.get(skill) ?? LAYER_COLORS[layer],
				mark: skillMark.get(skill) ?? r.name.slice(0, 2),
				ring: ringOf.get(layer)!,
				slot,
				slots: list.length,
				parent: null,
			});
		});
	});

	// da chi riceve i dati: frontend → centro; backend → frontend; database, hosting e servizi → backend (o il livello più vicino)
	const firstOf = (layer: number) => nodes.filter((n) => n.layer === layer);
	nodes.forEach((n) => {
		const wanted = n.layer === 0 ? -1 : n.layer === 1 ? 0 : 1;
		let pool = wanted >= 0 ? firstOf(wanted) : [];
		if (!pool.length && n.layer > 0) {
			for (let l = n.layer - 1; l >= 0 && !pool.length; l--) pool = firstOf(l);
		}
		n.parent = pool.length ? pool[n.slot % pool.length].key : null;
	});
	return { nodes, rings: used.length };
}
