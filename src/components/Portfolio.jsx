import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const Portfolio = () => {
	const [repos, setRepos] = useState([]);

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

				// Filtra i repository per nome
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
		<div id="Portfolio" className="mt-2">
			<Container fluid>
				<Row className="g-2">
					{repos.map((repo, index) => (
						<Col key={index} xs={12} lg={6}>
							<Card className="border-0 my-bg h-100 position-relative">
								<div className="position-absolute pstn-archiv">
									<i className="bx bx-archive"></i>
								</div>
								<Card.Body className="d-flex flex-column aling-items-start justify-content-between">
									<div>
										<Card.Title className="fs-4">{repo.name}</Card.Title>
										<Card.Text className="fs-6">{repo.description || "No description"}</Card.Text>
									</div>
									<Card.Link href={repo.html_url} target="_blank" className="nav-link link-hvr">
										View on GitHub
									</Card.Link>
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
