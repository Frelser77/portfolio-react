import { FiArrowRight, FiDownload } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa6";
import { profile } from "../content/data";
import { usePrefs } from "../prefs";
import { Link } from "../router";

const L = {
	title: { it: "In breve", en: "At a glance" },
	role: { it: "Ruolo", en: "Role" },
	roleV: { it: "Full stack developer", en: "Full stack developer" },
	since: { it: "Nel settore", en: "In the field" },
	sinceV: { it: "dal 2023", en: "since 2023" },
	where: { it: "Dove", en: "Where" },
	whereV: { it: "Oria (BR) o remoto", en: "Oria (Italy) or remote" },
	langs: { it: "Lingue", en: "Languages" },
	langsV: { it: "Italiano, inglese", en: "Italian, English" },
	stack: { it: "Stack principale", en: "Main stack" },
	cv: { it: "Scarica il CV", en: "Download CV" },
	path: { it: "Percorso e attestati", en: "Path and certificates" },
	avail: { it: "Disponibile per un ruolo in azienda e per progetti", en: "Available for a role and for projects" },
};

const STACK = ["React", "Next.js", "TypeScript", "NestJS", "ASP.NET Core", "Oracle", "SQL Server", "Cloudflare"];

/** Tutto quello che un recruiter cerca, in una card: ruolo, da quando, dove, lingue, stack e CV. */
export default function QuickProfile({ pathLink = true }: { pathLink?: boolean }) {
	const { t, lang } = usePrefs();
	const facts: [typeof L.role, typeof L.role][] = [
		[L.role, L.roleV],
		[L.since, L.sinceV],
		[L.where, L.whereV],
		[L.langs, L.langsV],
	];
	return (
		<aside className="qp glass" data-lg="off" aria-labelledby="qp-title">
			<div className="qp__head">
				<span className="qp__av" aria-hidden="true">
					SD
				</span>
				<div>
					<p className="qp__name">{profile.name}</p>
					<h2 id="qp-title" className="qp__title">
						{t(L.title)}
					</h2>
				</div>
			</div>
			<p className="qp__avail">
				<i aria-hidden="true" />
				{t(L.avail)}
			</p>
			<dl className="qp__facts">
				{facts.map(([k, v]) => (
					<div key={k.it}>
						<dt>{t(k)}</dt>
						<dd>{t(v)}</dd>
					</div>
				))}
			</dl>
			<p className="qp__sub">{t(L.stack)}</p>
			<ul className="qp__stack" role="list">
				{STACK.map((s) => (
					<li key={s}>{s}</li>
				))}
			</ul>
			<div className="qp__cta">
				<a className="btn pri" href={lang === "it" ? profile.cv : profile.cvEn} download>
					<FiDownload aria-hidden="true" />
					{t(L.cv)}
				</a>
				<a className="btn glass" href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-lg="off">
					<FaLinkedin aria-hidden="true" />
					LinkedIn
				</a>
			</div>
			{pathLink && (
				<Link className="qp__more" to="/chi-sono">
					{t(L.path)}
					<FiArrowRight aria-hidden="true" />
				</Link>
			)}
		</aside>
	);
}
