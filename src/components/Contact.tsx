import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { needs, profile, type Need } from "../content/data";
import { ui } from "../content/ui";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";

export default function Contact() {
	const { t } = usePrefs();
	const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");
	const [need, setNeed] = useState<Need["id"] | null>(null);
	const [msg, setMsg] = useState("");
	const [name, setName] = useState("");
	const [reach, setReach] = useState("");
	const timer = useRef(0);
	const area = useRef<HTMLTextAreaElement>(null);

	useEffect(() => () => clearTimeout(timer.current), []);

	// Dal configuratore: preseleziona la voce, scrivi la prima frase e porta qui
	useEffect(() => {
		const onNeed = (e: Event) => {
			const id = (e as CustomEvent<Need["id"]>).detail;
			setNeed(id);
			const found = needs.find((n) => n.id === id);
			if (found) setMsg((m) => (m.trim() ? m : t(found.brief) + " "));
			const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			document.getElementById("contatti")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
			window.setTimeout(() => area.current?.focus({ preventScroll: true }), calm ? 0 : 700);
		};
		window.addEventListener("brief:need", onNeed);
		return () => window.removeEventListener("brief:need", onNeed);
	}, [t]);

	const copyEmail = async () => {
		unlock("send");
		try {
			await navigator.clipboard.writeText(profile.email);
			setCopy("ok");
		} catch {
			setCopy("fail");
		}
		clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setCopy("idle"), 2400);
	};

	const picked = needs.find((n) => n.id === need);
	const lines = [
		t(ui.contact.hello),
		"",
		picked ? `${t(picked.title)}.` : "",
		msg.trim(),
		"",
		name.trim() ? `${name.trim()}` : "",
		reach.trim() ? `${t(ui.contact.reach)} ${reach.trim()}` : "",
	].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0));
	const body = lines.join("\n").trim();
	const mail = `mailto:${profile.email}?subject=${encodeURIComponent(`${t(ui.contact.subject)}${picked ? `: ${t(picked.title)}` : ""}`)}&body=${encodeURIComponent(body)}`;
	const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(msg.trim() || picked ? body : t(ui.contact.waText))}`;

	return (
		<section className="sec" id="contatti" aria-labelledby="contact-title">
			<div className="card contact">
				<div className="ctext">
					<p className="eyebrow">
						<b>05.</b>
						{t(ui.contact.eyebrow)}
					</p>
					<h2 id="contact-title">{t(ui.contact.title)}</h2>
					<p className="muted">{t(ui.contact.text)}</p>
					<div className="mailrow">
						<a href={`mailto:${profile.email}`}>{profile.email}</a>
						<button type="button" className="ico glass" onClick={copyEmail}>
							{copy === "ok" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
							<span className="sr-only">{t(ui.contact.copy)}</span>
						</button>
						<span className="toast" role="status">
							{copy === "ok" ? t(ui.contact.copied) : copy === "fail" ? t(ui.contact.copyFail) : ""}
						</span>
					</div>
					<div className="cbtns">
						<a className="cb glass" href={profile.github} target="_blank" rel="noopener noreferrer" data-lg-bezel="14">
							<FaGithub aria-hidden="true" />
							GitHub
							<span className="sr-only">({t(ui.projects.newTab)})</span>
						</a>
						<a className="cb glass" href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-lg-bezel="14">
							<FaLinkedin aria-hidden="true" />
							LinkedIn
							<span className="sr-only">({t(ui.projects.newTab)})</span>
						</a>
					</div>
				</div>

				<form className="glass brief" onSubmit={(e) => e.preventDefault()} data-lg-bezel="26">
					<fieldset>
						<legend>{t(ui.contact.needLabel)}</legend>
						<div className="cfg__chips">
							{needs.map((n) => (
								<button key={n.id} type="button" className="cchip" aria-pressed={need === n.id} onClick={() => setNeed(need === n.id ? null : n.id)}>
									{t(n.title)}
								</button>
							))}
						</div>
					</fieldset>
					<label>
						<span>{t(ui.contact.msgLabel)}</span>
						<textarea ref={area} rows={4} value={msg} placeholder={t(ui.contact.msgPlaceholder)} onChange={(e) => setMsg(e.target.value)} />
					</label>
					<div className="brief__row">
						<label>
							<span>{t(ui.contact.nameLabel)}</span>
							<input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
						</label>
						<label>
							<span>{t(ui.contact.reachLabel)}</span>
							<input type="text" autoComplete="email" value={reach} onChange={(e) => setReach(e.target.value)} />
						</label>
					</div>
					<div className="brief__send">
						<a className="btn pri" href={mail} onClick={() => unlock("send")}>
							<FiMail aria-hidden="true" />
							{t(ui.contact.sendMail)}
							<FiArrowRight aria-hidden="true" />
						</a>
						<a className="btn glass" href={wa} target="_blank" rel="noopener noreferrer" data-lg-bezel="14" onClick={() => unlock("send")}>
							<FaWhatsapp aria-hidden="true" />
							{t(ui.contact.sendWa)}
						</a>
					</div>
					<p className="brief__note">{t(ui.contact.note)}</p>
				</form>
			</div>
		</section>
	);
}
