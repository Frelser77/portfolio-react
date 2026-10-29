import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import OracleCase from "./components/OracleCase";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { usePrefs } from "./prefs";
import { ui } from "./content/ui";

export default function App() {
	const { t } = usePrefs();
	return (
		<>
			<a className="skip-link" href="#main">
				{t(ui.skip)}
			</a>
			<Nav />
			<main id="main" tabIndex={-1}>
				<Hero />
				<Projects />
				<OracleCase />
				<Journey />
				<Contact />
			</main>
			<Footer />
		</>
	);
}
