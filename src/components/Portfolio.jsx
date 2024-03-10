import { useState } from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";
import RepoCard from "../components/RepoCard";
import { useSelector } from "react-redux";

const Portfolio = () => {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	// const [isAutoPlay, setIsAutoPlay] = useState(true);
	const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

	const { items: allRepos, status } = useSelector((state) => state.repos);

	// Supponiamo che tu voglia filtrare i repository qui:
	const filteredRepos =
		status === "succeeded"
			? allRepos.filter((repo) =>
					[
						"linkedin-redux",
						"netflix-clone-route",
						"weather_app",
						"Spotify-clone",
						"Spy-Ecommerce",
						"Ecommerce-Esame",
					].includes(repo.name)
			  )
			: [];

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

	return (
		<div className={styles.portfolio}>
			<Container fluid>
				<h4 id="Portfolio" className="text-center mt-2 mb-3 section-title">
					Portfolio
				</h4>
				<Carousel
					swipeable={isTouchDevice}
					draggable={isTouchDevice}
					showDots={true}
					responsive={responsive}
					ssr={true}
					infinite={true}
					autoPlay={true}
					autoPlaySpeed={10000}
					keyBoardControl={true}
					customTransition="all .2"
					transitionDuration={500}
					containerClass="carousel-container"
					removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
					deviceType={isTouchDevice}
					dotListClass="custom-dot-list-style"
					itemClass="carousel-item-padding-40-px"
				>
					{filteredRepos.map((repo, index) =>
						isTouchDevice ? (
							// Per dispositivi touch, sempre visibile
							<div key={repo.id} className={styles.slide}>
								<RepoCard
									repo={repo}
									isHovered={hoveredIndex === index}
									isTouchDevice={isTouchDevice}
									onHover={() => setHoveredIndex(index)}
									onLeave={() => setHoveredIndex(null)}
									formatDate={formatDate}
								/>
							</div>
						) : (
							// Per desktop, usa motion.div per l'animazione
							<motion.div
								key={repo.id}
								className={styles.slide}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(null)}
								animate={hoveredIndex === index ? { scale: 1.1, zIndex: 100 } : { scale: 1 }}
								transition={{ duration: 0.2 }}
							>
								<RepoCard
									repo={repo}
									isHovered={hoveredIndex === index}
									isTouchDevice={isTouchDevice}
									onHover={() => setHoveredIndex(index)}
									onLeave={() => setHoveredIndex(null)}
									formatDate={formatDate}
								/>
							</motion.div>
						)
					)}
				</Carousel>
			</Container>
		</div>
	);
};

export default Portfolio;
