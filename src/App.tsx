import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Method from "./components/Method";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Guide from "./components/Guide";
import World from "./components/World";
import { AchievementToasts } from "./components/Achievements";
import { usePointerFx, useReveal } from "./hooks";
import { initLiquidGlass } from "./liquid";
import { useEffect } from "react";
import { usePrefs } from "./prefs";
import { ui } from "./content/ui";

export default function App() {
	const { t } = usePrefs();
	usePointerFx();
	useEffect(() => initLiquidGlass(), []);
	useReveal();
	return (
		<div className="pf" id="top">
			<a className="skip-link" href="#main">
				{t(ui.skip)}
			</a>
			<div className="progress" aria-hidden="true">
				<i />
			</div>
			<div className="aurora" aria-hidden="true">
				<i className="o1" />
				<i className="o2" />
				<i className="o3" />
			</div>
			<World />
			<div className="wrap">
				<Nav />
				<main id="main" tabIndex={-1}>
					<Hero />
					<Method />
					<About />
					<Skills />
					<Projects />
					<Contact />
				</main>
				<Footer />
			</div>
			<Guide />
			<AchievementToasts />
		</div>
	);
}
