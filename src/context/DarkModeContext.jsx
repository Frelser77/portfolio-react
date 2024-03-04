import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("darkMode") === "enabled";
	});

	useEffect(() => {
		document.body.className = darkMode ? "dark-mode" : "";
	}, [darkMode]);

	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === "darkMode") {
				setDarkMode(e.newValue === "enabled");
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const toggleDarkMode = () => {
		const newState = !darkMode;
		setDarkMode(newState);
		localStorage.setItem("darkMode", newState ? "enabled" : "disabled");
	};

	return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
};

// Definizione di propTypes per DarkModeProvider
DarkModeProvider.propTypes = {
	children: PropTypes.node,
};
