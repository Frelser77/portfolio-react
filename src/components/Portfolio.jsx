import { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "./Portfolio.module.css";

const Portfolio = () => {
	const [repos, setRepos] = useState([]);
	const [touchedIndex, setTouchedIndex] = useState(null); // Aggiunto per tracciare l'indice della card toccata

	useEffect(() => {
		async function fetchRepos() {
			try {
				const response = await fetch("https://api.github.com/users/Frelser77/repos?per_page=100", {
					headers: {
						Authorization: `token ${import.meta.env.VITE_TOKEN}`,
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const repoData = await response.json();

				const filteredRepos = repoData.filter((repo) =>
					[
						"linkedin-redux",
						"netflix-clone-route",
						"weather_app",
						"Spotify-clone",
						"Spy-Ecommerce",
						"Ecommerce-Esame",
					].includes(repo.name)
				);

				setRepos(filteredRepos);
			} catch (error) {
				console.error("Error fetching repos: ", error);
			}
		}

		fetchRepos();
	}, []);

	return (
		<div className="mt-2">
			<Container fluid>
				<h4 id="Portfolio" className="text-center mt-2 mb-3 section-title">
					Portfolio
				</h4>
				<Row className="g-2 cards">
					{repos.map((repo, index) => (
						<Col
							key={index}
							xs={12}
							lg={6}
							className="cards-hvr"
							onTouchStart={() => setTouchedIndex(index)} // Aggiungi il tocco iniziale
							onTouchEnd={() => setTouchedIndex(null)} // Rimuovi il tocco quando finisce
						>
							<Card
								className={`${styles.cardprt} border-0 my-bg h-100 position-relative ${
									touchedIndex === index ? "touched" : ""
								}`}
							>
								<div className="position-absolute pstn-archiv">
									<i className="bx bx-archive"></i>
								</div>
								<Card.Body className="d-flex flex-column align-items-start justify-content-between my-bg-card">
									<div>
										<Card.Title className="fs-4">{repo.name}</Card.Title>
										<Card.Text className="fs-6">{repo.description || "No description"}</Card.Text>
									</div>
									<div className="d-flex align-items-start justify-content-between">
										<Card.Link href={repo.html_url} target="_blank" className="btn btn-sm link-hvr">
											View on GitHub
										</Card.Link>
									</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</div>
	);
};

export default Portfolio;
