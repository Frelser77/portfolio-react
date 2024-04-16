import "boxicons";
import styles from "./MainComponentSocialIcons.module.css";
import { Container } from "react-bootstrap";
import LanguagesChart from "./LanguagesChart";
import { useTranslation } from "react-i18next";

const MainComponent = () => {
	const { t } = useTranslation();

	return (
		<Container>
			<div className="main">
				<div className="detail">
					<div className="detail">
						<h3 className="h3">{t("intro")}</h3>
						<h1>
							<span style={{ color: "#7163d4" }}>{t("fullName")}</span>
						</h1>
						<p>{t("juniorWebDeveloper")}</p>
					</div>

					<div className="d-flex align-items-center custom-justify-xs-center gap-4 mt-4">
						<a
							href="https://www.linkedin.com/in/salvatore-dam/"
							style={{ "--socialAni": "1" }}
							target="_blank"
							className={styles.socialLinkedin + " " + styles.social + " " + "social socialLinkedin"}
							rel="noreferrer"
							title="Link to my LinkedIn profile"
						>
							<span>Linkedin</span>
							<i className="bx bxl-linkedin"></i>
						</a>
						<a
							href="https://github.com/Frelser77"
							style={{ "--socialAni": "3" }}
							target="_blank"
							className={styles.socialGitHub + " " + styles.social + " " + "social socialGitHub"}
							rel="noreferrer"
							title="Link to my GitHub profile"
						>
							<span>GitHub</span>
							<i className="bx bxl-github"></i>
						</a>
					</div>
				</div>
				<div className="images">
					<img
						src="../img/profilo.png"
						alt="Immagine di me con occhiali da sole e berretto che guardo verso la tua destra, ho indosso una felpa con zip semi aperta e si intravede la maglia e la collana, la foto ha tonalitá bianco e nere."
						className="img-w"
					/>
				</div>
			</div>
		</Container>
	);
};

export default MainComponent;
