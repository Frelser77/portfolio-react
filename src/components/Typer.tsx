import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../prefs";

const WORDS = ["React e Next.js", "NestJS e Node.js", "ASP.NET Core", "Oracle e SQL Server", "Cloudflare e Linux", "integrazioni su misura"];
const WORDS_EN = ["React and Next.js", "NestJS and Node.js", "ASP.NET Core", "Oracle and SQL Server", "Cloudflare and Linux", "custom integrations"];

/** Riga decorativa che scrive e cancella le tecnologie; chi preferisce meno movimento vede solo la prima. */
export default function Typer({ lang }: { lang: "it" | "en" }) {
	const words = lang === "it" ? WORDS : WORDS_EN;
	const calm = prefersReducedMotion();
	const [w, setW] = useState(0);
	const [n, setN] = useState(calm ? words[0].length : 0);
	const [erasing, setErasing] = useState(false);

	useEffect(() => {
		if (calm) return;
		const word = words[w % words.length];
		let delay = erasing ? 28 : 62;
		if (!erasing && n === word.length) delay = 1500;
		if (erasing && n === 0) delay = 300;
		const id = window.setTimeout(() => {
			if (!erasing && n < word.length) setN(n + 1);
			else if (!erasing) setErasing(true);
			else if (n > 0) setN(n - 1);
			else {
				setErasing(false);
				setW((x) => x + 1);
			}
		}, delay);
		return () => clearTimeout(id);
	}, [n, erasing, w, words, calm]);

	return (
		<p className="typer" aria-hidden="true">
			<span>{words[w % words.length].slice(0, n)}</span>
			<i className="caret" />
		</p>
	);
}
