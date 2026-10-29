import { useEffect } from "react";
import Nav from "./components/Nav";
import Dock from "./components/Dock";
import Footer from "./components/Footer";
import Guide from "./components/Guide";
import World from "./components/World";
import About from "./components/About";
import Skills from "./components/Skills";
import Ecosystem from "./components/Ecosystem";
import GithubLive from "./components/GithubLive";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { AchievementToasts } from "./components/Achievements";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import LabPage from "./pages/LabPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { usePointerFx, useReveal } from "./hooks";
import { initLiquidGlass } from "./liquid";
import { match, usePath, useRouteFocus } from "./router";
import { usePrefs } from "./prefs";
import { ui } from "./content/ui";
import { ui2 } from "./content/ui2";
import { projects } from "./content/data";

function Page({ path }: { path: string }) {
	const r = match(path);
	switch (r.name) {
		case "home":
			return <Home />;
		case "progetti":
			return <Projects />;
		case "progetto":
			return <ProjectPage id={r.id!} />;
		case "stack":
			return (
				<>
					<Skills cards={false} between={<Ecosystem />} />
					<GithubLive />
				</>
			);
		case "lab":
			return <LabPage />;
		case "chi-sono":
			return <About />;
		case "contatti":
			return <Contact />;
		case "admin":
			return <AdminPage />;
		default:
			return <NotFound />;
	}
}

export default function App() {
	const { t, lang } = usePrefs();
	const path = usePath();
	const r = match(path);
	usePointerFx();
	useEffect(() => initLiquidGlass(), []);
	useReveal(path);
	useRouteFocus(path);

	// titolo e meta della pagina corrente
	useEffect(() => {
		const project = r.name === "progetto" ? projects.find((p) => p.id === r.id) : null;
		document.title = project ? `${project.name} · Salvatore D'Amico` : t(ui2.titles[r.name] ?? ui2.titles.home);
		const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
		if (robots) robots.content = r.name === "admin" ? "noindex" : "index, follow";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path, lang]);

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
				<main id="main" tabIndex={-1} key={path} className="page">
					<Page path={path} />
				</main>
				<Footer />
			</div>
			<Dock />
			<Guide />
			<AchievementToasts />
		</div>
	);
}
