import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiGrid, FiX } from "react-icons/fi";
import { certificates } from "../content/data";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

export interface CertificatesHandle {
	open: () => void;
}

/** Finestra con gli attestati Epicode: griglia di miniature e vista grande sfogliabile. */
const Certificates = forwardRef<CertificatesHandle>(function Certificates(_props, ref) {
	const { t } = usePrefs();
	const dialog = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState<number | null>(null);

	useImperativeHandle(ref, () => ({
		open: () => {
			setIndex(null);
			dialog.current?.showModal();
		},
	}));

	// Frecce da tastiera nella vista grande
	useEffect(() => {
		if (index === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % certificates.length));
			if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + certificates.length) % certificates.length));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index]);

	const cert = index !== null ? certificates[index] : null;
	const title = t(ui.about.certsTitle);

	return (
		<dialog
			ref={dialog}
			className="dlg"
			aria-labelledby="certs-title"
			onClose={() => setIndex(null)}
			onClick={(e) => e.target === dialog.current && dialog.current?.close()}
		>
			<div className="dlg__inner">
				<div className="dlg__head">
					<h2 id="certs-title">{title}</h2>
					<button type="button" className="ico" onClick={() => dialog.current?.close()}>
						<FiX aria-hidden="true" />
						<span className="sr-only">{t(ui.nav.close)}</span>
					</button>
				</div>

				{cert ? (
					<div>
						<img className="certs__big" src={`/img/attestati/${cert.file}.webp`} alt={`${title}: ${t(cert.label)}`} />
						<div className="certs__controls">
							<button type="button" className="ico" onClick={() => setIndex((index! - 1 + certificates.length) % certificates.length)}>
								<FiChevronLeft aria-hidden="true" />
								<span className="sr-only">{t(ui.about.prev)}</span>
							</button>
							<span className="certs__count">
								{t(cert.label)} ({index! + 1}/{certificates.length})
							</span>
							<button type="button" className="ico" onClick={() => setIndex((index! + 1) % certificates.length)}>
								<FiChevronRight aria-hidden="true" />
								<span className="sr-only">{t(ui.about.next)}</span>
							</button>
							<button type="button" className="ico" onClick={() => setIndex(null)}>
								<FiGrid aria-hidden="true" />
								<span className="sr-only">{t(ui.about.back)}</span>
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
	);
});

export default Certificates;
