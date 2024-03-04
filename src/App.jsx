import "./App.css";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import MyNavbar from "./components/NavBar";
import PageLayout from "./components/PageLayout";

function App() {
	return (
		<DarkModeProvider>
			<MyNavbar />
			<PageLayout />
		</DarkModeProvider>
	);
}

export default App;
