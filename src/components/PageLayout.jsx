import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MainComponent from "./MainComponents";
import About from "./About";
import Portfolio from "./Portfolio";
import Footer from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Skills from "./Skilss";
import ScrollToTopButton from "./ScrollTopButton";

const PageLayout = () => {
	useEffect(() => {
		AOS.init({
			duration: 2000,
		});
	}, []);

	return (
		<>
			<ScrollToTopButton />

			<Container>
				<Row className="mt-1 mt-lg-4 ms-auto">
					<Col xs={12} className="mb-5" data-aos="fade-right">
						<MainComponent />
					</Col>
					<Col xs={12} className="my-2" data-aos="fade-left">
						<About />
					</Col>
					<Col xs={12} className="my-2" data-aos="fade-right">
						<Skills />
					</Col>
					<Col xs={12} className="my-2" data-aos="fade-left">
						<Portfolio />
					</Col>
				</Row>
				<Row>
					<Col xs={12} className="my-2">
						<Footer />
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default PageLayout;
