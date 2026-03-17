import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { DarkModeContextType } from "../types";

export const DarkModeContext = createContext<DarkModeContextType>({
	darkMode: false,
	toggleDarkMode: () => { },
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		return localStorage.getItem("darkMode") === "enabled";
	});

	useEffect(() => {
		document.body.className = darkMode ? "dark-mode" : "";
	}, [darkMode]);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "darkMode") {
				setDarkMode(e.newValue === "enabled");
			}
		};
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const toggleDarkMode = () => {
		const newState = !darkMode;
		setDarkMode(newState);
		localStorage.setItem("darkMode", newState ? "enabled" : "disabled");
	};

	return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
};
