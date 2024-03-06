import React from "react";
import { Helmet } from "react-helmet-async";

const HeadComponent = () => {
	return (
		<Helmet>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="icon" type="image/svg+xml" href="./img//Logo_icon_2.ico" />
			<link rel="apple-touch-icon" sizes="180x180" href="/img/Logo_BW_sm.png" />
			<meta
				name="description"
				content="Salvatore D'Amico - Full-Stack Junior Developer, specializzato in React. Scopri di più sui miei progetti e competenze."
			/>
			<meta name="keywords" content="Salvatore D'Amico, Frontend Developer, React, Sviluppatore Web" />
			<meta name="author" content="Salvatore Alessandro D'Amico" />
			<meta name="robots" content="index, follow" />
			<meta property="og:title" content="Salvatore D'Amico - Frontend Developer" />
			<meta
				property="og:description"
				content="Frontend Developer specializzato in React. Scopri di più sui miei progetti e competenze."
			/>
			<meta property="og:image" content="/public/img/Logo_BW.png.png" />
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://www.salvodam.it" />
			<link rel="canonical" href="https://www.salvodamico.it/pagina-preferita" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@Frelser7" />
			<meta name="twitter:title" content="Salvatore D'Amico" />
			<meta
				name="twitter:description"
				content="Salvatore D'Amico - Full-Stack Junior Developer, specializzato in React. Scopri di più sui miei progetti e competenze."
			/>
			<meta name="twitter:image" content="https://www.salvodam.it/public/img/Logo_BW.png.png" />
			<title>Salvatore D'Amico</title>
		</Helmet>
	);
};

export default HeadComponent;
