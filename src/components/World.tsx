/** Il "mondo" colorato dietro al vetro: sfere lucide che scorrono con parallasse. Posizioni in px (non in % della pagina): così non saltano quando cambia l'altezza del contenuto. Il vetro li rifrange. */
const orbs = [
	{ top: "120px", left: "62%", size: 360, a: "#ff4fa3", b: "#7a2cff", par: 140 },
	{ top: "560px", left: "-6%", size: 300, a: "#3be2ff", b: "#2b5bff", par: 90 },
	{ top: "1080px", left: "78%", size: 260, a: "#ffb13b", b: "#ff3d6e", par: 180 },
	{ top: "1600px", left: "8%", size: 340, a: "#7a5cff", b: "#ff4fa3", par: 120 },
	{ top: "2120px", left: "70%", size: 300, a: "#4dffb0", b: "#1a9bff", par: 160 },
	{ top: "2640px", left: "-4%", size: 280, a: "#ffd23b", b: "#ff6a3d", par: 100 },
	{ top: "3120px", left: "58%", size: 380, a: "#ff4fa3", b: "#3be2ff", par: 130 },
	{ top: "3600px", left: "14%", size: 320, a: "#7a5cff", b: "#4dffb0", par: 170 },
];

export default function World() {
	return (
		<div className="world" aria-hidden="true">
			{orbs.map((o, i) => (
				<i
					key={i}
					className="orb"
					style={
						{
							top: o.top,
							left: o.left,
							width: o.size,
							height: o.size,
							"--a": o.a,
							"--b": o.b,
							"--par": o.par,
							animationDelay: `${-i * 3.1}s`,
						} as React.CSSProperties
					}
				/>
			))}
		</div>
	);
}
