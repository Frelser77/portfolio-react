import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MainComponent from "./MainComponents";
import About from "./About";
import Portfolio from "./Portfolio";

const PageLayout = () => {
	return (
		<Container>
			<Row className="my-5">
				<Col xs={12} className="my-2">
					<MainComponent />
				</Col>
				<Col xs={12} className="my-2">
					<About />
				</Col>
				<Col xs={12} className="my-2">
					<Portfolio />
				</Col>
			</Row>
			<Row className="my-5">
				<Col xs={12} className="my-2">
					Contatti/ footer
				</Col>
			</Row>
		</Container>
	);
};

export default PageLayout;
