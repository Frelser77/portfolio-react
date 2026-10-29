import { useEffect, useRef } from "react";
import { FiGrid } from "react-icons/fi";
import type { Project } from "../content/data";
import { ui2 } from "../content/ui2";
import { Link } from "../router";
import { usePrefs } from "../prefs";

/** Striscia in stile "stories": si cambia progetto con un tocco, senza risalire la pagina. */
export default function ProjectStories({ list, current }: { list: Project[]; current: string }) {
	const { t } = usePrefs();
	const track = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const el = track.current?.querySelector<HTMLElement>('[aria-current="page"]');
		const box = track.current;
		if (el && box) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
	}, [current]);

	return (
		<nav className="stories glass" aria-label={t(ui2.project.stories)} data-lg-bezel="22">
			<ul ref={track} role="list">
				<li>
					<Link className="story story--all" to="/progetti">
						<span className="story__ring">
							<span className="story__face">
								<FiGrid aria-hidden="true" />
							</span>
						</span>
						<span className="story__name">{t(ui2.project.back)}</span>
					</Link>
				</li>
				{list.map((p) => (
					<li key={p.id}>
						<Link className={`story${p.id === current ? " on" : ""}`} to={`/progetti/${p.id}`} aria-current={p.id === current ? "page" : undefined}>
							<span className="story__ring">
								<span className="story__face" style={{ background: `linear-gradient(35deg, ${p.tint[0]}, ${p.tint[1]} 55%, ${p.tint[2]})` }}>
									{p.logo ? <img src={p.logo.src} alt="" width={p.logo.w} height={p.logo.h} loading="lazy" decoding="async" /> : <b>{p.mark}</b>}
								</span>
							</span>
							<span className="story__name">{p.name}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
