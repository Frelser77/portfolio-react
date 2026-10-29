import { useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiBell, FiCheckCircle, FiCpu, FiDatabase, FiGithub, FiInbox, FiInfo, FiLock, FiLogOut, FiMail, FiRefreshCw, FiShield, FiCopy, FiSmartphone } from "react-icons/fi";
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
	ghInfo?: { login: string; kind: string; scopes: string } | null;
	db: boolean;
	ai: boolean;
	github: boolean;
	notify: boolean;
	totp?: boolean;
	log?: { ts: number; ok: number; country: string; ua: string }[];
}
interface Pick {
	name: string;
	label: string;
	blurb: string;
	link: string;
}
type Fail = "" | "locked" | "wrong" | "noToken" | "noDb" | "limited" | "bad";
type Level = "ok" | "warn" | "info";

const A = ui2.admin;

/** Pannello riservato: richieste, stato del sistema e repository. La chiave vale una volta sola: poi resta una sessione di 7 giorni (cookie HttpOnly). */
export default function AdminPage() {
	const { t } = usePrefs();
	const [key, setKey] = useState("");
	const [phase, setPhase] = useState<"check" | "out" | "in">("check");
	const [fail, setFail] = useState<Fail>("");
	const [needCode, setNeedCode] = useState(false);
	const [code, setCode] = useState("");
	const [wait, setWait] = useState(0);
	const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
	const [copied, setCopied] = useState(false);
	const [status, setStatus] = useState<Status | null>(null);
	const [rows, setRows] = useState<Row[] | null>(null);
	const [repos, setRepos] = useState<AdminRepo[] | "none" | null>(null);
	const [busy, setBusy] = useState(false);
	const [picks, setPicks] = useState<Pick[]>([]);
	const [saved, setSaved] = useState<"" | "ok" | "fail">("");
	const [base, setBase] = useState("[]");
	const [q, setQ] = useState("");
	const [flt, setFlt] = useState<"active" | "all" | "pub" | "priv" | "mine" | "collab" | "arch">("active");
	const [chosen, setChosen] = useState<string[]>([]);
	const [ask, setAsk] = useState<"" | "private" | "archive" | "unarchive" | "public">("");
	const [report, setReport] = useState<{ ok: number; bad: number; errors: string[] } | null>(null);

	const isJson = (r: Response) => (r.headers.get("content-type") ?? "").includes("json");
	const failOf = async (r: Response): Promise<Fail> => {
		const body = isJson(r) ? ((await r.json().catch(() => ({}))) as { error?: string; totp?: boolean; retry?: number }) : {};
		const e = body.error;
		if (typeof body.totp === "boolean") setNeedCode(body.totp);
		if (r.status === 429) {
			if (e === "locked") {
				setWait(Math.max(1, Math.ceil((body.retry ?? 60) / 60)));
				return "locked";
			}
			return "limited";
		}
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
			const f = await fetch("/api/admin/featured", { credentials: "same-origin" });
			if (f.ok && isJson(f)) {
				const j = (await f.json()) as { rows: { name: string; label: string | null; blurb: string | null; link: string | null }[] };
				const loaded = j.rows.map((r) => ({ name: r.name, label: r.label ?? "", blurb: r.blurb ?? "", link: r.link ?? "" }));
				setPicks(loaded);
				setBase(JSON.stringify(loaded));
			}
		} catch {
			/* nessuna selezione */
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
			const r = await fetch("/api/admin/session", { method: "POST", credentials: "same-origin", headers: { authorization: `Bearer ${key.trim()}`, ...(needCode ? { "x-admin-code": code.replace(/\s/g, "") } : {}) } });
			if (r.ok && isJson(r)) {
				setKey("");
				setCode("");
				await enter(((await r.json()) as { status: Status }).status);
			} else {
				setCode("");
				setFail(await failOf(r));
			}
		} catch {
			setFail("bad");
		}
		setBusy(false);
	};

	const startSetup = async () => {
		setBusy(true);
		try {
			const r = await fetch("/api/admin/totp-setup", { method: "POST", credentials: "same-origin" });
			if (r.ok) setSetup((await r.json()) as { secret: string; uri: string });
		} catch {
			/* riprova */
		}
		setBusy(false);
	};
	const copySecret = async () => {
		if (!setup) return;
		try {
			await navigator.clipboard.writeText(setup.secret);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* si copia a mano */
		}
	};
	const logoutAll = async () => {
		if (!window.confirm(t(A.logoutAllAsk))) return;
		await fetch("/api/admin/logout-all", { method: "POST", credentials: "same-origin" }).catch(() => undefined);
		setPhase("out");
		setStatus(null);
		setRows(null);
		setRepos(null);
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

	const dirty = JSON.stringify(picks) !== base;
	const move = (i: number, d: number) =>
		setPicks((p) => {
			const j = i + d;
			if (j < 0 || j >= p.length) return p;
			const n = [...p];
			[n[i], n[j]] = [n[j], n[i]];
			return n;
		});
	const edit = (i: number, k: "label" | "blurb" | "link", v: string) => setPicks((p) => p.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
	const savePicks = async () => {
		setBusy(true);
		setSaved("");
		try {
			const r = await fetch("/api/admin/featured", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: picks }) });
			setSaved(r.ok ? "ok" : "fail");
			if (r.ok) setBase(JSON.stringify(picks));
		} catch {
			setSaved("fail");
		}
		setBusy(false);
	};
	const repoByName = new Map(Array.isArray(repos) ? repos.map((r) => [r.name, r] as const) : []);

	// di default: repository non archiviati, pubblici e privati, con prima quelli che il sito mostra già
	const rank = (r: AdminRepo) => {
		const i = picks.findIndex((p) => p.name === r.name);
		return i === -1 ? 1000 : i;
	};
	const visible = Array.isArray(repos)
		? repos
				.filter((r) => {
					const f =
						flt === "active" ? !r.archived : flt === "all" ? true : flt === "arch" ? r.archived : flt === "pub" ? !r.private && !r.archived : flt === "priv" ? r.private && !r.archived : flt === "mine" ? r.mine && !r.archived : !r.mine && !r.archived;
					return f && r.name.toLowerCase().includes(q.trim().toLowerCase());
				})
				.sort((a, b) => rank(a) - rank(b))
		: [];
	const isSite = (r: AdminRepo) => /\/portfolio-react$/i.test(r.name);
	const canAct = (r: AdminRepo) => r.permission === "ADMIN" && (!isSite(r) || r.archived);
	const toggle = (n: string) => setChosen((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]));
	const runAction = async () => {
		if (!ask) return;
		setBusy(true);
		setReport(null);
		const all: { name: string; ok: boolean; error?: string }[] = [];
		try {
			// a gruppi da 20, così ogni richiesta resta dentro i limiti del Worker
			for (let i = 0; i < chosen.length; i += 20) {
				const names = chosen.slice(i, i + 20);
				const r = await fetch("/api/admin/repo-action", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: ask, names }) });
				const j = r.ok ? ((await r.json()) as { results: { name: string; ok: boolean; error?: string }[] }) : null;
				if (j) all.push(...j.results);
				else all.push(...names.map((name) => ({ name, ok: false, error: `HTTP ${r.status}` })));
			}
		} catch {
			all.push(...chosen.filter((n) => !all.some((x) => x.name === n)).map((name) => ({ name, ok: false, error: "rete" })));
		}
		setReport({ ok: all.filter((x) => x.ok).length, bad: all.filter((x) => !x.ok).length, errors: all.filter((x) => !x.ok).map((x) => `${x.name} → ${x.error}`) });
		setAsk("");
		setChosen([]);
		await loadData();
		setBusy(false);
	};

	useEffect(() => {
		if (!dirty) return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

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
					{needCode && (
						<label>
							<span>{t(A.code)}</span>
							<input className="adm__code" type="text" inputMode="numeric" pattern="[0-9 ]*" autoComplete="one-time-code" maxLength={7} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9 ]/g, ""))} />
						</label>
					)}
					<button className="btn pri" type="submit" disabled={busy || !key.trim() || (needCode && code.replace(/\s/g, "").length !== 6)}>
						{t(A.load)}
					</button>
					{fail && (
						<p className="adm__note warn" role="alert">
							<FiAlertTriangle aria-hidden="true" />
							<span>{t(A[fail])}{fail === "locked" ? ` ${wait} min.` : ""}</span>
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
											{c.id === "gh" && status.ghInfo && (
												<small>
													Token {status.ghInfo.kind} · {status.ghInfo.login}
													{status.ghInfo.kind === "classic" ? ` · scope: ${status.ghInfo.scopes || "nessuno"}` : ""}
													{status.ghInfo.kind === "fine-grained" ? " · non adatto: serve un token classic con scope repo" : ""}
												</small>
											)}
										</span>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="glass adm__card" data-lg-bezel="26">
						<div className="adm__top">
							<h2 className="h3">{t(A.secTitle)}</h2>
							<span className={`adm__badge ${status.totp ? "ok" : "info"}`}>
								{status.totp ? <FiCheckCircle aria-hidden="true" /> : <FiInfo aria-hidden="true" />}
								{status.totp ? t(A.secOn) : t(A.secOff)}
							</span>
						</div>
						<p className="muted adm__sub">{t(status.totp ? A.secOnText : A.secOffText)}</p>
						{!status.totp && !setup && (
							<button type="button" className="btn pri sm" onClick={startSetup} disabled={busy}>
								<FiShield aria-hidden="true" />
								{t(A.secEnable)}
							</button>
						)}
						{setup && (
							<div className="adm__setup">
								<ol>
									<li>{t(A.step1)}</li>
									<li>{t(A.step2)}</li>
									<li>{t(A.step3)}</li>
								</ol>
								<p className="adm__secret" aria-label={t(A.secretLabel)}>
									<code>{setup.secret.replace(/(.{4})/g, "$1 ").trim()}</code>
									<button type="button" className="adm__mini" onClick={copySecret}>
										<FiCopy aria-hidden="true" /> {copied ? t(A.copied) : t(A.copy)}
									</button>
								</p>
								<a className="btn glass sm" href={setup.uri}>
									<FiSmartphone aria-hidden="true" />
									{t(A.openApp)}
								</a>
								<small className="muted">{t(A.secretHint)}</small>
							</div>
						)}
						{status.log && status.log.length > 0 && (
							<>
								<p className="psub">{t(A.recentAccess)}</p>
								<ul className="adm__log" role="list">
									{status.log.map((l) => (
										<li key={l.ts} className={l.ok ? "ok" : "bad"}>
											<b>{l.ok ? t(A.accessOk) : t(A.accessFail)}</b>
											<span>{[l.ua, l.country].filter(Boolean).join(" · ")}</span>
											<small>{new Date(l.ts).toLocaleString()}</small>
										</li>
									))}
								</ul>
							</>
						)}
						<button type="button" className="btn glass sm" onClick={logoutAll}>
							<FiLogOut aria-hidden="true" />
							{t(A.logoutAll)}
						</button>
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
							<>
								<div>
									<h3 className="h3">{t(A.featTitle)}</h3>
									<p className="muted adm__sub">{t(A.featText)}</p>
								</div>
								{picks.length === 0 && <p className="muted adm__sub">{t(A.featNone)}</p>}
								<ul className="adm__pick" role="list">
									{picks.map((p, i) => {
										const r = repoByName.get(p.name);
										return (
											<li key={p.name}>
												<div className="adm__pickhead">
													<b>{p.name}</b>
													{r && <span className={`adm__tag ${r.private ? "priv" : ""}`}>{t(r.private ? A.priv : A.pub)}</span>}
													<button type="button" className="adm__mini" onClick={() => move(i, -1)} disabled={i === 0} aria-label={t(A.up)}>
														↑
													</button>
													<button type="button" className="adm__mini" onClick={() => move(i, 1)} disabled={i === picks.length - 1} aria-label={t(A.down)}>
														↓
													</button>
													<button type="button" className="adm__mini" onClick={() => setPicks((x) => x.filter((_, n) => n !== i))}>
														{t(A.remove)}
													</button>
												</div>
												<input value={p.label} maxLength={60} placeholder={t(A.publicName)} onChange={(e) => edit(i, "label", e.target.value)} />
												<input value={p.blurb} maxLength={160} placeholder={t(A.publicBlurb)} onChange={(e) => edit(i, "blurb", e.target.value)} />
												<div className="adm__linkrow">
													<input type="url" inputMode="url" value={p.link} maxLength={200} placeholder={t(A.publicLink)} onChange={(e) => edit(i, "link", e.target.value.trim())} aria-label={t(A.publicLink)} />
													{r?.homepage && p.link !== r.homepage && (
														<button type="button" className="adm__mini" onClick={() => edit(i, "link", r.homepage ?? "")}>
															{t(A.useHomepage)}
														</button>
													)}
												</div>
												{p.link && !/^https?:\/\//i.test(p.link) && <small className="adm__err">{t(A.linkBad)}</small>}
												{r?.private && <small className="muted">{t(A.privWarn)}</small>}
											</li>
										);
									})}
								</ul>
								<div className={`adm__save${dirty ? " dirty" : ""}`}>
									<span>{dirty ? t(A.unsaved) : t(A.inSync)}</span>
									<span className="adm__tools">
										{dirty && (
											<button type="button" className="btn glass sm" onClick={() => setPicks(JSON.parse(base) as Pick[])} disabled={busy}>
												{t(A.cancel)}
											</button>
										)}
										<button type="button" className="btn pri sm" onClick={savePicks} disabled={busy || !dirty}>
											{t(A.save)}
										</button>
									</span>
								</div>
								{saved && (
									<p className={`adm__note ${saved === "ok" ? "ok" : "warn"}`} role="status">
										{saved === "ok" ? <FiCheckCircle aria-hidden="true" /> : <FiAlertTriangle aria-hidden="true" />}
										<span>{t(saved === "ok" ? A.saved : A.saveFail)}</span>
									</p>
								)}

								<h3 className="h3">{t(A.allRepos)}</h3>
								<div className="adm__filters">
									<input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(A.search)} aria-label={t(A.search)} />
									<div className="adm__chips" role="group">
										{(
											[
												["active", A.fActive],
												["all", A.fAll],
												["arch", A.fArch],
												["pub", A.fPub],
												["priv", A.fPriv],
												["mine", A.fMine],
												["collab", A.fCollab],
											] as const
										).map(([k, label]) => (
											<button key={k} type="button" className="cchip" aria-pressed={flt === k} onClick={() => setFlt(k)}>
												{t(label)}
											</button>
										))}
									</div>
								</div>
								<div className="adm__bar">
									<button type="button" className="adm__mini" onClick={() => setChosen(visible.filter(canAct).map((r) => r.name))}>
										{t(A.selVisible)}
									</button>
									{chosen.length > 0 && (
										<button type="button" className="adm__mini" onClick={() => setChosen([])}>
											{t(A.selNone)}
										</button>
									)}
									<span className="muted">
										{chosen.length} {t(A.selected)} · {visible.length}/{repos.length}
									</span>
								</div>
								{chosen.length > 0 && !ask && (
									<div className="adm__bar adm__acts">
										<button type="button" className="adm__mini" onClick={() => setAsk("private")}>
											{t(A.toPrivate)} ({chosen.length})
										</button>
										<button type="button" className="adm__mini" onClick={() => setAsk("archive")}>
											{t(A.toArchive)} ({chosen.length})
										</button>
										<button type="button" className="adm__mini" onClick={() => setAsk("unarchive")}>
											{t(A.toUnarchive)} ({chosen.length})
										</button>
										<button type="button" className="adm__mini" onClick={() => setAsk("public")}>
											{t(A.toPublic)} ({chosen.length})
										</button>
									</div>
								)}
								{ask && (
									<div className="adm__note warn" role="alertdialog">
										<FiAlertTriangle aria-hidden="true" />
										<span>
											<b>
												{ask === "private" ? t(A.toPrivate) : ask === "archive" ? t(A.toArchive) : ask === "unarchive" ? t(A.toUnarchive) : t(A.toPublic)} · {chosen.length}
											</b>
											<small>{t(ask === "private" ? A.confirmPrivate : ask === "archive" ? A.confirmArchive : ask === "unarchive" ? A.confirmUnarchive : A.confirmPublic)}</small>
											<span className="adm__bar">
												<button type="button" className="adm__mini on" onClick={runAction} disabled={busy}>
													{t(A.confirm)}
												</button>
												<button type="button" className="adm__mini" onClick={() => setAsk("")} disabled={busy}>
													{t(A.cancel)}
												</button>
											</span>
										</span>
									</div>
								)}
								{report && (
									<p className={`adm__note ${report.bad ? "warn" : "ok"}`} role="status">
										{report.bad ? <FiAlertTriangle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}
										<span>
											{report.ok} {t(A.done)}
											{report.bad > 0 && ` · ${report.bad} ${t(A.failed)}`}
											{report.errors.map((e) => (
												<small key={e}>{e}</small>
											))}
										</span>
									</p>
								)}
								<ul className="adm__list adm__repos adm__scroll" role="list">
									{visible.length === 0 && <li className="muted">{t(A.nothing)}</li>}
									{visible.map((r) => {
										const on = picks.some((p) => p.name === r.name);
										return (
											<li key={r.name}>
												<input type="checkbox" checked={chosen.includes(r.name)} disabled={!canAct(r)} title={canAct(r) ? undefined : isSite(r) ? t(A.siteRepo) : t(A.noPerm)} onChange={() => toggle(r.name)} aria-label={r.name} />
												<div className="adm__rinfo">
													<a href={r.url} target="_blank" rel="noopener noreferrer">
														<b>{r.name}</b>
													</a>
													<small>
														<span className={`adm__tag ${r.private ? "priv" : ""}`}>{t(r.private ? A.priv : A.pub)}</span>
														{!r.mine && <span className="adm__tag">{t(A.collab)}</span>}
														{on && <span className="adm__tag on">{t(A.onSite)}</span>}
														{r.archived && <span className="adm__tag">{t(A.archived)}</span>}
														{r.language && <span>{r.language}</span>}
														{r.pushedAt && <time>{r.pushedAt.slice(0, 10)}</time>}
													</small>
												</div>
												<button
													type="button"
													className={`adm__mini${on ? " on" : ""}`}
													disabled={on || picks.length >= 8}
													title={picks.length >= 8 ? t(A.max) : undefined}
													onClick={() => setPicks((x) => [...x, { name: r.name, label: "", blurb: "", link: r.homepage ?? "" }])}
												>
													{on ? "✓" : t(A.add)}
												</button>
											</li>
										);
									})}
								</ul>
							</>
						)}
					</div>
				</>
			)}
		</section>
	);
}
