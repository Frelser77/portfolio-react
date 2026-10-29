import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { profile } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Contact() {
	const { t } = usePrefs();
	const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");
	const timer = useRef(0);

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
	const mail = `mailto:${profile.email}`;

	return (
		<section className="sec" id="contatti" aria-labelledby="contact-title">
			<div className="glass card contact">
				<div className="scene">{t(profile.location)}</div>
				<div className="ctext">
					<p className="eyebrow">
						<b>04.</b>
						{t(ui.contact.eyebrow)}
					</p>
					<h2 id="contact-title">{t(ui.contact.title)}</h2>
					<p className="muted">{t(ui.contact.text)}</p>
					<a className="btn pri" href={mail}>
						{t(ui.contact.cta)}
						<FiArrowRight aria-hidden="true" />
					</a>
					<div className="mailrow">
						<a href={mail}>{profile.email}</a>
						<button type="button" className="ico" onClick={copyEmail}>
							{copy === "ok" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
							<span className="sr-only">{t(ui.contact.copy)}</span>
						</button>
						<span className="toast" role="status">
							{copy === "ok" ? t(ui.contact.copied) : copy === "fail" ? t(ui.contact.copyFail) : ""}
						</span>
					</div>
				</div>
				<div className="cbtns">
					<a className="cb" href={mail}>
						<FiMail aria-hidden="true" />
						Email
					</a>
					<a className="cb" href={profile.github} target="_blank" rel="noopener noreferrer">
						<FaGithub aria-hidden="true" />
						GitHub
						<span className="sr-only">({t(ui.projects.newTab)})</span>
					</a>
					<a className="cb" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
						<FaLinkedin aria-hidden="true" />
						LinkedIn
						<span className="sr-only">({t(ui.projects.newTab)})</span>
					</a>
					<a className="cb" href={wa} target="_blank" rel="noopener noreferrer">
						<FaWhatsapp aria-hidden="true" />
						WhatsApp
						<span className="sr-only">({t(ui.projects.newTab)})</span>
					</a>
				</div>
			</div>
		</section>
	);
}
