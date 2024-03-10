import { useEffect, useState, Suspense } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { Col, Container, Row } from "react-bootstrap";

const LanguagesChart = () => {
	const { items: repos, status, error } = useSelector((state) => state.repos);
	const [languagesData, setLanguagesData] = useState({
		labels: [],
		datasets: [{ label: "Bytes of Code", data: [], backgroundColor: [] }],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === "succeeded" && !error) {
			setLoading(true);
			let languagesStats = {};
			repos.forEach((repo) => {
				const language = repo.language;
				const value = 1; // Consideriamo ogni repo come 1 per semplificare, ma puoi scegliere una metrica differente se disponibile
				languagesStats[language] = (languagesStats[language] || 0) + value;
			});

			setLanguagesData({
				labels: Object.keys(languagesStats),
				datasets: [
					{
						label: "Numero di Repos",
						data: Object.values(languagesStats),
						backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
					},
				],
			});
			setLoading(false);
		}
	}, [repos, status, error]);

	return (
		<Suspense fallback={<Loading />}>
			<Container className="mt-4 mb-3">
				<Row>
					<Col>
						<h3>Linguaggi Utilizzati</h3>
						<div style={{ maxWidth: "600px", maxHeight: "600px" }}>
							{loading && <Loading />}
							{!loading && error && <div>Error fetching data: {error}</div>}
							{!loading && !error && <Bar data={languagesData} options={{ maintainAspectRatio: true }} />}
						</div>
					</Col>
				</Row>
			</Container>
		</Suspense>
	);
};

export default LanguagesChart;
