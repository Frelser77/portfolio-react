/** Piccolo canale di eventi tra i componenti (guida, configuratore, progetti, contatti). */
export const say = (text: string) => window.dispatchEvent(new CustomEvent("guide:say", { detail: text }));
export const openProject = (id: string) => window.dispatchEvent(new CustomEvent("project:open", { detail: id }));
export const pickNeed = (id: string) => window.dispatchEvent(new CustomEvent("brief:need", { detail: id }));
