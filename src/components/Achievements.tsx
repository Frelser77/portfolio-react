import { useEffect, useRef, useState } from "react";
import { FiAward, FiCheck, FiLock, FiX } from "react-icons/fi";
import { ALL, useAchievements, type AchId } from "../achievements";
import { say } from "../bus";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

const find = (id: AchId) => ui.ach.items.find((i) => i.id === id)!;

/** Pulsante con il conteggio degli obiettivi; apre l'elenco. */
export function AchievementsHud() {
	const { t } = usePrefs();
	const got = useAchievements();
	const dlg = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button type="button" className="ico glass hud" onClick={() => dlg.current?.showModal()} title={t(ui.ach.hud)} data-lg-bezel="14">
				<FiAward aria-hidden="true" />
				<b aria-hidden="true">
					{got.size}/{ALL.length}
				</b>
				<span className="sr-only">
					{t(ui.ach.hud)}: {got.size}/{ALL.length}
				</span>
			</button>
			<dialog ref={dlg} className="dlg" aria-labelledby="ach-title" onClick={(e) => e.target === dlg.current && dlg.current?.close()}>
				<div className="dlg__inner">
					<div className="dlg__head">
						<h2 id="ach-title">{t(ui.ach.title)}</h2>
						<button type="button" className="ico" onClick={() => dlg.current?.close()}>
							<FiX aria-hidden="true" />
							<span className="sr-only">{t(ui.nav.close)}</span>
						</button>
					</div>
					<div className="xp" role="progressbar" aria-valuemin={0} aria-valuemax={ALL.length} aria-valuenow={got.size}>
						<i style={{ width: `${(got.size / ALL.length) * 100}%` }} />
					</div>
					<ul className="achlist" role="list">
						{ALL.map((id) => {
							const it = find(id);
							const on = got.has(id);
							return (
								<li key={id} className={on ? "on" : ""}>
									<span aria-hidden="true">{on ? <FiCheck /> : <FiLock />}</span>
									<div>
										<b>{t(it.title)}</b>
										<small>{t(it.text)}</small>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</dialog>
		</>
	);
}

/** Il fumetto "Obiettivo sbloccato" che compare per qualche secondo. */
export function AchievementToasts() {
	const { t } = usePrefs();
	const [queue, setQueue] = useState<{ key: number; id: AchId }[]>([]);
	const key = useRef(0);

	useEffect(() => {
		const onUnlock = (e: Event) => {
			const id = (e as CustomEvent<AchId>).detail;
			const k = ++key.current;
			setQueue((q) => [...q, { key: k, id }]);
			window.setTimeout(() => setQueue((q) => q.filter((x) => x.key !== k)), 4200);
			try {
				const total = JSON.parse(localStorage.getItem("achievements") ?? "[]").length;
				if (total >= ALL.length) window.setTimeout(() => say(t(ui.ach.max)), 1200);
			} catch {
				/* niente */
			}
		};
		window.addEventListener("ach:unlock", onUnlock);
		return () => window.removeEventListener("ach:unlock", onUnlock);
	}, [t]);

	return (
		<div className="toasts" role="status" aria-live="polite">
			{queue.map((q) => {
				const it = find(q.id);
				return (
					<div key={q.key} className="toast-ach glass" data-lg-bezel="18">
						<span aria-hidden="true">
							<FiAward />
						</span>
						<div>
							<small>{t(ui.ach.unlocked)}</small>
							<b>{t(it.title)}</b>
						</div>
					</div>
				);
			})}
		</div>
	);
}
