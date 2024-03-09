import React, { useState, useEffect, useRef } from "react";
import { Badge, Card, Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";

const Portfolio = () => {
	const [repos, setRepos] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [isAutoPlay, setIsAutoPlay] = useState(true);
	const hoverTimeoutRef = useRef();
	const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

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

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const responsive = {
		desktop: {
			breakpoint: { max: 3000, min: 1025 },
			items: 3,
			slidesToSlide: 1,
		},
		tablet: {
			breakpoint: { max: 1024, min: 569 },
			items: 2,
			slidesToSlide: 1,
		},
		mobile: {
			breakpoint: { max: 568, min: 0 },
			items: 1,
			slidesToSlide: 1,
		},
	};

	const handleInteraction = (index, event) => {
		// Per dispositivi non touch e eventi mouseenter
		if (!isTouchDevice && event.type === "mouseenter") {
			if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = setTimeout(() => {
				setIsAutoPlay(false);
				setHoveredIndex(index);
			}, 500); // Aggiungi un ritardo
		}
		// Per dispositivi touch e eventi touchstart
		else if (isTouchDevice && event.type === "touchstart") {
			// Se l'indice corrente è già selezionato, deselezionalo
			if (hoveredIndex === index) {
				setHoveredIndex(null);
				setIsAutoPlay(true); // Riattiva l'autoplay se nessuna card è espansa
			} else {
				setHoveredIndex(index);
				setIsAutoPlay(false); // Disattiva l'autoplay durante l'interazione con una card
			}
		}
	};

	const handleMouseLeave = () => {
		if (!isTouchDevice) {
			setIsAutoPlay(true);
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
				hoverTimeoutRef.current = null;
			}
			setHoveredIndex(null);
		}
	};

	const handleContainerTouchStart = (event) => {
		// Se non si è toccato una card, chiudi tutte le card espandendo `hoveredIndex` su `null`
		if (!event.target.closest(`.${styles.cardprt}`)) {
			setHoveredIndex(null);
			setIsAutoPlay(true);
		}
	};

	return (
		<div className={styles.portfolio} onTouchStart={handleContainerTouchStart}>
			<Container fluid>
				<h4 id="Portfolio" className="text-center mt-2 mb-3">
					Portfolio
				</h4>
				<Carousel
					swipeable={isTouchDevice}
					draggable={isTouchDevice}
					showDots={true}
					responsive={responsive}
					ssr={true}
					infinite={true}
					autoPlay={isAutoPlay}
					autoPlaySpeed={3000}
					keyBoardControl={true}
					customTransition="all .5"
					transitionDuration={500}
					containerClass="carousel-container"
					removeArrowOnDeviceType={["tablet", "mobile"]}
					dotListClass="custom-dot-list-style"
					itemClass="carousel-item-padding-40-px"
				>
					{repos.map((repo, index) => (
						<motion.div
							key={repo.id}
							className={`${styles.slide} ${hoveredIndex === index ? "active" : ""}`}
							onMouseEnter={!isTouchDevice ? (e) => handleInteraction(index, e) : undefined}
							onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
							onClick={isTouchDevice ? undefined : (e) => handleInteraction(index, e)} // Rimuovi onClick per dispositivi touch
							onTouchStart={isTouchDevice ? (e) => handleInteraction(index, e) : undefined} // Aggiungi onTouchStart per dispositivi touch
							initial={{ scale: 1 }}
							animate={hoveredIndex === index ? { scale: 1.1, zIndex: 100 } : { scale: 1, zIndex: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Card className={`${styles.cardprt} border-0 my-bg h-100 position-relative`}>
								<Card.Img variant="top" src="/img/placeholder.png" alt={repo.name} />
								<Card.Body>
									<Card.Title className="fs-4 text-truncate">{repo.name}</Card.Title>
									<motion.div
										initial={{ maxHeight: 0, opacity: 0 }}
										animate={
											hoveredIndex === index
												? { maxHeight: 250, opacity: 1, zIndex: 100 }
												: { maxHeight: 0, opacity: 0 }
										}
										transition={{ duration: 0.5 }}
										className={styles.additionalContent}
									>
										<Card.Text className="fs-6">{repo.description || "No description available"}</Card.Text>
										<div className="d-flex flex-column align-items-center justify-content-center">
											<Badge className={`${styles.myBadgeCreate} text-black`}>
												First Commit: {formatDate(repo.created_at)}
											</Badge>
											<Badge className={`${styles.myBadgeUpdate} text-black`}>
												Last Update: {formatDate(repo.pushed_at)}
											</Badge>
											<Card.Link href={repo.html_url} target="_blank" className="btn btn-sm btn-primary">
												View on GitHub
											</Card.Link>
										</div>
									</motion.div>
								</Card.Body>
							</Card>
						</motion.div>
					))}
				</Carousel>
			</Container>
		</div>
	);
};

export default Portfolio;
