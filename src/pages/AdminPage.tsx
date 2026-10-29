import { useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiBell, FiCheckCircle, FiCpu, FiDatabase, FiGithub, FiInbox, FiInfo, FiLock, FiLogOut, FiMail, FiRefreshCw } from "react-icons/fi";
import type { AdminRepo } from "../api";
import { ui2 } from "../content/ui2";
import type { L } from "../content/data";
import { usePrefs } from "../prefs";

interface Row {
	id: number;
	created_at: string;
	name: string;
	reach: string;
	need: string;
	message: string;
}
interface Status {
	db: boolean;
	ai: boolean;
	github: boolean;
	notify: boolean;
}
type Fail = "" | "wrong" | "noToken" | "noDb" | "limited" | "bad";
type Level = "ok" | "warn" | "info";

const A = ui2.admin;

/** Pannello riservato: richieste, stato del sistema e repository. La chiave vale una volta sola: poi resta una sessione di 7 giorni (cookie HttpOnly). */
export default function AdminPage() {
	const { t } = usePrefs();
	const [key, setKey] = useState("");
	const [phase, setPhase] = useState<"check" | "out" | "in">("check");
	const [fail, setFail] = useState<Fail>("");
	const [status, setStatus] = useState<Status | null>(null);
	const [rows, setRows] = useState<Row[] | null>(null);
	const [repos, setRepos] = useState<AdminRepo[] | "none" | null>(null);
	const [busy, setBusy] = useState(false);

	const isJson = (r: Response) => (r.headers.get("content-type") ?? "").includes("json");
	const failOf = async (r: Response): Promise<Fail> => {
		const e = isJson(r) ? ((await r.json().catch(() => ({}))) as { error?: string }).error : "";
		if (r.status === 429) return "limited";
		if (r.status === 401) return "wrong";
		return e === "no_admin_token" ? "noToken" : e === "no_db" ? "noDb" : "bad";
	};

	const loadData = useCallback(async () => {
		try {
			const b = await fetch("/api/admin/briefs", { credentials: "same-origin" });
			if (b.ok && isJson(b)) setRows(((await b.json()) as { rows: Row[] }).rows);
			else setRows([]);
		} catch {
			setRows([]);
		}
		try {
			const g = await fetch("/api/admin/repos", { credentials: "same-origin" });
			setRepos(g.ok && isJson(g) ? ((await g.json()) as { rows: AdminRepo[] }).rows : "none");
		} catch {
			setRepos("none");
		}
	}, []);

	const enter = useCallback(
		async (st: Status) => {
			setStatus(st);
			setPhase("in");
			setFail("");
			await loadData();
		},
		[loadData],
	);

	// al caricamento: se c'è già una sessione valida si entra direttamente
	useEffect(() => {
		let alive = true;
		fetch("/api/admin/session", { credentials: "same-origin" })
			.then(async (r) => {
				if (!alive) return;
				if (r.ok && isJson(r)) await enter(((await r.json()) as { status: Status }).status);
				else {
					setPhase("out");
					if (r.status !== 401) setFail(await failOf(r));
				}
			})
			.catch(() => alive && setPhase("out"));
		return () => {
			alive = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = async () => {
		setBusy(true);
		setFail("");
		try {
			const r = await fetch("/api/admin/session", { method: "POST", credentials: "same-origin", headers: { authorization: `Bearer ${key.trim()}` } });
			if (r.ok && isJson(r)) {
				setKey("");
				await enter(((await r.json()) as { status: Status }).status);
			} else setFail(await failOf(r));
		} catch {
			setFail("bad");
		}
		setBusy(false);
	};

	const logout = async () => {
		await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => undefined);
		setPhase("out");
		setStatus(null);
		setRows(null);
		setRepos(null);
	};

	const refresh = async () => {
		setBusy(true);
		await loadData();
		setBusy(false);
	};

	const checks: { id: string; icon: typeof FiDatabase; label: L; ok: boolean; optional: boolean; yes: L; no: L }[] = status
		? [
				{ id: "db", icon: FiDatabase, label: A.sDb, ok: status.db, optional: false, yes: A.sDbOk, no: A.sDbNo },
				{ id: "ai", icon: FiCpu, label: A.sAi, ok: status.ai, optional: true, yes: A.sAiOk, no: A.sAiNo },
				{ id: "gh", icon: FiGithub, label: A.sGh, ok: status.github, optional: true, yes: A.sGhOk, no: A.sGhNo },
				{ id: "hook", icon: FiBell, label: A.sHook, ok: status.notify, optional: true, yes: A.sHookOk, no: A.sHookNo },
			]
		: [];
	const alerts = checks.filter((c) => !c.ok).length;
	const level = (c: (typeof checks)[number]): Level => (c.ok ? "ok" : c.optional ? "info" : "warn");

	return (
		<section className="sec adm">
			<div className="adm__head">
				<div>
					<h1 className="h2">{t(A.title)}</h1>
					<p className="muted">{t(A.sub)}</p>
				</div>
				{phase === "in" && (
					<div className="adm__tools">
						<button type="button" className="btn glass sm" onClick={refresh} disabled={busy}>
							<FiRefreshCw aria-hidden="true" className={busy ? "spin" : undefined} />
							{t(A.refresh)}
						</button>
						<button type="button" className="btn glass sm" onClick={logout}>
							<FiLogOut aria-hidden="true" />
							{t(A.logout)}
						</button>
					</div>
				)}
			</div>

			{phase === "check" && <p className="muted">{t(A.checking)}</p>}

			{phase === "out" && (
				<form
					className="glass adm__card adm__login"
					data-lg-bezel="26"
					onSubmit={(e) => {
						e.preventDefault();
						void login();
					}}
				>
					<span className="adm__ico" aria-hidden="true">
						<FiLock />
					</span>
					<div>
						<h2 className="h3">{t(A.loginTitle)}</h2>
						<p className="muted">{t(A.loginText)}</p>
					</div>
					<label>
						<span>{t(A.token)}</span>
						<input type="password" autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} />
					</label>
					<button className="btn pri" type="submit" disabled={busy || !key.trim()}>
						{t(A.load)}
					</button>
					{fail && (
						<p className="adm__note warn" role="alert">
							<FiAlertTriangle aria-hidden="true" />
							<span>{t(A[fail])}</span>
						</p>
					)}
				</form>
			)}

			{phase === "in" && status && (
				<>
					<div className="glass adm__card" data-lg-bezel="26">
						<div className="adm__top">
							<h2 className="h3">{t(A.statusTitle)}</h2>
							<span className={`adm__badge ${alerts ? "info" : "ok"}`}>
								{alerts ? (
									<>
										<FiInfo aria-hidden="true" />
										{alerts} {t(A.someAlerts)}
									</>
								) : (
									<>
										<FiCheckCircle aria-hidden="true" />
										{t(A.allGood)}
									</>
								)}
							</span>
						</div>
						<ul className="adm__checks" role="list">
							{checks.map((c) => {
								const l = level(c);
								const Ico = c.icon;
								return (
									<li key={c.id} className={`adm__note ${l}`}>
										<Ico aria-hidden="true" />
										<span>
											<b>{t(c.label)}</b>
											<em>{c.ok ? t(A.ok) : c.optional ? t(A.opt) : t(A.warn)}</em>
											<small>{t(c.ok ? c.yes : c.no)}</small>
										</span>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="glass adm__card" data-lg-bezel="26">
						<div className="adm__top">
							<h2 className="h3">{t(A.briefsTitle)}</h2>
							{rows && rows.length > 0 && <span className="adm__badge ok">{rows.length}</span>}
						</div>
						{rows && rows.length === 0 && (
							<div className="adm__empty">
								<FiInbox aria-hidden="true" />
								<b>{t(A.emptyTitle)}</b>
								<p className="muted">{t(A.empty)}</p>
							</div>
						)}
						{rows && rows.length > 0 && (
							<ul className="adm__list" role="list">
								{rows.map((r) => (
									<li key={r.id}>
										<div className="adm__row">
											<b>{r.name || "—"}</b>
											{r.need && <span className="adm__tag">{r.need}</span>}
											<time>{r.created_at}</time>
										</div>
										<a className="adm__mail" href={r.reach.includes("@") ? `mailto:${r.reach}` : undefined}>
											<FiMail aria-hidden="true" />
											{r.reach}
										</a>
										<p>{r.message}</p>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="glass adm__card" data-lg-bezel="26">
						<div className="adm__top">
							<div>
								<h2 className="h3">{t(A.reposTitle)}</h2>
								<p className="muted">{t(A.reposSub)}</p>
							</div>
						</div>
						{repos === "none" && (
							<p className="adm__note info">
								<FiInfo aria-hidden="true" />
								<span>{t(A.noGh)}</span>
							</p>
						)}
						{Array.isArray(repos) && (
							<ul className="adm__list adm__repos" role="list">
								{repos.map((r) => (
									<li key={r.name}>
										<a href={r.url} target="_blank" rel="noopener noreferrer">
											<b>{r.name}</b>
										</a>
										<small>
											<span className={`adm__tag ${r.private ? "priv" : ""}`}>{t(r.private ? A.priv : A.pub)}</span>
											{!r.mine && <span className="adm__tag">{t(A.collab)}</span>}
											{r.language && <span>{r.language}</span>}
											{r.pushedAt && <time>{r.pushedAt.slice(0, 10)}</time>}
										</small>
									</li>
								))}
							</ul>
						)}
					</div>
				</>
			)}
		</section>
	);
}
