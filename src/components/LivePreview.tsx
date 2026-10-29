import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import { ui } from "../content/ui";
import { usePrefs } from "../prefs";

/**
 * Anteprima live dentro una cornice da telefono.
 * L'iframe si carica solo su richiesta: niente traffico verso terzi
 * finché il visitatore non lo chiede.
 */
export default function LivePreview({ url }: { url: string }) {
	const { t } = usePrefs();
	const [state, setState] = useState<"idle" | "loading" | "ready">("idle");
	const host = new URL(url).host;

	return (
		<figure className="phone">
			<div className="phone__frame">
				<div className="phone__bar" aria-hidden="true">
					<span className="phone__lock" />
					<span className="phone__host">{host}</span>
				</div>
				<div className="phone__screen">
					{state === "idle" ? (
						<div className="phone__poster">
							<button type="button" className="btn btn--solid" onClick={() => setState("loading")}>
								<FiPlay aria-hidden="true" />
								{t(ui.projects.loadPreview)}
							</button>
							<p className="phone__note">{t(ui.projects.previewNote)}</p>
						</div>
					) : (
						<>
							{state === "loading" && <div className="phone__loader" role="status" aria-label="Loading" />}
							<iframe
								src={url}
								title={t(ui.projects.previewTitle)}
								loading="lazy"
								referrerPolicy="no-referrer"
								sandbox="allow-scripts allow-same-origin allow-popups"
								onLoad={() => setState("ready")}
							/>
						</>
					)}
				</div>
			</div>
		</figure>
	);
}
