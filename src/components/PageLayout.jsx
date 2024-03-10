import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MainComponent from "./MainComponents";
import About from "./About";
import Portfolio from "./Portfolio";
import Footer from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Skills from "./Skills";
import ScrollToTopButton from "./ScrollTopButton";

const PageLayout = () => {
	const [repos, setRepos] = useState([]);

	// useRef per tenere traccia degli elementi da osservare
	const sectionRefs = useRef([]);
	useEffect(() => {
		async function fetchRepos() {
			try {
				const response = await fetch("https://api.github.com/users/Frelser77/repos?per_page=100", {
					headers: {
						Authorization: `token ${import.meta.env.VITE_TOKEN}`,
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const repoData = await response.json();
				const filteredRepos = repoData.filter((repo) =>
					[
						"linkedin-redux",
						"netflix-clone-route",
						"weather_app",
						"Spotify-clone",
						"Spy-Ecommerce",
						"Ecommerce-Esame",
					].includes(repo.name)
				);
				setRepos(filteredRepos);
			} catch (error) {
				console.error("Error fetching repos: ", error);
			}
		}
		fetchRepos();
	}, []);

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
						// Opzionale: rimuovi la classe 'aos-animate' quando l'elemento esce dalla viewport
						// per assicurarti che le animazioni si riavviino la prossima volta
						entry.target.classList.remove("aos-animate");
					}
				});
			},
			{ threshold: 0.1 }
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
					<Col
						xs={12}
						className="mb-5 scroll-snap-section"
						data-aos="fade-right"
						ref={(el) => (sectionRefs.current[0] = el)}
					>
						<MainComponent repos={repos} />
					</Col>
					<Col
						xs={12}
						className="my-2 scroll-snap-section"
						data-aos="fade-left"
						ref={(el) => (sectionRefs.current[1] = el)}
					>
						<About />
					</Col>
					<Col
						xs={12}
						className="my-2 scroll-snap-section"
						data-aos="fade-right"
						ref={(el) => (sectionRefs.current[2] = el)}
					>
						<Skills />
					</Col>
					<div className="d-flex flex-column align-items-center justify-content-between">
						<Col
							xs={12}
							className="my-2 scroll-snap-section"
							data-aos="fade-left"
							ref={(el) => (sectionRefs.current[3] = el)}
						>
							<Portfolio repos={repos} />
						</Col>
						<Col xs={12} className="my-2 scroll-snap-section">
							<Footer />
						</Col>
					</div>
				</Row>
			</Container>
		</>
	);
};

export default PageLayout;
