import React from "react";
import "boxicons";
import styles from "./MainComponentSocialIcons.module.css";

const MainComponent = () => {
	return (
		<div className="container">
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

					<div className="d-flex align-items-center gap-4">
						<a
							href="https://www.linkedin.com/in/salvatore-alessandro-d-amico-4a1551267/"
							style={{ "--socialAni": "1" }}
							target="_blank"
							className={styles.socialLinkedin + " " + styles.social}
							rel="noreferrer"
						>
							<span>Linkedin</span>
							<i className="bx bxl-linkedin"></i>
						</a>
						<a
							href="https://github.com/Frelser77"
							style={{ "--socialAni": "3" }}
							target="_blank"
							className={styles.socialGitHub + " " + styles.social}
							rel="noreferrer"
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
		</div>
	);
};

export default MainComponent;
