import { useContext, useEffect, useRef, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { Col, Row, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import html5Icon from "/img/html5_icon.png";
import css3Icon from "/img/css3_icon.png";
import bootstrapIcon from "/img/bootstrap_icon.png";
import jsIcon from "/img/js_icon.png";
import tsIcon from "/img/ts_icon.png";
import sassIcon from "/img/sass_icon.png";
import reactNativeIcon from "/img/react_native_icon.png";
import reduxIcon from "/img/redux_icon.png";
import csharpIcon from "/img/csharp.png";
import aspnetIcon from "/img/aspnet.png";
import sqlserverIcon from "/img/sqlserver.png";
//dark icons
import htmlDarkIcon from "/img/html_dark_icon.png";
import cssDarkIcon from "/img/css_dark_icon.png";
import bootstrapDarkIcon from "/img/bootstrap_dark_icon.png";
import jsDarkIcon from "/img/js_dark_icon.png";
import tsDarkIcon from "/img/ts_dark_icon.png";
import sassDarkIcon from "/img/sass_dark_icon.png";
import reactDarkIcon from "/img/react_dark_icon.png";
import reduxDarkIcon from "/img/redux_dark_icon.png";
import csharpDarkIcon from "/img/csharp_dark_icon.png";
import aspnetDarkIcon from "/img/aspnet_dark_icon.png";
import sqlserverDarkIcon from "/img/sqlserver_dark_icon.png";
import LanguagesChart from "./LanguagesChart";
import { useTranslation } from "react-i18next";

const imagesLight = [
	html5Icon,
	css3Icon,
	sassIcon,
	bootstrapIcon,
	jsIcon,
	tsIcon,
	reactNativeIcon,
	reduxIcon,
	csharpIcon,
	aspnetIcon,
	sqlserverIcon,
];

const imagesDark = [
	htmlDarkIcon,
	cssDarkIcon,
	sassDarkIcon,
	bootstrapDarkIcon,
	jsDarkIcon,
	tsDarkIcon,
	reactDarkIcon,
	reduxDarkIcon,
	csharpDarkIcon,
	aspnetDarkIcon,
	sqlserverDarkIcon,
];
const Skills = () => {
	const { t } = useTranslation();
	const { darkMode } = useContext(DarkModeContext);
	const images = darkMode ? imagesLight : imagesDark;
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIsVisible(entry.isIntersecting);
				});
			},
			{ threshold: 0.1 }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref]);

	return (
		<>
			<h4 id="Skills" className="text-center section-title">
				{t("skills")}
			</h4>
			<Row xs={2} md={3} lg={6} className="g-5 py-3 my-1 mx-auto" ref={ref}>
				{images.map((imgSrc, index) => (
					<Col key={index} className="text-center">
						<motion.div
							initial={{ opacity: 0 }}
							animate={isVisible ? { opacity: 1 } : {}}
							transition={{ duration: 1.5, delay: isVisible ? index * 0.2 : 0 }}
						>
							<Image src={imgSrc} alt="Technology icon" fluid className="tec-icon" />
						</motion.div>
					</Col>
				))}
			</Row>
			<LanguagesChart />
		</>
	);
};

export default Skills;
