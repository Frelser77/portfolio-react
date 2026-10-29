import { useState } from "react";
import type { AdminRepo } from "../api";
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
	const [bad, setBad] = useState<"" | "wrong" | "noToken" | "noDb" | "bad">("");
	const [repos, setRepos] = useState<AdminRepo[] | "none" | null>(null);

	const call = (path: string) => fetch(path, { headers: { authorization: `Bearer ${key.trim()}` } });
	const isJson = (r: Response) => (r.headers.get("content-type") ?? "").includes("json");

	const load = async () => {
		setBad("");
		setRepos(null);
		try {
			const r = await call("/api/admin/briefs");
			if (!r.ok || !isJson(r)) {
				const e = isJson(r) ? ((await r.json()) as { error?: string }).error : "";
				setRows(null);
				setBad(r.status === 401 ? "wrong" : e === "no_admin_token" ? "noToken" : e === "no_db" ? "noDb" : "bad");
				return;
			}
			setRows(((await r.json()) as { rows: Row[] }).rows);
		} catch {
			setRows(null);
			setBad("bad");
			return;
		}
		try {
			const g = await call("/api/admin/repos");
			if (g.ok && isJson(g)) setRepos(((await g.json()) as { rows: AdminRepo[] }).rows);
			else setRepos("none");
		} catch {
			setRepos("none");
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
				{bad && <p role="alert">{t(ui2.admin[bad])}</p>}
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
				{repos === "none" && <p className="muted" style={{ fontSize: 13 }}>{t(ui2.admin.noGh)}</p>}
				{Array.isArray(repos) && (
					<>
						<h2 className="h3">{t(ui2.admin.reposTitle)}</h2>
						<ul className="admin repolist" role="list">
							{repos.map((r) => (
								<li key={r.name} className="glass" data-lg="off">
									<a href={r.url} target="_blank" rel="noopener noreferrer">
										<b>{r.name}</b>
									</a>
									<small>
										{t(r.private ? ui2.admin.priv : ui2.admin.pub)}
										{!r.mine && ` · ${t(ui2.admin.collab)}`}
										{r.language && ` · ${r.language}`}
										{r.pushedAt && ` · ${r.pushedAt.slice(0, 10)}`}
									</small>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</section>
	);
}
