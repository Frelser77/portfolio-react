import { useEffect, useRef, useState } from "react";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

const SPEAK_MS = 7000;
const HOP_MS = 600;

/**
 * FR7 Bot: un piccolo PC che cammina avanti e indietro.
 * La prima volta che lo disturbi (mouse sopra o tap) si ferma, fa un saltello
 * e spiega il sito per 7 secondi. Dopo non parla più: al massimo salta.
 */
export default function Mascot() {
	const { t } = usePrefs();
	const [talking, setTalking] = useState(false);
	const [hop, setHop] = useState(false);
	const seen = useRef(false);
	const hopping = useRef(false);
	const timers = useRef<number[]>([]);

	useEffect(() => () => timers.current.forEach(clearTimeout), []);

	const doHop = () => {
		if (hopping.current) return;
		hopping.current = true;
		setHop(true);
		timers.current.push(
			window.setTimeout(() => {
				hopping.current = false;
				setHop(false);
			}, HOP_MS),
		);
	};

	const poke = () => {
		if (seen.current) {
			doHop();
			return;
		}
		seen.current = true;
		setTalking(true);
		doHop();
		timers.current.push(window.setTimeout(() => setTalking(false), SPEAK_MS));
	};

	return (
		<div className="stage">
			<div className="bubble-wrap" role="status">
				{talking && <div className="bubble">{t(ui.mascot.bubble)}</div>}
			</div>
			<div className="gnd" />
			<div className={`mascot${talking ? " stop" : ""}${hop ? " hop" : ""}`}>
				<button className="mbtn" type="button" aria-label={t(ui.mascot.label)} onClick={poke} onMouseEnter={poke}>
					<span className="walker">
						<svg viewBox="0 0 160 190" width="140" height="166" aria-hidden="true">
							<ellipse cx="80" cy="184" rx="52" ry="5" fill="#00000066" />
							<g className="body">
								<g className="legL">
									<rect x="48" y="116" width="12" height="42" rx="6" fill="#8fa0ff" />
									<ellipse cx="54" cy="164" rx="15" ry="7" fill="#c4a8ff" />
								</g>
								<g className="legR">
									<rect x="100" y="116" width="12" height="42" rx="6" fill="#8fa0ff" />
									<ellipse cx="106" cy="164" rx="15" ry="7" fill="#c4a8ff" />
								</g>
								<g className="armL">
									<path d="M22 72 L6 94" stroke="#8fa0ff" strokeWidth="8" strokeLinecap="round" />
									<circle cx="6" cy="96" r="6" fill="#c4a8ff" />
								</g>
								<g className="armR">
									<path d="M138 72 L154 94" stroke="#8fa0ff" strokeWidth="8" strokeLinecap="round" />
									<circle cx="154" cy="96" r="6" fill="#c4a8ff" />
								</g>
								<rect x="20" y="8" width="120" height="94" rx="15" fill="#0e1738" stroke="#8fa0ff" strokeWidth="3" />
								<rect x="30" y="18" width="100" height="74" rx="9" fill="#16225f" />
								<g className="eyes">
									<ellipse cx="60" cy="46" rx="9" ry="11" fill="#bfe9ff" />
									<ellipse cx="100" cy="46" rx="9" ry="11" fill="#bfe9ff" />
									<circle cx="62" cy="43" r="3" fill="#0e1738" />
									<circle cx="102" cy="43" r="3" fill="#0e1738" />
								</g>
								<path d="M62 68 Q80 84 98 68" stroke="#bfe9ff" strokeWidth="4" fill="none" strokeLinecap="round" />
								<circle cx="44" cy="64" r="5" fill="#ff9ec4" opacity=".55" />
								<circle cx="116" cy="64" r="5" fill="#ff9ec4" opacity=".55" />
								<rect x="8" y="102" width="144" height="18" rx="9" fill="#1d2a6b" stroke="#8fa0ff" strokeWidth="3" />
								<rect x="62" y="102" width="36" height="6" rx="3" fill="#8fa0ff" />
							</g>
						</svg>
					</span>
				</button>
			</div>
		</div>
	);
}
