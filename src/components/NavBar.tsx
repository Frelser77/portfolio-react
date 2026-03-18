import { useState, useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "boxicons";
import { Fade } from "react-awesome-reveal";
import { DarkModeContext } from "../context/DarkModeContext";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";

const MyNavbar = () => {
	const { t } = useTranslation();
	const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
	const [expanded, setExpanded] = useState(false);
	const navRef = useRef<HTMLElement>(null);

	const closeNav = () => setExpanded(false);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (navRef.current && !navRef.current.contains(e.target as Node)) setExpanded(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		"px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:text-[#7163d4] no-underline" +
		(isActive ? " text-[#7163d4]" : darkMode ? " text-white" : " text-gray-800");

	return (
		<nav
			ref={navRef}
			className="sticky top-0 z-50 shadow-md"
			style={{
				background: darkMode ? "#0d0b1e" : "whitesmoke",
				borderBottom: darkMode ? "1px solid rgba(113,99,212,0.22)" : "none",
			}}
		>
			<div className="max-w-7xl mx-auto px-4 flex items-center h-14">
				<NavLink to="/" onClick={closeNav} className="flex-shrink-0 mr-4">
					<img
						src="../../img/Logo_BW_sm.png"
						alt="Logo Frelser7"
						className="h-8"
						style={darkMode ? { filter: "brightness(0) invert(1)" } : {}}
					/>
				</NavLink>

				<div className="hidden lg:flex items-center gap-1 mr-auto">
					<NavLink to="/" className={linkClass} end onClick={closeNav}>{t("homenav")}</NavLink>
					<NavLink to="/about" className={linkClass} onClick={closeNav}>{t("aboutnav")}</NavLink>
					<NavLink to="/skills" className={linkClass} onClick={closeNav}>{t("skillnav")}</NavLink>
					<NavLink to="/projects" className={linkClass} onClick={closeNav}>{t("gestionaleNav")}</NavLink>
					<NavLink to="/contact" className={linkClass} onClick={closeNav}>{t("contactnav")}</NavLink>
				</div>

				<div className="hidden lg:flex items-center gap-3 ml-auto">
					<label className="cursor-pointer text-xl" style={{ color: darkMode ? "#fff" : "#1f252e" }} onClick={toggleDarkMode}>
						<Fade direction="right" delay={400}>
							<i className={`bx ${darkMode ? "bxs-moon" : "bxs-sun"}`}></i>
						</Fade>
					</label>
					<LanguageSelector />
				</div>

				<label
					className="lg:hidden cursor-pointer text-2xl mr-2 ml-auto"
					style={{ color: darkMode ? "#fff" : "#1f252e" }}
					onClick={toggleDarkMode}
				>
					<i className={`bx ${darkMode ? "bxs-moon" : "bxs-sun"}`}></i>
				</label>
				<button
					className="lg:hidden border-0 bg-transparent text-2xl p-1 cursor-pointer"
					style={{ color: darkMode ? "#fff" : "#1f252e" }}
					onClick={() => setExpanded(!expanded)}
					aria-label="Menu"
				>
					<i className={`bx ${expanded ? "bx-x" : "bx-menu"}`}></i>
				</button>
			</div>

			{expanded && (
				<div
					className="lg:hidden px-4 pb-4 flex flex-col gap-1 border-t"
					style={{ borderColor: "rgba(113,99,212,0.2)", background: darkMode ? "#0d0b1e" : "whitesmoke" }}
				>
					<NavLink to="/" className={linkClass} end onClick={closeNav}>{t("homenav")}</NavLink>
					<NavLink to="/about" className={linkClass} onClick={closeNav}>{t("aboutnav")}</NavLink>
					<NavLink to="/skills" className={linkClass} onClick={closeNav}>{t("skillnav")}</NavLink>
					<NavLink to="/projects" className={linkClass} onClick={closeNav}>{t("gestionaleNav")}</NavLink>
					<NavLink to="/contact" className={linkClass} onClick={closeNav}>{t("contactnav")}</NavLink>
					<div className="pt-2">
						<LanguageSelector />
					</div>
				</div>
			)}
		</nav>
	);
};

export default MyNavbar;
