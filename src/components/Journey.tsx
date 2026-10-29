import { useEffect, useRef, useState } from "react";
import { FiAward, FiChevronLeft, FiChevronRight, FiGrid, FiX } from "react-icons/fi";
import { certificates, journey, principles } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export default function Journey() {
	const { t } = usePrefs();
	const dialog = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState<number | null>(null);

	const openCerts = () => {
		setIndex(null);
		dialog.current?.showModal();
	};

	// Frecce per scorrere gli attestati nella vista grande
	useEffect(() => {
		if (index === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % certificates.length));
			if (e.key === "ArrowLeft")
				setIndex((i) => (i === null ? i : (i - 1 + certificates.length) % certificates.length));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index]);

	const cert = index !== null ? certificates[index] : null;

	return (
		<section id="percorso" className="section wrap" aria-labelledby="journey-title">
			<div className="journey">
				<div>
					<h2 id="journey-title">{t(ui.journey.title)}</h2>
					<ol className="timeline">
						{journey.map((step) => (
							<li key={step.place} className="timeline__item">
								<p className="timeline__years">{step.years}</p>
								<div className="timeline__body">
									<h3>{t(step.role)}</h3>
									<p className="timeline__place">{step.place}</p>
									<p>{t(step.text)}</p>
									{step.certificates && (
										<button type="button" className="btn btn--ghost btn--sm" onClick={openCerts}>
											<FiAward aria-hidden="true" />
											{t(ui.journey.certs)} ({certificates.length})
										</button>
									)}
								</div>
							</li>
						))}
					</ol>
				</div>

				<aside className="how" aria-labelledby="how-title">
					<h3 id="how-title" className="how__title">
						{t(ui.journey.howTitle)}
					</h3>
					<dl className="how__list">
						{principles.map((p) => (
							<div key={p.title.it}>
								<dt>{t(p.title)}</dt>
								<dd>{t(p.text)}</dd>
							</div>
						))}
					</dl>
				</aside>
			</div>

			<dialog
				ref={dialog}
				className="certs"
				aria-labelledby="certs-title"
				onClose={() => setIndex(null)}
				onClick={(e) => e.target === dialog.current && dialog.current?.close()}
			>
				<div className="certs__inner">
					<div className="certs__head">
						<h2 id="certs-title">{t(ui.journey.certsTitle)}</h2>
						<button type="button" className="tool-btn" onClick={() => dialog.current?.close()}>
							<FiX aria-hidden="true" />
							<span className="sr-only">{t(ui.nav.close)}</span>
						</button>
					</div>

					{cert ? (
						<div className="certs__view">
							<img src={`/img/attestati/${cert.file}.webp`} alt={`${t(ui.journey.certsTitle)}: ${t(cert.label)}`} />
							<div className="certs__controls">
								<button
									type="button"
									className="tool-btn"
									onClick={() => setIndex((index! - 1 + certificates.length) % certificates.length)}
								>
									<FiChevronLeft aria-hidden="true" />
									<span className="sr-only">{t(ui.journey.prev)}</span>
								</button>
								<span className="certs__count">
									{t(cert.label)} ({index! + 1}/{certificates.length})
								</span>
								<button
									type="button"
									className="tool-btn"
									onClick={() => setIndex((index! + 1) % certificates.length)}
								>
									<FiChevronRight aria-hidden="true" />
									<span className="sr-only">{t(ui.journey.next)}</span>
								</button>
								<button type="button" className="tool-btn" onClick={() => setIndex(null)}>
									<FiGrid aria-hidden="true" />
									<span className="sr-only">{t(ui.journey.back)}</span>
								</button>
							</div>
						</div>
					) : (
						<ul className="certs__grid" role="list">
							{certificates.map((c, i) => (
								<li key={c.file}>
									<button type="button" className="certs__thumb" onClick={() => setIndex(i)}>
										<img src={`/img/attestati/${c.file}-thumb.webp`} alt="" loading="lazy" width="360" height="197" />
										<span>{t(c.label)}</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</dialog>
		</section>
	);
}
