import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import "boxicons";
import { Fade } from "react-awesome-reveal";

const MyNavbar = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
		setDarkMode(isDarkModeEnabled);
		document.body.className = isDarkModeEnabled ? "dark-mode" : "";
	}, []);

	const toggleDarkMode = () => {
		const newState = !darkMode;
		setDarkMode(newState);
		localStorage.setItem("darkMode", newState ? "enabled" : "disabled");
		document.body.className = newState ? "dark-mode" : "";
	};

	const toggleNavbar = () => setExpanded(!expanded);

	return (
		<Navbar expand="lg" expanded={expanded} className="">
			<Container>
				<Navbar.Brand href="#">Logo</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} className="border-0">
					<i className={`bx ${expanded ? "bx-x" : "bx-menu"}`} style={{ fontSize: "24px" }}></i>
				</Navbar.Toggle>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="#" className="active">
							Home
						</Nav.Link>
						<Nav.Link href="#About">About</Nav.Link>
						<Nav.Link href="#Portfolio">Portfolio</Nav.Link>
						<Nav.Link href="#Contact">Contact</Nav.Link>
					</Nav>
					<Form inline="true">
						<FormControl type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
						<label htmlFor="darkModeToggle" className="mode">
							<Fade direction="right" delay={400}>
								<i className="bx bxs-moon"></i>
							</Fade>
						</label>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
