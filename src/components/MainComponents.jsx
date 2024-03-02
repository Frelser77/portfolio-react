import React from "react";
import "boxicons"; // Assicurati di aver importato boxicons nel tuo progetto

const MainComponent = () => {
	return (
		<div className="container">
			<div className="main">
				<div className="detail">
					<h3>Hi, I'm</h3>
					<h1>
						<span style={{ color: "#52489C" }}>Salvatore</span> D'Amico
					</h1>
					<p>
						As a Junior Web Developer, I'm very excited to start my journey in this fantastic world of web development.
					</p>
					<div className="social">
						<a
							href="https://www.linkedin.com/in/salvatore-alessandro-d-amico-4a1551267/"
							style={{ "--socialAni": "1" }}
							target="_blank"
						>
							<i className="bx bxl-linkedin"></i>
						</a>
						<a href="https://github.com/Frelser77" style={{ "--socialAni": "3" }} target="_blank">
							<i className="bx bxl-github"></i>
						</a>
					</div>
				</div>
				<div className="images">
					<img
						src="../img/profilo.png"
						alt="Immagine di me con occhiali da sole e berretto che guardo verso la tua destra, ho indosso una felpa con zip semi aperta e si intravede la maglai e la collana, la foto ha tonalitá bianco e nere."
						className="img-w"
					/>
				</div>
			</div>
		</div>
	);
};

export default MainComponent;
