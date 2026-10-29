import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { usePrefs } from "./prefs";
import { ui } from "./content/ui";

export default function App() {
	const { t } = usePrefs();
	return (
		<div className="pf" id="top">
			<a className="skip-link" href="#main">
				{t(ui.skip)}
			</a>
			<div className="wrap">
				<Nav />
				<main id="main" tabIndex={-1}>
					<Hero />
					<About />
					<Skills />
					<Projects />
					<Contact />
				</main>
				<Footer />
			</div>
		</div>
	);
}
