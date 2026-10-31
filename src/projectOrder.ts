import { useEffect, useState } from "react";
import { projects, type Project } from "./content/data";
import { swr } from "./swr";

/** Ordine e visibilità delle schede, scelti dal pannello admin. Senza risposta resta l'ordine di data.ts. */
export interface OrderInfo {
	order: string[];
	hidden: string[];
}

const listeners = new Set<(o: OrderInfo) => void>();
let cache: OrderInfo | null = null;
let started = false;
const valid = (o: unknown): o is OrderInfo => !!o && Array.isArray((o as OrderInfo).order) && Array.isArray((o as OrderInfo).hidden);

// parte dall'ultimo ordine visto (niente rimescolamento) e controlla la rete al massimo ogni 3 minuti
const start = () => {
	if (started || typeof window === "undefined") return;
	started = true;
	void swr<OrderInfo>("fr7-order", "/api/projects", 30_000, (o) => {
		cache = o;
		listeners.forEach((l) => l(o));
	}, valid);
};
start();

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
		setInfo(cache);
		listeners.add(setInfo);
		return () => {
			listeners.delete(setInfo);
		};
	}, []);
	return sortProjects(info);
}
