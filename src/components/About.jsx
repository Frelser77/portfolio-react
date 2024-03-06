import { Card, CardBody } from "react-bootstrap";
import { motion } from "framer-motion";

const About = () => {
	// Durata dell'animazione per ogni paragrafo
	const duration = 0.6;
	// Delay iniziale prima che inizi la prima animazione
	const initialDelay = 0.2;

	// Calcola il delay in base alla posizione dell'elemento nell'array
	const calculateDelay = (index, duration) => initialDelay + index * (duration + 0.2);

	// Definisci le varianti per le animazioni dei paragrafi
	const paragraphVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: (custom) => ({
			opacity: 1,
			y: 0,
			transition: { delay: custom, duration: duration },
		}),
	};

	// Testi dei paragrafi da animare
	const paragraphs = [
		"I am a passionate frontend developer experienced in React, JavaScript, and other modern frameworks.",
		"I am dedicated to crafting smooth and interactive user experiences. In my free time, I love to explore new technologies and work on personal projects that challenge me to improve my skills.",
		"Throughout my academic journey, I have also learned to use backend technologies like ASP.NET with C#.",
		"I am particularly passionate about frontend development because of the immediate results it delivers and the beauty of graphic details. I am also fascinated by SEO and optimization.",
		"On the other hand, backend development is not far behind; being able to develop a personal database to store data necessary for the operation of an app or website, building APIs that interact with our database and return the response to the frontend, all after numerous validations and checks, makes me realize how much I could achieve over time with consistency, dedication, and especially a lot of curiosity!",
		"Happy hacking!",
	];

	return (
		<motion.div
			id="About"
			className="about-container mx-auto"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
		>
			<div className="about-content">
				<motion.h2
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.3 }}
					className="section-title display-2"
				>
					About me
				</motion.h2>
				<Card className="border-0">
					<CardBody>
						{paragraphs.map((text, index) => (
							<motion.p
								key={index}
								className={`mt-3 mb-1 ${index === paragraphs.length - 1 ? "special-paragraph" : "paragraph"}`}
								custom={calculateDelay(index, duration)}
								variants={paragraphVariants}
							>
								{text}
							</motion.p>
						))}
					</CardBody>
				</Card>
			</div>
		</motion.div>
	);
};

export default About;
