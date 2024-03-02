import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const Portfolio = () => {
	const [repos, setRepos] = useState([]);

	useEffect(() => {
		async function fetchRepos() {
			try {
				const response = await fetch("https://api.github.com/users/Frelser77/repos?per_page=100", {
					headers: {
						Authorization: `token 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`,
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
		<div id="Portfolio">
			<h4>Portfolio</h4>
			<Container fluid>
				<Row>
					{repos.map((repo, index) => (
						<Col key={index} sm={12} md={4} lg={6}>
							<Card>
								<Card.Body>
									<Card.Title>{repo.name}</Card.Title>
									<Card.Text>{repo.description || "No description"}</Card.Text>
									<Card.Link href={repo.html_url} target="_blank">
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
