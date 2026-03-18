/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#7163d4",
				"primary-dark": "#1f252e",
			},
		},
	},
	plugins: [],
};
