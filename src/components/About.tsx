import { useRef } from "react";
import { FiAward, FiCalendar, FiDownload, FiMapPin, FiNavigation, FiTrendingUp } from "react-icons/fi";
import { certificates, journey, profile, projects, skillGroups } from "../content/data";
import { ui, withAge } from "../content/ui";
import { useCountUp } from "../hooks";
import { usePrefs } from "../prefs";
import AppPager, { usePhone } from "./AppPager";
import QuickProfile from "./QuickProfile";
import Ecosystem from "./Ecosystem";
import { Link } from "../router";
import Certificates, { type CertificatesHandle } from "./Certificates";

function Stat({ value, plus, label }: { value: number; plus?: boolean; label: string }) {
	const { ref, value: v } = useCountUp(value);
	return (
		<li className="stat glass tilt" data-lg-bezel="16">
			<b ref={ref}>
				{v}
				{plus ? "+" : ""}
			</b>
			<span>{label}</span>
		</li>
	);
}

const techCount = skillGroups.reduce((n, g) => n + g.items.length, 0);

export default function About() {
	const { t, lang } = usePrefs();
	const certs = useRef<CertificatesHandle>(null);
	const phone = usePhone();

	const aboutBlock = (
				<div className="about">
					<div>
						<p className="eyebrow">
							<b>04.</b>
							{t(ui.about.eyebrow)}
						</p>
						<h2 id="about-title">{t(ui.about.title)}</h2>
						<p className="muted">{withAge(t(ui.about.text), profile.age)}</p>
						<div className="cvrow">
							<a className="btn glass" href={lang === "it" ? profile.cv : profile.cvEn} download data-lg-bezel="14">
								{t(ui.about.cv)}
								<FiDownload aria-hidden="true" />
							</a>
							<a className="cvother" href={lang === "it" ? profile.cvEn : profile.cv} download>
								{t(ui.about.cvOther)}
							</a>
						</div>
					</div>
					<div className="about__side">
						<div className="tour glass tilt" data-lg-bezel="26">
							<div>
								<h3>{t(ui.tour.title)}</h3>
								<p>{t(ui.tour.text)}</p>
							</div>
							<button type="button" className="btn pri" onClick={() => window.dispatchEvent(new Event("guide:tour"))}>
								{t(ui.tour.cta)}
								<FiNavigation aria-hidden="true" />
							</button>
						</div>
						<ul className="info" role="list">
							<li className="glass" data-lg-bezel="14">
								<FiMapPin aria-hidden="true" />
								{profile.town}
							</li>
							<li className="glass" data-lg-bezel="14">
								<FiCalendar aria-hidden="true" />
								{withAge(t(ui.about.years), profile.age)}
							</li>
							<li className="glass" data-lg-bezel="14">
								<FiTrendingUp aria-hidden="true" />
								{t(ui.about.remote)}
							</li>
						</ul>
					</div>
				</div>

	);
	const statsBlock = (
				<ul className="stats" role="list">
					<Stat value={3} plus label={t(ui.stats.years)} />
					<Stat value={projects.length} label={t(ui.stats.projects)} />
					<Stat value={techCount} label={t(ui.stats.tech)} />
					<Stat value={certificates.length} label={t(ui.stats.certs)} />
				</ul>

	);
	const pathBlock = (
				<div className="path">
					<h3>{t(ui.about.path)}</h3>
					<ol className="steps">
						{journey.map((step, n) => (
							<li key={step.place.it} className="step glass tilt">
								<p className="step__years">
									<span className="lvl">
										{t(ui.lvl)} {journey.length - n}
									</span>
									{t(step.years)}
								</p>
								<h4>{t(step.role)}</h4>
								<p className="step__place">{t(step.place)}</p>
								<p className="step__text">{t(step.text)}</p>
								{step.certificates && (
									<button type="button" className="btn sm glass" data-lg-bezel="12" onClick={() => certs.current?.open()}>
										<FiAward aria-hidden="true" />
										{t(ui.about.certs)}
									</button>
								)}
							</li>
						))}
					</ol>
				</div>
	);
	if (phone)
		return (
			<>
				<AppPager
					panes={[
						{ id: "quick", label: t({ it: "In breve", en: "Quick" }), node: <QuickProfile pathLink={false} /> },
						{ id: "me", label: t({ it: "Storia", en: "Story" }), node: <div className="card">{aboutBlock}</div> },
						{ id: "path", label: t({ it: "Percorso", en: "Path" }), node: <div className="card">{statsBlock}{pathBlock}</div> },
						{ id: "stack", label: "Stack", node: <><Ecosystem /><Link className="btn glass qp__stacklink" to="/stack">{t({ it: "Competenze e GitHub", en: "Skills and GitHub" })}</Link></> },
					]}
				/>
				<Certificates ref={certs} />
			</>
		);
	return (
		<section className="sec" id="chi-sono" aria-labelledby="about-title">
			<div className="card">
				{aboutBlock}
				{statsBlock}
				{pathBlock}
			</div>
			<Certificates ref={certs} />
		</section>
	);
}
