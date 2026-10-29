import { useEffect, useState } from "react";
import { projects, type Project } from "./content/data";

/** Ordine e visibilità delle schede, scelti dal pannello admin. Senza risposta resta l'ordine di data.ts. */
export interface OrderInfo {
	order: string[];
	hidden: string[];
}

let cache: OrderInfo | null = null;
let pending: Promise<OrderInfo | null> | null = null;

const load = () =>
	(pending ??= fetch("/api/projects")
		.then((r) => (r.ok && (r.headers.get("content-type") ?? "").includes("application/json") ? (r.json() as Promise<OrderInfo>) : null))
		.then((o) => (cache = o && Array.isArray(o.order) ? o : null))
		.catch(() => null));

export function sortProjects(info: OrderInfo | null): Project[] {
	if (!info) return projects;
	const pos = new Map(info.order.map((id, n) => [id, n] as const));
	const hid = new Set(info.hidden);
	return projects
		.filter((p) => !hid.has(p.id))
		.map((p, n) => [p, pos.get(p.id) ?? 1000 + n] as const)
		.sort((a, b) => a[1] - b[1])
		.map(([p]) => p);
}

export function useProjects(): Project[] {
	const [info, setInfo] = useState<OrderInfo | null>(cache);
	useEffect(() => {
		let alive = true;
		load().then((o) => alive && o && setInfo(o));
		return () => {
			alive = false;
		};
	}, []);
	return sortProjects(info);
}
