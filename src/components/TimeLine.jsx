import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./TimeLine.module.css";
import logosvg from "../../public/img/epicode-svg.svg";
const timelineData = [
	{
		iconClass: "fas fa-home",
		title: "Foundations",
		date: "09th Oct 2023",
		content:
			"Ho iniziato il mio percorso affascinato dall'Html e il css, vedere la nascita di una pagina web è stato emozionante, e ancora era solo l'inizio del mio percorso.",
		readMoreLink:
			"https://www.linkedin.com/posts/salvatore-alessandro-d-amico-4a1551267_ho-appena-finito-il-pre-corso-per-full-stack-development-activity-7117134454703165441-ZpK_?utm_source=share&utm_medium=member_desktop",
		// author: "Homeowner",
		imageUrl: "/img/certificati-epicode/modulo-0.jpeg",
		svgUrl: "/img/epicode-svg.svg", // Assumi che questa sia la tua immagine caricata
	},
	{
		iconClass: "fas fa-home",
		title: "First steps",
		date: "07th Dec 2023",
		content: "Welcome to my cozy home. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		readMoreLink:
			"https://www.linkedin.com/posts/salvatore-alessandro-d-amico-4a1551267_la-dinamicit%C3%A0-e-il-cambiamento-sono-importanti-activity-7140316503425421312-5xf9?utm_source=share&utm_medium=member_desktop",
		// author: "Homeowner",
		imageUrl: "/img/certificati-epicode/modulo-6.jpeg",
		svgUrl: "/img/epicode-svg.svg", // Assumi che questa sia la tua immagine caricata
	},
	{
		iconClass: "fas fa-home",
		title: "Final First Module",
		date: "19th Jan 2024",
		content: "Welcome to my cozy home. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		readMoreLink:
			"https://www.linkedin.com/posts/salvatore-alessandro-d-amico-4a1551267_si-conclude-cos%C3%AC-una-parte-importante-del-activity-7157811699213819904-x8fk?utm_source=share&utm_medium=member_desktop",
		// author: "Homeowner",
		imageUrl: "/img/certificati-epicode/modulo-9.jpeg",
		svgUrl: "/img/epicode-svg.svg", // Assumi che questa sia la tua immagine caricata
	},
	{
		iconClass: "fas fa-home",
		title: "Finish Modules",
		date: "15th Mar 2024",
		content: "Welcome to my cozy home. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		readMoreLink:
			"https://www.linkedin.com/posts/salvatore-alessandro-d-amico-4a1551267_fullstackdevelopment-entityframework-aspnetmvc-activity-7174766284419514368-ILNI?utm_source=share&utm_medium=member_desktop",
		// author: "Homeowner",
		imageUrl: "/img/certificati-epicode/modulo-16.jpg",
		svgUrl: "/img/epicode-svg.svg",
	},
	{
		iconClass: "fas fa-home",
		title: "I'm ready to work",
		date: "25th May 2024",
		content: "Welcome to my cozy home. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		readMoreLink:
			"https://www.linkedin.com/posts/salvatore-alessandro-d-amico-4a1551267_fullstackdevelopment-entityframework-aspnetmvc-activity-7174766284419514368-ILNI?utm_source=share&utm_medium=member_desktop",
		// author: "Homeowner",
		imageUrl: "../../img/placeholder.png",
		svgUrl: "/img/epicode-svg.svg",
	},
];

const TimelineRow = ({ data, index }) => {
	const aosDelay = index * 300;

	// Ora utilizza la variabile aosDelay nel tuo componente
	return (
		<div
			className={`${styles.timelineRow} ${index % 2 === 0 ? styles.timelineRow1 : styles.timelineRow2}`}
			data-aos="fade-up"
			data-aos-delay={aosDelay} // non è necessario .toString(), React lo gestirà
		>
			<section>
				{/* immagine da rendere responsive */}
				<img src={data.imageUrl} alt={data.title} className={`${styles.timeImg} img-fluid`} />
				<i className={`${styles.icon} ${data.iconClass}`}>
					<img src={data.svgUrl || logosvg} alt={data.title} className="img-fluid" />
				</i>
				<div className={styles.details}>
					<span className={styles.title}>{data.title}</span>
					<span className={styles.date}>{data.date}</span>
				</div>
				<p>{data.content}</p>
				<a href={data.readMoreLink} target="_blank" className="btn-hover bn20 undecorated p-2">
					Read more
				</a>
			</section>
		</div>
	);
};

const TimelineWrapper = () => {
	useEffect(() => {
		// Inizializza AOS quando il componente viene montato
		AOS.init({
			duration: 1000, // durata dell'animazione in millisecondi
			once: false, // l'animazione verrà eseguita ogni volta che l'elemento entra nel viewport
			mirror: true, // abilita o disabilita l'animazione sugli elementi già mostrati sullo schermo
		});

		// Funzione per aggiornare AOS ogni volta che avvengono degli scroll
		const handleScroll = () => {
			AOS.refresh();
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className={styles.timelineWrapper}>
			<div className={styles.centerLine}>
				<a href="#top" className={styles.scrollIcon}>
					{" "}
					{/* Assicurati che #top sia un riferimento valido nella tua pagina */}
					<i className="fas fa-caret-up">
						<img src={logosvg} alt="Logo" />
					</i>
				</a>
			</div>
			{timelineData.map((data, index) => (
				<TimelineRow key={index} data={data} index={index} />
			))}
		</div>
	);
};

export default TimelineWrapper;
