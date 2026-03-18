import { useTranslation } from "react-i18next";
import { IT, GB } from "country-flag-icons/react/3x2";

const LanguageSelector = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="flex gap-2">
			<IT
				onClick={() => changeLanguage("it")}
				style={{ cursor: "pointer", width: "1.5rem", height: "1.5rem" }}
				title="Italiano"
			/>
			<GB
				onClick={() => changeLanguage("en")}
				style={{ cursor: "pointer", width: "1.5rem", height: "1.5rem" }}
				title="English"
			/>
		</div>
	);
};

export default LanguageSelector;
