import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, usePrefs } from "../prefs";
import { ui } from "../content/ui";

const SCRIPT = [
	{ cmd: "stack --front", out: "React · Next.js · TypeScript" },
	{ cmd: "stack --back", out: "NestJS · ASP.NET Core · Oracle" },
	{ cmd: "deploy --to cloudflare", out: "✓ online" },
];

/** Mini terminale che scrive da solo i comandi quando entra nello schermo; un clic lo rifà partire. */
export default function Terminal() {
	const { t } = usePrefs();
	const calm = prefersReducedMotion();
	const [done, setDone] = useState<number>(calm ? SCRIPT.length : 0); // righe complete
	const [typed, setTyped] = useState(0); // caratteri del comando in corso
	const [run, setRun] = useState(0);
	const box = useRef<HTMLButtonElement>(null);
	const started = useRef(false);

	const play = useCallback(() => {
		if (calm) return;
		setDone(0);
		setTyped(0);
		setRun((n) => n + 1);
	}, [calm]);

	useEffect(() => {
		if (calm || !box.current) return;
		const observer = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting && !started.current) {
					started.current = true;
					play();
				}
			},
			{ threshold: 0.4 },
		);
		observer.observe(box.current);
		return () => observer.disconnect();
	}, [calm, play]);

	useEffect(() => {
		if (calm || run === 0) return;
		let cancelled = false;
		const timers: number[] = [];
		const wait = (ms: number) => new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));
		(async () => {
			await wait(500);
			for (let i = 0; i < SCRIPT.length; i++) {
				for (let c = 1; c <= SCRIPT[i].cmd.length; c++) {
					if (cancelled) return;
					setTyped(c);
					await wait(34 + Math.random() * 40);
				}
				await wait(260);
				if (cancelled) return;
				setDone(i + 1);
				setTyped(0);
				await wait(380);
			}
		})();
		return () => {
			cancelled = true;
			timers.forEach(clearTimeout);
		};
	}, [run, calm]);

	return (
		<button ref={box} type="button" className="glass code tilt term" onClick={play} aria-hidden="true" tabIndex={-1}>
			<span className="dots">
				<i />
				<i />
				<i />
				<small>{t(ui.terminal.hint)}</small>
			</span>
			<span className="tlines">
				{SCRIPT.map((l, i) => (
					<span key={l.cmd} className={`tl${i <= done ? " on" : ""}`}>
						<span className="tcmd">
							<b>$</b> {i < done ? l.cmd : i === done ? l.cmd.slice(0, typed) : ""}
							{i === done && <i className="caret" />}
						</span>
						{i < done && <span className="tout">{l.out}</span>}
					</span>
				))}
			</span>
		</button>
	);
}
