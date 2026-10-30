import { useMemo, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiArrowRight, FiBox, FiCloud, FiDatabase, FiLayout, FiLink, FiServer } from "react-icons/fi";
import { icons } from "../content/icons";
import { unlock } from "../achievements";
import { certificates, profile, projects, skillGroups } from "../content/data";
import { openProject } from "../bus";
import { Link } from "../router";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

const bagIcons: IconType[] = [FiLayout, FiServer, FiDatabase, FiCloud, FiLink];
const bagColors = ["#b08cff", "#6aa2ff", "#ffb347", "#6fe3a0", "#ff8fd0"];

const norm = (s: string) => s.toLowerCase().replace(/[\s.]/g, "");
/** Missioni (progetti) che usano davvero una tecnologia, ricavate dagli stack dei progetti. */
const usage = (name: string) => {
	const k = norm(name.replace(" Core", ""));
	return projects.filter((p) => p.stack.some((s) => norm(s).includes(k) || k.includes(norm(s))));
};

/** Scheda personaggio + inventario: le competenze come oggetti, con dettaglio dei progetti dove le ho usate. */
export default function Skills({ between, cards = true }: { between?: ReactNode; cards?: boolean }) {
	const { t } = usePrefs();
	const [bag, setBag] = useState(0);
	const [sel, setSel] = useState(skillGroups[0].items[0].name);
	const visited = useRef(new Set([0]));

	const group = skillGroups[bag];
	const skill = group.items.find((s) => s.name === sel) ?? group.items[0];
	const used = useMemo(() => usage(skill.name), [skill.name]);
	const Icon = icons[skill.name];

	const openBag = (i: number) => {
		setBag(i);
		setSel(skillGroups[i].items[0].name);
		visited.current.add(i);
		if (visited.current.size === skillGroups.length) unlock("bag");
	};

	return (
		<section className="sec" id="competenze" aria-labelledby="skills-title">
			<div className="card">
				<div className="sheet glass tilt" data-lg-bezel="28">
					<div className="sheet__who">
						<span className="avatar" aria-hidden="true">
							FR7
						</span>
						<div>
							<p className="eyebrow">
								<b>02.</b>
								{t(ui.skills.eyebrow)}
							</p>
							<h2 id="skills-title">{t(ui.skills.title)}</h2>
							<p className="sheet__class">
								Salvatore D'Amico · {t(ui.skills.class)} · <b>{profile.age} {t(ui.skills.level)}</b>
							</p>
						</div>
					</div>
					<ul className="sheet__stats" role="list">
						<li>
							<b>3+</b> {t(ui.skills.exp)}
						</li>
						<li>
							<b>{projects.length}</b> {t(ui.skills.quests)}
						</li>
						<li>
							<b>{certificates.length}</b> {t(ui.about.certsShort)}
						</li>
					</ul>
					<div className="xp" aria-hidden="true">
						<i className="xp__fill" />
					</div>
				</div>

				{between}

				{cards && (
					<>
				<p className="muted">{t(ui.skills.text)}</p>

				<div className="inv">
					<div className="inv__main">
						<div className="bags" role="tablist" aria-label={t(ui.skills.type)}>
							{skillGroups.map((g, i) => {
								const BagIcon = bagIcons[i];
								return (
									<button
										key={g.title.it}
										type="button"
										role="tab"
										id={`bag-${i}`}
										aria-selected={bag === i}
										aria-controls="slots"
										className="bagtab glass"
										data-lg-bezel="14"
										style={{ ["--c" as string]: bagColors[i] }}
										onClick={() => openBag(i)}
									>
										<BagIcon aria-hidden="true" />
										{t(g.title)}
									</button>
								);
							})}
						</div>
						<ul id="slots" className="slots" role="tabpanel" aria-labelledby={`bag-${bag}`} key={bag}>
							{group.items.map((s, i) => {
								const I = icons[s.name] ?? FiBox;
								return (
									<li key={s.name} style={{ ["--i" as string]: i }}>
										<button
											type="button"
											className="slot glass tilt"
											data-lg-bezel="18"
											aria-pressed={sel === s.name}
											style={{ ["--c" as string]: s.color }}
											onClick={() => setSel(s.name)}
										>
											<I aria-hidden="true" />
											<span>{s.name}</span>
										</button>
									</li>
								);
							})}
						</ul>
					</div>

					<aside className="item glass" data-lg-bezel="26" aria-live="polite" style={{ ["--c" as string]: skill.color }}>
						<div className="item__ico" aria-hidden="true">
							{Icon ? <Icon /> : <FiBox />}
						</div>
						<h3>{skill.name}</h3>
						<p className="item__type">
							{t(ui.skills.type)}: {t(group.title)}
						</p>
						{used.length > 0 ? (
							<>
								<p className="item__used">
									{t(ui.skills.usedIn)} <b>{used.length}</b> {t(ui.skills.missions)}
								</p>
								<ul className="item__list" role="list">
									{used.map((p) => (
										<li key={p.id}>
											<button type="button" className="link" onClick={() => openProject(p.id)}>
												{p.name}
												<FiArrowRight aria-hidden="true" />
											</button>
										</li>
									))}
								</ul>
							</>
						) : (
							<p className="item__used">{t(ui.skills.daily)}</p>
						)}
					</aside>
				</div>

				<Link className="btn glass" to="/progetti" data-lg-bezel="14">
					{t(ui.skills.cta)}
					<FiArrowRight aria-hidden="true" />
				</Link>
					</>
				)}
			</div>
		</section>
	);
}
