/** Il "mondo" colorato dietro al vetro: sfere lucide e anelli che scorrono con parallasse. Il vetro li rifrange. */
const orbs = [
	{ top: "3%", left: "62%", size: 360, a: "#ff4fa3", b: "#7a2cff", par: 140 },
	{ top: "14%", left: "-6%", size: 300, a: "#3be2ff", b: "#2b5bff", par: 90 },
	{ top: "27%", left: "78%", size: 260, a: "#ffb13b", b: "#ff3d6e", par: 180 },
	{ top: "40%", left: "8%", size: 340, a: "#7a5cff", b: "#ff4fa3", par: 120 },
	{ top: "53%", left: "70%", size: 300, a: "#4dffb0", b: "#1a9bff", par: 160 },
	{ top: "66%", left: "-4%", size: 280, a: "#ffd23b", b: "#ff6a3d", par: 100 },
	{ top: "78%", left: "58%", size: 380, a: "#ff4fa3", b: "#3be2ff", par: 130 },
	{ top: "90%", left: "14%", size: 320, a: "#7a5cff", b: "#4dffb0", par: 170 },
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
			<i className="ring r1" />
			<i className="ring r2" />
		</div>
	);
}
