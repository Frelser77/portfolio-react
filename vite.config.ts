import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom"],
					router: ["react-router-dom"],
					"redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
					motion: ["framer-motion"],
					bootstrap: ["bootstrap", "react-bootstrap"],
					swiper: ["swiper"],
					charts: ["recharts"],
					icons: ["react-icons"],
				},
			},
		},
	},
});
