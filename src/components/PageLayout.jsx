import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MainComponent from "./MainComponents";
import About from "./About";
import Portfolio from "./Portfolio";
import { Fade } from "react-awesome-reveal";
import Footer from "./Footer";

const PageLayout = () => {
	return (
		<Container>
			<Row className="mt-xs-1 mt-lg-4">
				<Col xs={12} className="mb-5">
					<Fade direction="right" triggerOnce>
						<MainComponent />
					</Fade>
				</Col>
				<Col xs={12} className="my-2">
					<Fade direction="left" triggerOnce>
						<About />
					</Fade>
				</Col>
				<Col xs={12} className="my-2">
					<Fade direction="right" triggerOnce>
						<Portfolio />
					</Fade>
				</Col>
				<Footer />
			</Row>
			<Row className="">
				<Col xs={12} className="my-2"></Col>
			</Row>
		</Container>
	);
};

export default PageLayout;
