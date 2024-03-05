import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Funzione per rilevare lo scroll e mostrare il bottone
	const toggleVisibility = () => {
		const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
		if (scrolled > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Funzione per scrollare verso l'alto
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	return (
		isVisible && (
			<div onClick={scrollToTop} className="btn btn-sm top-button">
				↑
			</div>
		)
	);
};

export default ScrollToTopButton;
