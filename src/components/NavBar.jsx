import { useState, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import "boxicons";
import { Fade } from "react-awesome-reveal";
import { DarkModeContext } from "../context/DarkModeContext"; // Assicurati che il percorso sia corretto
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";

const MyNavbar = () => {
	const { t } = useTranslation();
	const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
	const [expanded, setExpanded] = useState(false);

	const toggleNavbar = () => {
		setExpanded(!expanded);
	};

	return (
		<Navbar expand="lg" expanded={expanded} className="sticky-top">
			<Container>
				<Navbar.Brand href="/">
					<img
						src="../../img/Logo_BW_sm.png"
						alt="Il mio logo personalizzato, con l'icona del coding e le lettere F e R e il numero 7, che sta per Frelser7"
						className="logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} className="border-0">
					<i className={`bx ${expanded ? "bx-x" : "bx-menu"}`} style={{ fontSize: "24px" }}></i>
				</Navbar.Toggle>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/" className="active">
							{t("homenav")}
						</Nav.Link>
						<Nav.Link href="#About">{t("aboutnav")}</Nav.Link>
						<Nav.Link href="#Skills">{t("skillnav")}</Nav.Link>
						<Nav.Link href="#Gestionale">{t("gestionaleNav")}</Nav.Link>{" "}
						<Nav.Link href="#Contact">{t("contactnav")}</Nav.Link>
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
