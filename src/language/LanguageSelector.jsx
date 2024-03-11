import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaRegFlag } from "react-icons/fa"; // Un'icona generica di bandiera
// import { GiItaly } from "react-icons/gi"; // Un'icona che rappresenta l'Italia
import { FaRegCircle } from "react-icons/fa"; // Un cerchio come rappresentazione semplificata

const LanguageSelector = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div>
			<Button onClick={() => changeLanguage("it")} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Italiano" />
			<FaRegCircle
				onClick={() => changeLanguage("en")}
				style={{ cursor: "pointer", fontSize: "1.5rem" }}
				title="English"
			/>
		</div>
	);
};

export default LanguageSelector;
