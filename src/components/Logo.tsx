import { useId } from "react";

/**
 * Marchio FR7: le lettere sono tracciate a mano come linee continue, con un gradiente che scorre
 * e una scintilla (un qubit) che gira intorno al segno. Si disegna da solo al caricamento.
 */
export default function Logo({ small = false }: { small?: boolean }) {
	const id = useId().replace(/:/g, "");
	return (
		<svg className={`logo${small ? " logo--s" : ""}`} viewBox="0 0 132 44" role="img" aria-label="FR7" focusable="false">
			<defs>
				<linearGradient id={`g${id}`} x1="0" y1="0" x2="132" y2="0" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#7fe3ff" />
					<stop offset="0.5" stopColor="#a58cff" />
					<stop offset="1" stopColor="#ff9ad5" />
					<animateTransform attributeName="gradientTransform" type="translate" values="-60 0;60 0;-60 0" dur="7s" repeatCount="indefinite" />
				</linearGradient>
			</defs>
			<g fill="none" stroke={`url(#g${id})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
				<path className="logo__p" pathLength="1" d="M20 36V9h19M20 21.5h15" />
				<path className="logo__p" pathLength="1" d="M50 36V9h13a8.5 8.5 0 0 1 0 17H50M63 26l10 10" />
				<path className="logo__p" pathLength="1" d="M82 9h22L91 36" />
			</g>
			<circle className="logo__dot" cx="113" cy="33" r="3.2" fill="#9fe9ff" />
			<circle className="logo__spark" r="2" fill="#fff" />
		</svg>
	);
}
