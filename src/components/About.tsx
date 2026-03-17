import { Card, CardBody } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";

const About = () => {
	const { t } = useTranslation();
	const duration = 0.6;
	const initialDelay = 0.2;

	const calculateDelay = (index, duration) => initialDelay + index * (duration + 0.2);

	const paragraphVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: (custom) => ({
			opacity: 1,
			y: 0,
			transition: { delay: custom, duration: duration },
		}),
	};

	// Aggiungi qui i tuoi contenuti tradotti e le chiavi come prima
	const paragraphs = [
		t("paragraph1"),
		t("paragraph2"),
		t("paragraph3"),
		t("paragraph4"),
		t("paragraph5"),
		t("happyHacking"),
	];

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<motion.div
				id="About"
				className="about-container mx-auto"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
			>
				<div className="about-content scroll-snap-section">
					<motion.h2
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
						className="section-title display-2"
					>
						{t("aboutMe")}
					</motion.h2>
					<Card className="border-0">
						<CardBody>
							{paragraphs.map((paragraph, index) => (
								<motion.p
									key={index}
									className={`mt-3 mb-1 ${index === paragraphs.length - 1 ? "special-paragraph" : "paragraph"}`}
									custom={calculateDelay(index, duration)}
									variants={paragraphVariants}
								>
									{paragraph}
								</motion.p>
							))}
						</CardBody>
					</Card>
				</div>
			</motion.div>
		</Suspense>
	);
};

export default About;
