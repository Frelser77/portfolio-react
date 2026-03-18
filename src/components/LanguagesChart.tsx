import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import Loading from "./Loading";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const LanguagesChart = () => {
	const { t } = useTranslation();
	const { items: repos, status, error } = useAppSelector((state) => state.repos);
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
		<div className="mt-4 mb-3 max-w-7xl mx-auto px-4">
			<div>
				<h3 className="text-center">{t("leanguge-chart")}</h3>
				{status === "loading" && <Loading />}
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
			</div>
		</div>
	);
};

export default LanguagesChart;
