import type { CSSProperties, ReactNode } from "react";

/** Parallelepipedo 3D fatto di sei facce CSS. Il centro è nell'origine del suo contenitore. */
function Box({ w, h, d, c, front, children, className = "" }: { w: number; h: number; d: number; c: string; front?: ReactNode; className?: string; children?: ReactNode }) {
	const style = { "--w": `${w}px`, "--h": `${h}px`, "--d": `${d}px`, "--c": c } as CSSProperties;
	return (
		<div className={`bx ${className}`} style={style}>
			<div className="fc fr">{front}</div>
			<div className="fc bk" />
			<div className="fc lf" />
			<div className="fc rt" />
			<div className="fc tp" />
			<div className="fc bt" />
			{children}
		</div>
	);
}

/**
 * FR7 Bot in 3D vero: ogni parte è un solido CSS con prospettiva.
 * Il padre imposta le variabili --hx/--hy (testa) e --bx/--by (corpo) per farlo guardare il cursore.
 */
export default function Bot3D() {
	return (
		<div className="bot3d" aria-hidden="true">
			<div className="bot-shadow" />
			<div className="bot-float">
				<div className="rig">
					{/* gambe */}
					<div className="part" style={{ transform: "translate(-14px, 24px)" }}>
						<div className="swing legL">
							<div className="limb" style={{ transform: "translateY(15px)" }}>
								<Box w={16} h={30} d={16} c="#7d8cff" />
								<div className="part" style={{ transform: "translate(0, 17px)" }}>
									<Box w={20} h={9} d={28} c="#c4a8ff" className="shoe" />
								</div>
							</div>
						</div>
					</div>
					<div className="part" style={{ transform: "translate(14px, 24px)" }}>
						<div className="swing legR">
							<div className="limb" style={{ transform: "translateY(15px)" }}>
								<Box w={16} h={30} d={16} c="#7d8cff" />
								<div className="part" style={{ transform: "translate(0, 17px)" }}>
									<Box w={20} h={9} d={28} c="#c4a8ff" className="shoe" />
								</div>
							</div>
						</div>
					</div>

					{/* busto */}
					<Box
						w={58}
						h={50}
						d={36}
						c="#5d73ff"
						front={
							<div className="chest">
								<b>FR7</b>
								<span>
									<i />
									<i />
									<i />
								</span>
							</div>
						}
					/>

					{/* braccia */}
					<div className="part" style={{ transform: "translate(-38px, -18px)" }}>
						<div className="swing armL">
							<div className="limb" style={{ transform: "translateY(17px)" }}>
								<Box w={13} h={36} d={13} c="#8b5cf6" />
							</div>
						</div>
					</div>
					<div className="part" style={{ transform: "translate(38px, -18px)" }}>
						<div className="swing armR">
							<div className="limb" style={{ transform: "translateY(17px)" }}>
								<Box w={13} h={36} d={13} c="#8b5cf6" />
							</div>
						</div>
					</div>

					{/* testa */}
					<div className="part head">
						<Box
							w={74}
							h={58}
							d={58}
							c="#7186ff"
							front={
								<div className="screen">
									<div className="eyes">
										<i />
										<i />
									</div>
									<div className="mouth" />
									<em className="cheek l" />
									<em className="cheek r" />
								</div>
							}
						>
							<div className="part" style={{ transform: "translate(-41px, 0)" }}>
								<Box w={9} h={24} d={24} c="#c4a8ff" />
							</div>
							<div className="part" style={{ transform: "translate(41px, 0)" }}>
								<Box w={9} h={24} d={24} c="#c4a8ff" />
							</div>
							<div className="part" style={{ transform: "translateY(-37px)" }}>
								<Box w={4} h={16} d={4} c="#b9c2e6" />
							</div>
							<div className="part" style={{ transform: "translateY(-51px)" }}>
								<Box w={11} h={11} d={11} c="#6fe3a0" className="bulb" />
							</div>
						</Box>
					</div>
				</div>
			</div>
		</div>
	);
}
