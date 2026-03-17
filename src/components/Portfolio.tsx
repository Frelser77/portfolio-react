import { useState } from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";
import RepoCard from "../components/RepoCard";
import { useSelector } from "react-redux";
const Portfolio = () => {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

	const { items: allRepos, status } = useSelector((state) => state.repos);

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

	return (
		<div className={styles.portfolio}>
			<Container fluid>
				<h4 id="Portfolio" className="text-center mt-2 mb-3 section-title">
					Portfolio
				</h4>
				<Swiper
					modules={[Autoplay, Pagination, Navigation]}
					spaceBetween={5}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 10000 }}
					breakpoints={{
						// Extra small devices (phones, 600px and down)
						600: {
							slidesPerView: 1,
						},
						// Small devices (portrait tablets and large phones, 600px and up)
						600: {
							slidesPerView: 1,
						},
						// Medium devices (landscape tablets, 768px and up)
						768: {
							slidesPerView: 2,
						},
						// Large devices (laptops/desktops, 992px and up)
						992: {
							slidesPerView: 3,
						},
						// Extra large devices (large laptops and desktops, 1200px and up)
						1200: {
							slidesPerView: 3,
						},
						// XXL devices (larger desktops, 1400px and up)
						1400: {
							slidesPerView: 3,
						},
					}}
				>
					{filteredRepos.map((repo, index) => (
						<SwiperSlide key={repo.id}>
							{isTouchDevice ? (
								<div className={styles.slide}>
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
								<motion.div
									className={styles.slide}
									onMouseEnter={() => setHoveredIndex(index)}
									onMouseLeave={() => setHoveredIndex(null)}
									animate={hoveredIndex === index ? { scale: 1.1, zIndex: 1000 } : { scale: 1, zIndex: 1 }}
									transition={{ duration: 0.2 }}
									style={{ position: "relative" }}
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
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</Container>
		</div>
	);
};

export default Portfolio;
