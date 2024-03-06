import "./App.css";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import MyNavbar from "./components/NavBar";
import PageLayout from "./components/PageLayout";
import HeadComponent from "./components/HeadComponent";
import { HelmetProvider } from "react-helmet-async";

function App() {
	return (
		<HelmetProvider>
			<HeadComponent />
			<DarkModeProvider>
				<MyNavbar />
				<PageLayout />
			</DarkModeProvider>
		</HelmetProvider>
	);
}

export default App;
