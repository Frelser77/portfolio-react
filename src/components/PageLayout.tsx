import { useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks/redux";
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
	const dispatch = useAppDispatch();

	const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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
			<div className="max-w-7xl mx-auto px-4 my-2">
				<div className="mt-1 lg:mt-4">
					<div className="mb-5" data-aos="fade-right" ref={(el) => (sectionRefs.current[0] = el)}>
						<MainComponent />
					</div>

					<hr className="section-divider" />

					<div className="my-2" data-aos="fade-left" ref={(el) => (sectionRefs.current[1] = el)}>
						<About />
					</div>

					<hr className="section-divider" />

					<div className="my-2" data-aos="fade-right" ref={(el) => (sectionRefs.current[2] = el)}>
						<Skills />
					</div>

					<hr className="section-divider" />

					<div className="mb-2 mt-0" data-aos="fade-up" ref={(el) => (sectionRefs.current[4] = el)}>
						<Gestionale />
					</div>

					<div className="my-2">
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};

export default PageLayout;
