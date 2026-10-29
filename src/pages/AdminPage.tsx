import { useState } from "react";
import { ui2 } from "../content/ui2";
import { usePrefs } from "../prefs";

interface Row {
	id: number;
	created_at: string;
	name: string;
	reach: string;
	need: string;
	message: string;
}

/** Pagina riservata: elenco delle richieste arrivate dal modulo. Serve la chiave ADMIN_TOKEN impostata sul Worker. */
export default function AdminPage() {
	const { t } = usePrefs();
	const [key, setKey] = useState("");
	const [rows, setRows] = useState<Row[] | null>(null);
	const [bad, setBad] = useState(false);

	const load = async () => {
		setBad(false);
		try {
			const r = await fetch("/api/admin/briefs", { headers: { authorization: `Bearer ${key}` } });
			if (!r.ok || !(r.headers.get("content-type") ?? "").includes("json")) throw new Error();
			setRows(((await r.json()) as { rows: Row[] }).rows);
		} catch {
			setRows(null);
			setBad(true);
		}
	};

	return (
		<section className="sec">
			<div className="card">
				<h1 className="h2">{t(ui2.admin.title)}</h1>
				<form
					className="adminform"
					onSubmit={(e) => {
						e.preventDefault();
						void load();
					}}
				>
					<label>
						<span>{t(ui2.admin.token)}</span>
						<input type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} />
					</label>
					<button className="btn pri" type="submit">
						{t(ui2.admin.load)}
					</button>
				</form>
				{bad && <p role="alert">{t(ui2.admin.bad)}</p>}
				{rows && rows.length === 0 && <p>{t(ui2.admin.empty)}</p>}
				{rows && (
					<ul className="admin" role="list">
						{rows.map((r) => (
							<li key={r.id} className="glass" data-lg="off">
								<small>
									{r.created_at} · {r.need || "—"}
								</small>
								<b>
									{r.name || "—"} · {r.reach}
								</b>
								<p>{r.message}</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
