import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Contact() {
	const { t } = usePrefs();
	const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");
	const timer = useRef<number>(0);

	useEffect(() => () => clearTimeout(timer.current), []);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(profile.email);
			setCopy("ok");
		} catch {
			setCopy("fail");
		}
		clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setCopy("idle"), 2400);
	};

	const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(t(ui.contact.waText))}`;

	return (
		<section id="contatti" className="section contact" aria-labelledby="contact-title">
			<div className="wrap">
				<h2 id="contact-title" className="contact__title">
					{t(ui.contact.title)}
				</h2>
				<p className="section__intro">{t(ui.contact.lead)}</p>

				<div className="contact__mail">
					<a href={`mailto:${profile.email}`} className="contact__address">
						{profile.email}
					</a>
					<button type="button" className="tool-btn tool-btn--lg" onClick={copyEmail}>
						{copy === "ok" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
						<span className="sr-only">{t(ui.contact.copy)}</span>
					</button>
					<span className="contact__toast" role="status">
						{copy === "ok" ? t(ui.contact.copied) : copy === "fail" ? t(ui.contact.copyFail) : ""}
					</span>
				</div>

				<ul className="contact__links" role="list">
					<li>
						<a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
							<FaWhatsapp aria-hidden="true" />
							{t(ui.contact.whatsapp)}
						</a>
					</li>
					<li>
						<a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
							<FaLinkedin aria-hidden="true" />
							LinkedIn
						</a>
					</li>
					<li>
						<a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
							<FaGithub aria-hidden="true" />
							GitHub
						</a>
					</li>
					<li>
						<a href={profile.cv} download className="btn btn--ghost">
							<FiDownload aria-hidden="true" />
							{t(ui.contact.cv)}
						</a>
					</li>
				</ul>
				<p className="contact__based">
					{t(ui.contact.based)} {t(profile.location)}
				</p>
			</div>
		</section>
	);
}
