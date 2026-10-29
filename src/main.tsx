import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
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
