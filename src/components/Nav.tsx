import { useEffect, useRef, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { usePrefs } from "../prefs";
import { ui } from "../content/ui";

const sections = [
	{ id: "progetti", label: ui.nav.projects },
	{ id: "caso-studio", label: ui.nav.case },
	{ id: "percorso", label: ui.nav.journey },
	{ id: "contatti", label: ui.nav.contact },
];

export default function Nav() {
	const { t, lang, toggleLang, theme, toggleTheme } = usePrefs();
	const [active, setActive] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const menuButton = useRef<HTMLButtonElement>(null);

	// Evidenzia la sezione visibile
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);
		const targets = ["top", ...sections.map((s) => s.id)]
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => !!el);
		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Chiudi il menu mobile con Esc o allargando la finestra
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
				menuButton.current?.focus();
			}
		};
		const mq = window.matchMedia("(min-width: 760px)");
		const onMq = () => mq.matches && setOpen(false);
		window.addEventListener("keydown", onKey);
		mq.addEventListener("change", onMq);
		return () => {
			window.removeEventListener("keydown", onKey);
			mq.removeEventListener("change", onMq);
		};
	}, [open]);

	return (
		<header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
			<div className="nav__inner wrap">
				<a href="#top" className="nav__brand" aria-label="Salvatore D'Amico, home" onClick={() => setOpen(false)}>
					<span className="monogram" aria-hidden="true">
						sd
					</span>
					<span className="nav__name">Salvatore D'Amico</span>
				</a>

				<nav aria-label={lang === "it" ? "Sezioni" : "Sections"} className="nav__links" id="nav-links">
					{sections.map((s) => (
						<a
							key={s.id}
							href={`#${s.id}`}
							aria-current={active === s.id ? "true" : undefined}
							onClick={() => setOpen(false)}
						>
							{t(s.label)}
						</a>
					))}
				</nav>

				<div className="nav__tools">
					<button type="button" className="tool-btn tool-btn--text" onClick={toggleLang} title={t(ui.lang)}>
						<span aria-hidden="true">{lang === "it" ? "EN" : "IT"}</span>
						<span className="sr-only">{t(ui.lang)}</span>
					</button>
					<button
						type="button"
						className="tool-btn"
						onClick={toggleTheme}
						title={theme === "dark" ? t(ui.theme.toLight) : t(ui.theme.toDark)}
					>
						{theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
						<span className="sr-only">{theme === "dark" ? t(ui.theme.toLight) : t(ui.theme.toDark)}</span>
					</button>
					<button
						ref={menuButton}
						type="button"
						className="tool-btn nav__menu-btn"
						aria-expanded={open}
						aria-controls="nav-links"
						onClick={() => setOpen((o) => !o)}
					>
						{open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
						<span className="sr-only">{open ? t(ui.nav.close) : t(ui.nav.menu)}</span>
					</button>
				</div>
			</div>
		</header>
	);
}
