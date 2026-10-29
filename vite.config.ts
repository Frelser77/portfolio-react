import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Indirizzo pubblico del portfolio.
 * Se cambi dominio (o il nome del progetto su Cloudflare Pages) aggiorna solo questa riga:
 * canonical, Open Graph, dati strutturati, sitemap e robots.txt si aggiornano da soli.
 */
const SITE_URL = "https://salvatore-damico.pages.dev";

function siteUrl(): Plugin {
	return {
		name: "site-url",
		transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", SITE_URL),
		generateBundle() {
			const today = new Date().toISOString().slice(0, 10);
			this.emitFile({
				type: "asset",
				fileName: "robots.txt",
				source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
			});
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
			});
		},
	};
}

export default defineConfig({
	plugins: [react(), siteUrl()],
	define: { __SITE_URL__: JSON.stringify(SITE_URL) },
	build: { target: "es2021" },
});
