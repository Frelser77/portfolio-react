import { useRef, useState } from "react";
import { unlock } from "../achievements";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

/** Una lente di vetro liquido che si trascina sulla pagina e piega davvero quello che c'è dietro. */
export default function Lens() {
	const { t } = usePrefs();
	const ref = useRef<HTMLDivElement>(null);
	const drag = useRef<{ dx: number; dy: number } | null>(null);
	const [moved, setMoved] = useState(false);
	const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

	const onDown = (e: React.PointerEvent) => {
		const el = ref.current;
		if (!el) return;
		const parent = el.offsetParent as HTMLElement;
		const pr = parent.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
		el.setPointerCapture(e.pointerId);
		setPos({ x: r.left - pr.left, y: r.top - pr.top });
		setMoved(true);
		unlock("lens");
		e.preventDefault();
	};
	const onMove = (e: React.PointerEvent) => {
		const el = ref.current;
		if (!drag.current || !el) return;
		const parent = el.offsetParent as HTMLElement;
		const pr = parent.getBoundingClientRect();
		const x = Math.min(pr.width - el.offsetWidth, Math.max(0, e.clientX - pr.left - drag.current.dx));
		const y = Math.min(pr.height - el.offsetHeight, Math.max(0, e.clientY - pr.top - drag.current.dy));
		setPos({ x, y });
	};
	const onUp = () => {
		drag.current = null;
	};

	return (
		<div
			ref={ref}
			className={`glass lens${moved ? " moved" : ""}`}
			data-lg="lens"
			role="img"
			aria-label={t(ui.hero.lensLabel)}
			style={pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onUp}
			onPointerCancel={onUp}
		>
			<span className="lens__hint" aria-hidden="true">
				{t(ui.hero.lens)}
			</span>
		</div>
	);
}
