import "./App.css";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import MyNavbar from "./components/NavBar";
import PageLayout from "./components/PageLayout";
import HeadComponent from "./components/HeadComponent";
import { HelmetProvider } from "react-helmet-async";
import ParticleBackground from "./components/ParticleBackground";

function App() {
	return (
		<HelmetProvider>
			<HeadComponent />
			<DarkModeProvider>
				<ParticleBackground />
				<div style={{ position: "relative", zIndex: 1 }}>
					<MyNavbar />
					<PageLayout />
				</div>
			</DarkModeProvider>
		</HelmetProvider>
	);
}

export default App;
