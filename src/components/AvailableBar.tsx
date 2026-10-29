import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { ui } from "../content/ui";
import { ui2 } from "../content/ui2";
import { Link, usePath } from "../router";
import { usePrefs } from "../prefs";

const KEY = "fr7-avail-closed";

/** Un invito sempre a portata di pollice: disponibile, scrivimi. Si fa da parte mentre scorri e si può chiudere. */
export default function AvailableBar() {
	const { t } = usePrefs();
	const path = usePath();
	const [closed, setClosed] = useState(() => {
		try {
			return sessionStorage.getItem(KEY) === "1";
		} catch {
			return false;
		}
	});
	const [moving, setMoving] = useState(false);

	useEffect(() => {
		let timer = 0;
		let last = window.scrollY;
		const onScroll = () => {
			if (Math.abs(window.scrollY - last) < 3) return;
			last = window.scrollY;
			setMoving(true);
			clearTimeout(timer);
			timer = window.setTimeout(() => setMoving(false), 800);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			clearTimeout(timer);
		};
	}, []);

	if (closed || path.startsWith("/contatti") || path.startsWith("/admin")) return null;
	return (
		<div className={`avail glass${moving ? " away" : ""}`} data-lg-bezel="18">
			<Link to="/contatti" className="avail__go">
				<i aria-hidden="true" />
				<span>{t(ui2.avail.cta)}</span>
			</Link>
			<button
				type="button"
				className="avail__x"
				onClick={() => {
					setClosed(true);
					try {
						sessionStorage.setItem(KEY, "1");
					} catch {
						/* ok */
					}
				}}
				aria-label={t(ui.guide.close)}
			>
				<FiX aria-hidden="true" />
			</button>
		</div>
	);
}
