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

		// Memorizza l'animazione AOS originale per ciascun elemento
		const originalAOSAnimations = {};
		document.querySelectorAll("[data-aos]").forEach((el, index) => {
			originalAOSAnimations[index] = el.getAttribute("data-aos");
		});

		function updateAOSAnimations() {
			const screenWidth = window.innerWidth;
			document.querySelectorAll("[data-aos]").forEach((el, index) => {
				if (screenWidth < 576) {
					// Applica "fade-up" per dispositivi mobili
					el.setAttribute("data-aos", "fade-up");
				} else {
					// Ripristina l'animazione AOS originale quando la larghezza della finestra è >= 576px
					el.setAttribute("data-aos", originalAOSAnimations[index]);
				}
			});
		}

		window.addEventListener("resize", updateAOSAnimations);
		updateAOSAnimations();

		return () => window.removeEventListener("resize", updateAOSAnimations);
	}, []);

	return (
		<>
			<ScrollToTopButton />

			<Container className="my-2">
				<Row className="mt-1 mt-lg-4">
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
