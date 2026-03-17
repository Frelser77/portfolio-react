import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import HeadComponent from "./components/HeadComponent";
import { HelmetProvider } from "react-helmet-async";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

function App() {
	return (
		<HelmetProvider>
			<HeadComponent />
			<DarkModeProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<RootLayout />}>
							<Route index element={<HomePage />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="/skills" element={<SkillsPage />} />
							<Route path="/projects" element={<ProjectsPage />} />
							<Route path="/contact" element={<ContactPage />} />
							<Route path="*" element={<Navigate to="/" replace />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</DarkModeProvider>
		</HelmetProvider>
	);
}

export default App;
