import { useState, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
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

	const closeNav = () => setExpanded(false);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		"nav-link" + (isActive ? " active" : "");

	return (
		<Navbar expand="lg" expanded={expanded} className="sticky-top">
			<Container>
				<Navbar.Brand as={NavLink} to="/" onClick={closeNav}>
					<img
						src="../../img/Logo_BW_sm.png"
						alt="Logo Frelser7"
						className="logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} className="border-0">
					<i className={`bx ${expanded ? "bx-x" : "bx-menu"}`} style={{ fontSize: "24px" }}></i>
				</Navbar.Toggle>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto" onClick={closeNav}>
						<NavLink to="/" className={navLinkClass} end>{t("homenav")}</NavLink>
						<NavLink to="/about" className={navLinkClass}>{t("aboutnav")}</NavLink>
						<NavLink to="/skills" className={navLinkClass}>{t("skillnav")}</NavLink>
						<NavLink to="/projects" className={navLinkClass}>{t("gestionaleNav")}</NavLink>
						<NavLink to="/contact" className={navLinkClass}>{t("contactnav")}</NavLink>
					</Nav>
					<Form inline="true" className="d-flex align-items-center justify-content-center gap-2">
						<FormControl type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
						<label htmlFor="darkModeToggle" className="mode">
							<Fade direction="right" delay={400}>
								<i className={`bx ${darkMode ? "bxs-moon" : "bxs-sun"}`}></i>
							</Fade>
						</label>
						<LanguageSelector />
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
