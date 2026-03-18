import { useEffect, useRef, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import type { Particle } from "../types";

const PARTICLE_COUNT = 55;
const CONNECTION_DIST = 140;
const BURST_COUNT = 14;

function randomBetween(a: number, b: number): number {
	return a + Math.random() * (b - a);
}

export default function ParticleBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { darkMode } = useContext(DarkModeContext);
	const darkModeRef = useRef<boolean>(darkMode);
	const particlesRef = useRef<Particle[]>([]);
	const rafRef = useRef<number | null>(null);

	// keep ref in sync so the draw loop always has current value without restart
	useEffect(() => {
		darkModeRef.current = darkMode;
	}, [darkMode]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		/* ── resize ── */
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = document.documentElement.scrollHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		/* ── particle factory ── */
		const makeParticle = (x?: number, y?: number, burst = false): Particle => ({
			x: x ?? randomBetween(0, canvas.width),
			y: y ?? randomBetween(0, canvas.height),
			vx: randomBetween(-0.35, 0.35) * (burst ? 3.5 : 1),
			vy: randomBetween(-0.35, 0.35) * (burst ? 3.5 : 1),
			size: burst ? randomBetween(3, 5.5) : randomBetween(2, 4),
			alpha: burst ? 1 : randomBetween(0.3, 0.75),
			life: burst ? 1 : Infinity, // burst particles fade out
			burst,
		});

		/* ── seed ambient particles ── */
		particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => makeParticle());

		/* ── draw loop ── */
		const draw = () => {
			const w = canvas.width;
			const h = canvas.height;
			const isDark = darkModeRef.current;

			const dotColor = isDark ? "rgba(161,140,255," : "rgba(113,99,212,";
			const lineColor = isDark ? "rgba(161,140,255," : "rgba(113,99,212,";
			const burstColor = isDark ? "rgba(200,180,255," : "rgba(147,51,234,";

			ctx.clearRect(0, 0, w, h);

			const alive = [];

			for (const p of particlesRef.current) {
				// move
				p.x += p.vx;
				p.y += p.vy;

				// fade burst
				if (p.burst) {
					p.life -= 0.022;
					p.alpha = p.life;
					if (p.life <= 0) continue;
				} else {
					// wrap ambient
					if (p.x < 0) p.x = w;
					if (p.x > w) p.x = 0;
					if (p.y < 0) p.y = h;
					if (p.y > h) p.y = 0;
				}

				alive.push(p);
			}
			particlesRef.current = alive;

			// draw connections between ambient particles
			const ambient = alive.filter((p) => !p.burst);
			for (let i = 0; i < ambient.length; i++) {
				for (let j = i + 1; j < ambient.length; j++) {
					const dx = ambient[i].x - ambient[j].x;
					const dy = ambient[i].y - ambient[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < CONNECTION_DIST) {
						const opacity = (1 - dist / CONNECTION_DIST) * 0.22;
						ctx.beginPath();
						ctx.strokeStyle = `${lineColor}${opacity})`;
						ctx.lineWidth = 0.8;
						ctx.moveTo(ambient[i].x, ambient[i].y);
						ctx.lineTo(ambient[j].x, ambient[j].y);
						ctx.stroke();
					}
				}
			}

			// draw dots
			for (const p of alive) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `${p.burst ? burstColor : dotColor}${p.alpha})`;
				ctx.fill();
			}

			rafRef.current = requestAnimationFrame(draw);
		};

		rafRef.current = requestAnimationFrame(draw);

		/* ── click / touch burst ── */
		const spawnBurst = (clientX: number, clientY: number) => {
			const rect = canvas.getBoundingClientRect();
			const scrollY = window.scrollY;
			const x = clientX - rect.left;
			const y = clientY - rect.top + scrollY;
			for (let i = 0; i < BURST_COUNT; i++) {
				particlesRef.current.push(makeParticle(x, y, true));
			}
		};

		const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY);
		const onTouch = (e: TouchEvent) => {
			const t = e.touches[0];
			if (t) spawnBurst(t.clientX, t.clientY);
		};

		window.addEventListener("click", onClick);
		window.addEventListener("touchstart", onTouch, { passive: true });

		// re-measure canvas height when page content changes
		const ro = new ResizeObserver(resize);
		ro.observe(document.documentElement);

		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
			window.removeEventListener("click", onClick);
			window.removeEventListener("touchstart", onTouch);
			ro.disconnect();
		};
	}, []); // run once; darkMode updates via ref

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				inset: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none", // never blocks clicks/scrolls
				zIndex: 0,
			}}
			aria-hidden="true"
		/>
	);
}
