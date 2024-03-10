import { useState, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import "boxicons";
import { Fade } from "react-awesome-reveal";
import { DarkModeContext } from "../context/DarkModeContext"; // Assicurati che il percorso sia corretto

const MyNavbar = () => {
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
							Home
						</Nav.Link>
						<Nav.Link href="#About">About</Nav.Link>
						<Nav.Link href="#Skills">Skills</Nav.Link>
						<Nav.Link href="#Portfolio">Portfolio</Nav.Link>
						<Nav.Link href="#Contact">Contact</Nav.Link>
					</Nav>
					<Form inline="true">
						<FormControl type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
						<label htmlFor="darkModeToggle" className="mode">
							<Fade direction="right" delay={400}>
								<i className={`bx ${darkMode ? "bxs-moon" : "bxs-sun"}`}></i>
							</Fade>
						</label>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
