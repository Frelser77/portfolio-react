import { useContext, useEffect, useRef, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { Col, Row, Image } from "react-bootstrap";
import { motion } from "framer-motion";
const html5Icon = "/img/html5_icon.png";
const css3Icon = "/img/css3_icon.png";
const bootstrapIcon = "/img/bootstrap_icon.png";
const jsIcon = "/img/js_icon.png";
const tsIcon = "/img/ts_icon.png";
const sassIcon = "/img/sass_icon.png";
const reactNativeIcon = "/img/react_native_icon.png";
const reduxIcon = "/img/redux_icon.png";
const csharpIcon = "/img/csharp.png";
const aspnetIcon = "/img/aspnet.png";
const sqlserverIcon = "/img/sqlserver.png";
// dark icons
const htmlDarkIcon = "/img/html_dark_icon.png";
const cssDarkIcon = "/img/css_dark_icon.png";
const bootstrapDarkIcon = "/img/bootstrap_dark_icon.png";
const jsDarkIcon = "/img/js_dark_icon.png";
const tsDarkIcon = "/img/ts_dark_icon.png";
const sassDarkIcon = "/img/sass_dark_icon.png";
const reactDarkIcon = "/img/react_dark_icon.png";
const reduxDarkIcon = "/img/redux_dark_icon.png";
const csharpDarkIcon = "/img/csharp_dark_icon.png";
const aspnetDarkIcon = "/img/aspnet_dark_icon.png";
const sqlserverDarkIcon = "/img/sqlserver_dark_icon.png";
import LanguagesChart from "./LanguagesChart";
import { useTranslation } from "react-i18next";
import {
	SiMongodb,
	SiOracle,
	SiMysql,
	SiRedis,
	SiNextdotjs,
	SiNestjs,
	SiTailwindcss,
	SiCloudflare,
	SiNginx,
} from "react-icons/si";
import { FaServer, FaLinux } from "react-icons/fa";

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

const additionalSkills = [
	{ Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
	{ Icon: SiOracle, name: "Oracle", color: "#F80000" },
	{ Icon: SiMysql, name: "MySQL", color: "#4479A1" },
	{ Icon: SiRedis, name: "Redis", color: "#DC382D" },
	{ Icon: SiNextdotjs, name: "Next.js", color: null },
	{ Icon: SiNestjs, name: "NestJS", color: "#E0234E" },
	{ Icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
	{ Icon: SiCloudflare, name: "Cloudflare", color: "#F38020" },
	{ Icon: FaServer, name: "VPS", color: "#7163d4" },
	{ Icon: FaLinux, name: "Linux", color: "#FCC624" },
	{ Icon: SiNginx, name: "Nginx", color: "#009639" },
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
			{ threshold: 0.1 },
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

			<div className="mt-5 pt-3 border-top">
				<h6 className="text-center mb-4 fw-semibold text-uppercase letter-spacing-1">
					{t("newSkillsLabel")}
				</h6>
				<Row xs={3} md={4} lg={6} className="g-4 py-2 mx-auto justify-content-center">
					{additionalSkills.map(({ Icon, name, color }, index) => {
						const iconColor = color ?? (darkMode ? "#ffffff" : "#000000");
						return (
							<Col key={name} className="text-center">
								<motion.div
									className="d-flex flex-column align-items-center gap-2"
									initial={{ opacity: 0, y: 12 }}
									animate={isVisible ? { opacity: 1, y: 0 } : {}}
									transition={{ duration: 0.5, delay: isVisible ? index * 0.08 : 0 }}
								>
									<Icon size={44} color={iconColor} />
									<small className="fw-semibold">{name}</small>
								</motion.div>
							</Col>
						);
					})}
				</Row>
			</div>
		</>
	);
};

export default Skills;
