import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiMail, FiSend } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { needs, profile, type Need } from "../content/data";
import { ui } from "../content/ui";
import { unlock } from "../achievements";
import { usePrefs } from "../prefs";
import AppPager, { usePhone } from "./AppPager";
import { useAudience } from "../audience";
import { takePendingBrief } from "../bus";
import { ui2 } from "../content/ui2";
import { getHealth, sendBrief } from "../api";
import { cleanBrief } from "../shared";

type Kind = "job" | "proj" | "collab";
const K = {
	legend: { it: "Che tipo di proposta è?", en: "What kind of proposal is it?" },
	job: {
		label: { it: "Posto in azienda", en: "A job" },
		hint: { it: "Assunzione o contratto", en: "Hiring or contract" },
		msg: { it: "Il ruolo", en: "The role" },
		ph: { it: "Es. sviluppatore full stack React + .NET in un team di 5 persone", en: "E.g. full stack developer, React + .NET, in a team of 5" },
		company: { it: "Azienda", en: "Company" },
		mode: { it: "Modalità", en: "Work mode" },
		any: { it: "Da definire", en: "To be defined" },
	},
	proj: {
		label: { it: "Progetto su misura", en: "A custom project" },
		hint: { it: "Gestionale, sito, integrazione", en: "Management tool, website, integration" },
		msg: ui.contact.msgLabel,
		ph: ui.contact.msgPlaceholder,
	},
	collab: {
		label: { it: "Collaborazione", en: "Collaboration" },
		hint: { it: "Freelance o in team", en: "Freelance or in a team" },
		msg: { it: "Di cosa si tratta?", en: "What is it about?" },
		ph: { it: "Es. supporto backend per tre mesi su un progetto NestJS", en: "E.g. backend support for three months on a NestJS project" },
	},
};
const MODES = {
	office: { it: "In sede", en: "On site" },
	hybrid: { it: "Ibrido", en: "Hybrid" },
	remote: { it: "Da remoto", en: "Remote" },
};

