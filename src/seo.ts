import { SITE_URL } from "./content/data";
import type { Lang } from "./content/data";
import { keywords, seoFor } from "./content/seo";

function tag(selector: string, make: () => HTMLElement): HTMLElement {
	let el = document.head.querySelector<HTMLElement>(selector);
	if (!el) {
		el = make();
		document.head.appendChild(el);
	}
	return el;
}
function meta(attr: "name" | "property", key: string, value: string) {
	const el = tag(`meta[${attr}="${key}"]`, () => {
		const m = document.createElement("meta");
		m.setAttribute(attr, key);
		return m;
	}) as HTMLMetaElement;
	el.content = value;
}

/** Aggiorna titolo, descrizione, canonical e anteprime social quando cambia pagina o lingua. */
export function applySeo(path: string, lang: Lang, noindex = false) {
	const { seo, canonical, index } = seoFor(path);
	const origin = SITE_URL || location.origin;
	const url = `${origin}${canonical === "/" ? "/" : canonical}`;
	const img = `${origin}${seo.image}`;
	const title = seo.title[lang];
	const desc = seo.description[lang];
	document.title = title;
	document.documentElement.lang = lang;
	meta("name", "description", desc);
	meta("name", "keywords", keywords[lang].join(", "));
	meta("name", "robots", noindex || !index ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
	(tag('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" })) as HTMLLinkElement).href = url;
	meta("property", "og:type", seo.type ?? "website");
	meta("property", "og:locale", lang === "it" ? "it_IT" : "en_GB");
	meta("property", "og:url", url);
	meta("property", "og:title", title);
	meta("property", "og:description", desc);
	meta("property", "og:image", img);
	meta("property", "og:image:secure_url", img);
	meta("property", "og:image:alt", seo.imageAlt[lang]);
	meta("name", "twitter:title", title);
	meta("name", "twitter:description", desc);
	meta("name", "twitter:image", img);
	meta("name", "twitter:image:alt", seo.imageAlt[lang]);
}
