import "boxicons";
import styles from "./MainComponentSocialIcons.module.css";
import { Container } from "react-bootstrap";
import LanguagesChart from "./LanguagesChart";

const MainComponent = ({ repos }) => {
	return (
		<Container>
			<div className="main">
				<div className="detail">
					<div className="detail">
						<h3 className="h3">{`Hi, I'm`}</h3>
						<h1>
							<span style={{ color: "#7163d4" }}>Salvatore</span> <span className="surname">{` D'Amico `}</span>
						</h1>
						<p>
							{`As a Junior Web Developer, I'm very excited to start my journey in this fantastic world of web development.`}
						</p>
					</div>

					<div className="d-flex align-items-center custom-justify-xs-center gap-4 mt-4">
						<a
							href="https://www.linkedin.com/in/salvatore-alessandro-d-amico-4a1551267/"
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
			<LanguagesChart repos={repos} />
		</Container>
	);
};

export default MainComponent;
