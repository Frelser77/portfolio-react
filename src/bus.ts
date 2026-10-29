import { navigate } from "./router";

/** Piccolo canale di eventi tra i componenti (guida, configuratore, progetti, contatti). */
export const say = (text: string) => window.dispatchEvent(new CustomEvent("guide:say", { detail: text }));
export const openProject = (id: string) => navigate(`/progetti/${id}`);

export interface PendingBrief {
	need?: string;
	text?: string;
}
let pending: PendingBrief | null = null;
/** Porta ai contatti con il modulo già compilato (anche da un'altra pagina). */
export const pickNeed = (need?: string, text?: string) => {
	pending = { need, text };
	if (window.location.pathname.replace(/\/+$/, "") === "/contatti") {
		window.dispatchEvent(new CustomEvent("brief:need"));
	} else navigate("/contatti");
};
export const takePendingBrief = () => {
	const p = pending;
	pending = null;
	return p;
};
