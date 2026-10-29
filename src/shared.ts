/** Tipi e controlli condivisi tra il sito e il Worker (nessun accesso a window qui). */

export type Lang = "it" | "en";

export interface Plan {
	title: string;
	summary: string;
	steps: { title: string; detail: string }[];
	stack: string[];
	weeksMin: number;
	weeksMax: number;
	risks: string[];
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Accetta solo un piano ben formato: tutto ciò che arriva dall'AI passa da qui. */
export function validatePlan(raw: unknown): Plan | null {
	if (!raw || typeof raw !== "object") return null;
	const r = raw as Record<string, unknown>;
	const steps = (Array.isArray(r.steps) ? r.steps : [])
		.map((s) => {
			const o = (s ?? {}) as Record<string, unknown>;
			return { title: str(o.title, 80), detail: str(o.detail, 260) };
		})
		.filter((s) => s.title)
		.slice(0, 6);
	if (steps.length < 2) return null;
	const list = (v: unknown, n: number, m: number) => (Array.isArray(v) ? v.map((x) => str(x, m)).filter(Boolean).slice(0, n) : []);
	let min = Math.round(Number(r.weeksMin));
	let max = Math.round(Number(r.weeksMax));
	if (!Number.isFinite(min) || min < 1) min = 2;
	if (!Number.isFinite(max) || max < min) max = min + 2;
	min = Math.min(min, 40);
	max = Math.min(max, 52);
	const title = str(r.title, 90);
	const summary = str(r.summary, 400);
	if (!title || !summary) return null;
	return { title, summary, steps, stack: list(r.stack, 8, 30), weeksMin: min, weeksMax: max, risks: list(r.risks, 4, 200) };
}

export const PLAN_SCHEMA = {
	type: "object",
	properties: {
		title: { type: "string" },
		summary: { type: "string" },
		steps: {
			type: "array",
			items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] },
		},
		stack: { type: "array", items: { type: "string" } },
		weeksMin: { type: "number" },
		weeksMax: { type: "number" },
		risks: { type: "array", items: { type: "string" } },
	},
	required: ["title", "summary", "steps", "stack", "weeksMin", "weeksMax", "risks"],
} as const;

export interface BriefInput {
	name: string;
	reach: string;
	need: string;
	message: string;
}

export const cleanBrief = (raw: unknown): BriefInput | null => {
	if (!raw || typeof raw !== "object") return null;
	const r = raw as Record<string, unknown>;
	const b = { name: str(r.name, 80), reach: str(r.reach, 120), need: str(r.need, 30), message: String(typeof r.message === "string" ? r.message : "").trim().slice(0, 2000) };
	if (b.message.length < 10 || b.reach.length < 5) return null;
	return b;
};
