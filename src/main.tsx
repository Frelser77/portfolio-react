import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/sora";
import "@fontsource-variable/dm-sans";
import "./styles.css";
import App from "./App";
import { PrefsProvider } from "./prefs";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PrefsProvider>
			<App />
		</PrefsProvider>
	</StrictMode>,
);