export default function Contact() {
	const { t } = usePrefs();
	const phone = usePhone();
	const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");
	const [need, setNeed] = useState<Need["id"] | null>(null);
	const [msg, setMsg] = useState("");
	const [name, setName] = useState("");
	const [reach, setReach] = useState("");
	const aud = useAudience();
	const [kind, setKind] = useState<Kind>(aud === "proj" ? "proj" : "job");
	const [company, setCompany] = useState("");
	const [mode, setMode] = useState<"" | "office" | "hybrid" | "remote">("");
	const timer = useRef(0);
	const area = useRef<HTMLTextAreaElement>(null);

	useEffect(() => () => clearTimeout(timer.current), []);

	// Da un'altra pagina (configuratore, piano, progetto): preseleziona la voce e scrivi la prima frase
	useEffect(() => {
		const apply = () => {
			const p = takePendingBrief();
			if (!p) return;
			setKind("proj");
			if (p.need) {
				setNeed(p.need as Need["id"]);
				const found = needs.find((n) => n.id === p.need);
				if (found && !p.text) setMsg((m) => (m.trim() ? m : t(found.brief) + " "));
			}
			if (p.text) setMsg((m) => (m.trim() ? m + "\n\n" + p.text : p.text!));
			const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			document.getElementById("brief")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
			window.setTimeout(() => area.current?.focus({ preventScroll: true }), calm ? 0 : 600);
		};
		apply();
		window.addEventListener("brief:need", apply);
		return () => window.removeEventListener("brief:need", apply);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// la prima riga del messaggio dice che tipo di proposta è (così in admin si vede subito)
	const head = [`[${t(K[kind].label)}]`, kind === "job" && company.trim() ? `${t(K.job.company)}: ${company.trim()}` : "", kind === "job" && mode ? `${t(K.job.mode)}: ${t(MODES[mode])}` : ""].filter(Boolean).join(" · ");
	const full = `${head}\n\n${msg.trim()}`;
	const [state, setState] = useState<"idle" | "sending" | "sent" | "fail" | "needReach" | "needMsg">("idle");
	const [canDirect, setCanDirect] = useState(false);
	useEffect(() => {
		let alive = true;
		getHealth().then((h) => alive && setCanDirect(!!h?.brief));
		return () => {
			alive = false;
		};
	}, []);
	const [trap, setTrap] = useState("");
	const direct = async () => {
		const b = cleanBrief({ name, reach, need: kind === "proj" ? (need ?? "") : "", message: full });
		if (!msg.trim() || msg.trim().length < 10) return setState("needMsg");
		if (!b) return setState("needReach");
		setState("sending");
		unlock("send");
		const ok = await sendBrief({ ...b, website: trap });
		setState(ok ? "sent" : "fail");
	};

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

	const picked = kind === "proj" ? needs.find((n) => n.id === need) : undefined;
	const lines = [
		t(ui.contact.hello),
		"",
		head,
		picked ? `${t(picked.title)}.` : "",
		msg.trim(),
		"",
		name.trim() ? `${name.trim()}` : "",
		reach.trim() ? `${t(ui.contact.reach)} ${reach.trim()}` : "",
	].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0));
	const body = lines.join("\n").trim();
	const mail = `mailto:${profile.email}?subject=${encodeURIComponent(`${t(K[kind].label)}${picked ? `: ${t(picked.title)}` : company.trim() ? `: ${company.trim()}` : ""}`)}&body=${encodeURIComponent(body)}`;
	const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(msg.trim() || picked || company.trim() ? body : t(ui.contact.waText))}`;

	const textBlock = (
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

	);
	const formBlock = (
				<form className="glass brief" id="brief" onSubmit={(e) => {
						e.preventDefault();
						if (canDirect) void direct();
					}} data-lg-bezel="26">
					<fieldset className="kinds">
						<legend>{t(K.legend)}</legend>
						<div className="kinds__row">
							{(["job", "proj", "collab"] as Kind[]).map((k) => (
								<button key={k} type="button" className="kind" aria-pressed={kind === k} onClick={() => setKind(k)}>
									<b>{t(K[k].label)}</b>
									<span>{t(K[k].hint)}</span>
								</button>
							))}
						</div>
					</fieldset>
					{kind === "proj" && (
						<fieldset>
							<legend>{t(ui.contact.needLabel)}</legend>
							<div className="cfg__chips scrollrow">
								{needs.map((n) => (
									<button key={n.id} type="button" className="cchip" aria-pressed={need === n.id} onClick={() => setNeed(need === n.id ? null : n.id)}>
										{t(n.title)}
									</button>
								))}
							</div>
						</fieldset>
					)}
					{kind === "job" && (
						<div className="brief__row">
							<label>
								<span>{t(K.job.company)}</span>
								<input type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
							</label>
							<label>
								<span>{t(K.job.mode)}</span>
								<select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
									<option value="">{t(K.job.any)}</option>
									{(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
										<option key={m} value={m}>
											{t(MODES[m])}
										</option>
									))}
								</select>
							</label>
						</div>
					)}
					<label>
						<span>{t(K[kind].msg)}</span>
						<textarea ref={area} rows={4} value={msg} placeholder={t(K[kind].ph)} onChange={(e) => setMsg(e.target.value)} />
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
					<input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} />
					{canDirect && (
						<>
					<div className="brief__send">
						<button type="submit" className="btn pri" disabled={state === "sending"}>
							<FiSend aria-hidden="true" />
							{state === "sending" ? t(ui2.contact.sending) : t(ui2.contact.direct)}
						</button>
					</div>
					<p className={`brief__state ${state}`} role="status">
						{state === "sent" && t(ui2.contact.sent)}
						{state === "fail" && t(ui2.contact.fail)}
						{state === "needReach" && t(ui2.contact.needReach)}
						{state === "needMsg" && t(ui2.contact.needMsg)}
					</p>
							<p className="brief__or">{t(ui2.contact.alt)}</p>
						</>
					)}
					<div className="brief__send">
						<a className="btn glass" href={mail} data-lg-bezel="14" onClick={() => unlock("send")}>
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
	);
	if (phone)
		return (
			<AppPager
				panes={[
					{ id: "brief", label: t({ it: "Scrivimi", en: "Write me" }), node: <div className="card contact">{formBlock}</div> },
					{ id: "who", label: t({ it: "Altri contatti", en: "Other ways" }), node: <div className="card contact">{textBlock}</div> },
				]}
			/>
		);
	return (
		<section className="sec" id="contatti" aria-labelledby="contact-title">
			<div className="card contact">
				{textBlock}
				{formBlock}
			</div>
		</section>
	);
}
