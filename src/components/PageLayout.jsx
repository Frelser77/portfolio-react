import { useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import MainComponent from "./MainComponents";
import About from "./About";
import Footer from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Skills from "./Skills";
import ScrollToTopButton from "./ScrollTopButton";
import { fetchRepos } from "../redux/reducers/fetchRepo";
import Gestionale from "./Gestionale";

const PageLayout = () => {
	const dispatch = useDispatch();

	const sectionRefs = useRef([]);

	useEffect(() => {
		dispatch(fetchRepos());
	}, [dispatch]);

	useEffect(() => {
		AOS.init({
			duration: 700,
		});

		// Crea un'istanza di IntersectionObserver
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Forza AOS a riconsiderare l'elemento come non animato
						entry.target.classList.remove("aos-animate");
						// Ri-attiva AOS per l'elemento
						AOS.refresh();
					} else {
						// per assicurarti che le animazioni si riavviino la prossima volta
						entry.target.classList.remove("aos-animate");
					}
				});
			},
			{ threshold: 0.1 },
		);

		// Osserva gli elementi referenziati
		sectionRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			// Pulizia: disconnette l'observer
			observer.disconnect();
		};
	}, []);

	return (
		<>
			<ScrollToTopButton />
			<Container className="my-2">
				<Row className="mt-1 mt-lg-4">
					<Col xs={12} className="mb-5" data-aos="fade-right" ref={(el) => (sectionRefs.current[0] = el)}>
						<MainComponent />
					</Col>

					<Col xs={12}>
						<hr className="section-divider" />
					</Col>

					<Col xs={12} className="my-2" data-aos="fade-left" ref={(el) => (sectionRefs.current[1] = el)}>
						<About />
					</Col>

					<Col xs={12}>
						<hr className="section-divider" />
					</Col>

					<Col xs={12} className="my-2" data-aos="fade-right" ref={(el) => (sectionRefs.current[2] = el)}>
						<Skills />
					</Col>

					<Col xs={12}>
						<hr className="section-divider" />
					</Col>

					<Col xs={12} className="mb-2 mt-0" data-aos="fade-up" ref={(el) => (sectionRefs.current[4] = el)}>
						<Gestionale />
					</Col>

					<Col xs={12} className="my-2">
						<Footer />
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default PageLayout;
