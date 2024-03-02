import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import "boxicons";

const MyNavbar = () => {
	const [darkMode, setDarkMode] = useState(false);

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

	return (
		<Navbar expand="lg" className="">
			<Container>
				<Navbar.Brand href="#">Logo</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="#" className="active">
							Home
						</Nav.Link>
						<Nav.Link href="#About">About</Nav.Link>
						{/* <Nav.Link href="#Skils">Skills</Nav.Link> */}
						<Nav.Link href="#Portfolio">Portfolio</Nav.Link>
						<Nav.Link href="#Contact">Contact</Nav.Link>
					</Nav>
					<Form inline="true">
						<FormControl type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
						<label htmlFor="darkModeToggle" className="mode">
							<i className="bx bxs-moon"></i>
						</label>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
