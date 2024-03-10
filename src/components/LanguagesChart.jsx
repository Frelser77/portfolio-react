import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const LanguagesChart = ({ repos }) => {
	const [languagesData, setLanguagesData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLanguagesData = async () => {
			let languagesStats = {};
			try {
				setLoading(true);

				for (const repo of repos) {
					const response = await fetch(repo.languages_url, {
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
						},
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch languages data: ${response.statusText}`);
					}

					const data = await response.json();

					for (const [language, value] of Object.entries(data)) {
						languagesStats[language] = (languagesStats[language] || 0) + value;
					}
				}

				setLanguagesData({
					labels: Object.keys(languagesStats),
					datasets: [
						{
							label: "Bytes of Code",
							data: Object.values(languagesStats),
							backgroundColor: [
								"#FF6384",
								"#36A2EB",
								"#FFCE56",
								"#E7E9ED",
								"#4BC0C0",
								// Aggiungi altri colori se necessario
							],
						},
					],
				});
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (repos && repos.length > 0) {
			fetchLanguagesData();
		}
	}, [repos]);

	if (loading) {
		return <div>Loading languages data...</div>;
	}

	if (error) {
		return <div>Error fetching data: {error}</div>;
	}

	return (
		<div>
			<h3>Linguaggi Utilizzati</h3>
			<div style={{ maxWidth: "600px", maxHeight: "600px" }}>
				{languagesData && <Bar data={languagesData} options={{ maintainAspectRatio: true }} />}
			</div>
		</div>
	);
};

export default LanguagesChart;
