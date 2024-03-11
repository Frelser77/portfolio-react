import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Container, Row, Col } from "react-bootstrap";

const LanguagesChart = () => {
	const { items: repos, status, error } = useSelector((state) => state.repos);
	const [languagesData, setLanguagesData] = useState([]);

	useEffect(() => {
		if (status === "succeeded" && !error) {
			let languagesStats = {};
			repos.forEach((repo) => {
				const language = repo.language || "Unknown";
				const value = 1;
				languagesStats[language] = (languagesStats[language] || 0) + value;
			});

			const formattedData = Object.keys(languagesStats).map((key) => ({
				language: key,
				Repos: languagesStats[key],
			}));

			setLanguagesData(formattedData);
		}
	}, [repos, status, error]);

	return (
		<Container className="mt-4 mb-3">
			<Row>
				<Col>
					<h3 className="text-center">Linguaggi Utilizzati</h3>
					{status === "loading" && <Loading />}
					{status !== "loading" && error && <div>Error fetching data: {error}</div>}
					{status === "succeeded" && !error && (
						<ResponsiveContainer width="100%" height={400}>
							<RadarChart outerRadius={130} data={languagesData}>
								<PolarGrid />
								<PolarAngleAxis dataKey="language" />
								<PolarRadiusAxis angle={30} domain={[0, Math.max(...languagesData.map((data) => data.Repos))]} />
								<Tooltip />
								<Radar name="Tot Repo" dataKey="Repos" stroke="#8071f2" fill="#373168" fillOpacity={0.6} />
							</RadarChart>
						</ResponsiveContainer>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default LanguagesChart;
