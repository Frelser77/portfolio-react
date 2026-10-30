import { useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiBell, FiCheckCircle, FiCpu, FiDatabase, FiGithub, FiInbox, FiInfo, FiLock, FiLogOut, FiMail, FiRefreshCw, FiShield, FiCopy, FiSmartphone, FiMonitor, FiGitBranch, FiSettings, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from "react-icons/fi";
import type { AdminRepo } from "../api";
import { ui2 } from "../content/ui2";
import { projects as allProjects, type L } from "../content/data";
import { usePrefs } from "../prefs";
import { siteSwitches } from "../content/adminSite";
import { applyHidden } from "../siteFlags";

interface Row {
	id: number;
	created_at: string;
	name: string;
	reach: string;
	need: string;
	message: string;
	archived?: number;
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

/** Dopo un salvataggio si scarta la copia locale, così il sito mostra subito il nuovo contenuto. */
const forget = (k: string) => {
	try {
		localStorage.removeItem(k);
	} catch {
		/* ok */
	}
};

/** Pannello riservato: richieste, stato del sistema e repository. La chiave vale una volta sola: poi resta una sessione di 7 giorni (cookie HttpOnly). */
export default function AdminPage() {
	const { t } = usePrefs();
	const [key, setKey] = useState("");
	const [phase, setPhase] = useState<"check" | "out" | "in">("check");
	const [fail, setFail] = useState<Fail>("");
	const [tab, setTab] = useState<"req" | "site" | "repos" | "sys">(() => {
		try {
			const v = localStorage.getItem("fr7-adm-tab");
			return v === "site" || v === "repos" || v === "sys" ? v : "req";
		} catch {
			return "req";
		}
	});
	const [hid, setHid] = useState<string[]>([]);
	const [flash, setFlash] = useState<"" | "ok" | "fail">("");
	const [bf, setBf] = useState<"new" | "arch" | "all">("new");
	const [bsel, setBsel] = useState<number[]>([]);
	const [bask, setBask] = useState<"" | "delete">("");
	const pickTab = (k: "req" | "site" | "repos" | "sys") => {
		setTab(k);
		try {
			localStorage.setItem("fr7-adm-tab", k);
		} catch {
			/* nessuna memoria */
		}
	};
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
	interface Ord { id: string; hidden: boolean }
	const [ord, setOrd] = useState<Ord[]>([]);
	const [ordBase, setOrdBase] = useState("[]");
	const [ordSaved, setOrdSaved] = useState<"" | "ok" | "fail">("");
	const [q, setQ] = useState("");
	const [flt, setFlt] = useState<"active" | "all" | "pub" | "priv" | "mine" | "collab" | "arch">("active");
	const [chosen, setChosen] = useState<string[]>([]);
	const [ask, setAsk] = useState<"" | "private" | "archive" | "unarchive" | "public">("");
	const [report, setReport] = useState<{ ok: number; bad: number; errors: string[] } | null>(null);

	// su telefono il pannello diventa un'app: niente barra del sito, schede in basso
	useEffect(() => {
		document.documentElement.classList.add("adm-app");
		return () => document.documentElement.classList.remove("adm-app");
	}, []);

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

	/** Interruttore: cambia subito sullo schermo e salva da solo; se il salvataggio fallisce torna com'era. */
	const toggleKey = async (k: string) => {
		const before = hid;
		const next = hid.includes(k) ? hid.filter((x) => x !== k) : [...hid, k];
		setHid(next);
		setFlash("");
		try {
			const r = await fetch("/api/admin/site", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ hidden: next }) });
			if (!r.ok || !isJson(r)) throw new Error("save");
			const j = (await r.json()) as { hidden: string[] };
			setHid(j.hidden);
			applyHidden(j.hidden);
			setFlash("ok");
		} catch {
			setHid(before);
			setFlash("fail");
		}
		window.setTimeout(() => setFlash(""), 2200);
	};
	const refreshDigest = async () => {
		setFlash("");
		try {
			const r = await fetch("/api/admin/site", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ refreshDigest: true }) });
			setFlash(r.ok ? "ok" : "fail");
		} catch {
			setFlash("fail");
		}
		window.setTimeout(() => setFlash(""), 2200);
	};

	const loadData = useCallback(async () => {
		try {
			const sr = await fetch("/api/admin/site", { credentials: "same-origin" });
			if (sr.ok && isJson(sr)) setHid(((await sr.json()) as { hidden: string[] }).hidden);
		} catch {
			/* resta tutto visibile */
		}
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
			const o = await fetch("/api/admin/projects", { credentials: "same-origin" });
			const rows = o.ok && isJson(o) ? ((await o.json()) as { rows: { id: string; hidden: number }[] }).rows : [];
			const pos = new Map(rows.map((r, n) => [r.id, n] as const));
			const hid = new Set(rows.filter((r) => r.hidden).map((r) => r.id));
			const list = allProjects.map((p, n) => ({ id: p.id, hidden: hid.has(p.id), k: pos.get(p.id) ?? 1000 + n })).sort((a, b) => a.k - b.k).map(({ id, hidden }) => ({ id, hidden }));
			setOrd(list);
			setOrdBase(JSON.stringify(list));
		} catch {
			/* ordine di default */
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
	const briefAction = async (action: "archive" | "unarchive" | "delete", ids: number[]) => {
		if (!ids.length) return;
		setBusy(true);
		try {
			const r = await fetch("/api/admin/briefs-action", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ids }) });
			if (r.ok) {
				setRows((cur) => (cur ?? []).flatMap((x) => (!ids.includes(x.id) ? [x] : action === "delete" ? [] : [{ ...x, archived: action === "archive" ? 1 : 0 }])));
				setBsel((cur) => cur.filter((id) => !ids.includes(id)));
			}
		} catch {
			/* riprova */
		}
		setBask("");
		setBusy(false);
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
	const ordDirty = JSON.stringify(ord) !== ordBase;
	const ordMove = (i: number, d: number) =>
		setOrd((p) => {
			const j = i + d;
			if (j < 0 || j >= p.length) return p;
			const n = [...p];
			[n[i], n[j]] = [n[j], n[i]];
			return n;
		});
	const saveOrd = async () => {
		setBusy(true);
		setOrdSaved("");
		try {
			const r = await fetch("/api/admin/projects", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: ord }) });
			setOrdSaved(r.ok ? "ok" : "fail");
			if (r.ok) {
				setOrdBase(JSON.stringify(ord));
				forget("fr7-order");
			}
		} catch {
			setOrdSaved("fail");
		}
		setBusy(false);
	};
	const savePicks = async () => {
		setBusy(true);
		setSaved("");
		try {
			const r = await fetch("/api/admin/featured", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: picks }) });
			setSaved(r.ok ? "ok" : "fail");
			if (r.ok) {
				setBase(JSON.stringify(picks));
				forget("fr7-gh");
			}
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
	const shown = (rows ?? []).filter((x) => (bf === "all" ? true : bf === "arch" ? !!x.archived : !x.archived));
	const alerts = checks.filter((c) => !c.ok).length;
	const level = (c: (typeof checks)[number]): Level => (c.ok ? "ok" : c.optional ? "info" : "warn");

	return (
		<section className="sec adm">
			{flash && (
				<p className={`adm__toast ${flash}`} role="status">
					{flash === "ok" ? <FiCheckCircle aria-hidden="true" /> : <FiAlertTriangle aria-hidden="true" />}
					{t(flash === "ok" ? A.visSaved : A.visFail)}
				</p>
			)}
			<div className="adm__head">
				<div>
					<h1 className="h2">{t(A.title)}</h1>
					<p className="muted">{t(A.sub)}</p>
				</div>
				{phase === "in" && (
					<div className="adm__tools">
						<button type="button" className="btn glass sm" onClick={refresh} disabled={busy}>
							<FiRefreshCw aria-hidden="true" className={busy ? "spin" : undefined} />
							<span className="adm__lbl">{t(A.refresh)}</span>
						</button>
						<button type="button" className="btn glass sm" onClick={logout}>
							<FiLogOut aria-hidden="true" />
							<span className="adm__lbl">{t(A.logout)}</span>
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
					{tab === "sys" && (
						<div className="adm__sys" role="tabpanel" id="panel-sys" aria-labelledby="tab-sys">
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
						</div>
					)}

					<div className="adm__tabs glass" role="tablist" aria-label={t(A.title)} data-lg="off">
						{(
							[
								["req", FiInbox, A.tabReq, (rows ?? []).filter((x) => !x.archived).length, false],
								["site", FiMonitor, A.tabSite, picks.length, dirty || ordDirty],
								["repos", FiGitBranch, A.tabRepos, Array.isArray(repos) ? repos.length : 0, false],
								["sys", FiSettings, A.sysBtn, alerts, false],
							] as const
						).map(([k, Ico, label, n, dot]) => (
							<button key={k} type="button" role="tab" id={`tab-${k}`} aria-selected={tab === k} aria-controls={`panel-${k}`} className="adm__tab" onClick={() => pickTab(k)}>
								<Ico aria-hidden="true" />
								<span className="adm__tabl">{t(label)}</span>
								{n > 0 && <span className="adm__count">{n}</span>}
								{dot && <i className="adm__dot" aria-label={t(A.unsaved)} />}
							</button>
						))}
					</div>

					{tab === "req" && (
						<div role="tabpanel" id="panel-req" aria-labelledby="tab-req">
<div className="glass adm__card" data-lg-bezel="26">
						<div className="adm__top">
							<h2 className="h3">{t(A.briefsTitle)}</h2>
							{rows && rows.length > 0 && <span className="adm__badge ok">{rows.filter((x) => !x.archived).length}</span>}
						</div>
						{rows && rows.length > 0 && (
							<div className="adm__sticky adm__sticky--b">
								<div className="adm__chips" role="group">
									{(
										[
											["new", A.bNew, rows.filter((x) => !x.archived).length],
											["arch", A.bArch, rows.filter((x) => x.archived).length],
											["all", A.fAll, rows.length],
										] as const
									).map(([k, label, n]) => (
										<button key={k} type="button" className="cchip" aria-pressed={bf === k} onClick={() => { setBf(k); setBsel([]); }}>
											{t(label)} · {n}
										</button>
									))}
								</div>
							</div>
						)}
						{rows && rows.length === 0 && (
							<div className="adm__empty">
								<FiInbox aria-hidden="true" />
								<b>{t(A.emptyTitle)}</b>
								<p className="muted">{t(A.empty)}</p>
							</div>
						)}
						{rows && rows.length > 0 && (
							<>
								<div className="adm__bar">
									<button type="button" className="adm__mini" onClick={() => setBsel(shown.map((x) => x.id))}>
										{t(A.selVisible)}
									</button>
									{bsel.length > 0 && (
										<button type="button" className="adm__mini" onClick={() => setBsel([])}>
											{t(A.selNone)}
										</button>
									)}
									<span className="muted">
										{bsel.length} {t(A.selected)} · {shown.length}
									</span>
								</div>
								{shown.length === 0 && <p className="muted adm__sub">{bf === "new" ? t(A.bAllDone) : t(A.nothing)}</p>}
								<ul className="adm__list adm__briefs" role="list">
									{shown.map((r) => (
										<li key={r.id} className={r.archived ? "is-arch" : undefined}>
											<div className="adm__row">
												<input type="checkbox" checked={bsel.includes(r.id)} onChange={() => setBsel((c) => (c.includes(r.id) ? c.filter((x) => x !== r.id) : [...c, r.id]))} aria-label={r.name || String(r.id)} />
												<b>{r.name || "—"}</b>
												{r.need && <span className="adm__tag">{r.need}</span>}
												{r.archived ? <span className="adm__tag">{t(A.archived)}</span> : null}
												<time>{r.created_at}</time>
											</div>
											<a className="adm__mail" href={r.reach.includes("@") ? `mailto:${r.reach}` : undefined}>
												<FiMail aria-hidden="true" />
												{r.reach}
											</a>
											<p>{r.message}</p>
											<div className="adm__bar adm__rowacts">
												<button type="button" className="adm__mini" disabled={busy} onClick={() => briefAction(r.archived ? "unarchive" : "archive", [r.id])}>
													{r.archived ? t(A.bRestore) : t(A.bDone)}
												</button>
												<button type="button" className="adm__mini danger" disabled={busy} onClick={() => { setBsel([r.id]); setBask("delete"); }}>
													{t(A.bDelete)}
												</button>
											</div>
										</li>
									))}
								</ul>
								{bsel.length > 0 && (
									<div className="adm__bar adm__acts adm__dockbar">
										{bf !== "arch" && (
											<button type="button" className="adm__mini on" disabled={busy} onClick={() => briefAction("archive", bsel)}>
												{t(A.bDone)} ({bsel.length})
											</button>
										)}
										{bf !== "new" && (
											<button type="button" className="adm__mini" disabled={busy} onClick={() => briefAction("unarchive", bsel)}>
												{t(A.bRestore)} ({bsel.length})
											</button>
										)}
										<button type="button" className="adm__mini danger" disabled={busy} onClick={() => setBask("delete")}>
											{t(A.bDelete)} ({bsel.length})
										</button>
									</div>
								)}
								{bask === "delete" && bsel.length > 0 && (
									<div className="adm__note warn adm__confirm" role="alertdialog">
										<FiAlertTriangle aria-hidden="true" />
										<span>
											<b>
												{t(A.bDelete)} · {bsel.length}
											</b>
											<small>{t(A.bConfirm)}</small>
											<span className="adm__bar">
												<button type="button" className="adm__mini danger on" onClick={() => briefAction("delete", bsel)} disabled={busy}>
													{t(A.confirm)}
												</button>
												<button type="button" className="adm__mini" onClick={() => setBask("")} disabled={busy}>
													{t(A.cancel)}
												</button>
											</span>
										</span>
									</div>
								)}
							</>
						)}
					</div>
						</div>
					)}

					{tab === "site" && (
						<div role="tabpanel" id="panel-site" aria-labelledby="tab-site">
							<div className="glass adm__card adm__vis" data-lg-bezel="26">
								<div className="adm__top">
									<div>
										<h2 className="h3">{t(A.visTitle)}</h2>
										<p className="muted adm__sub">{t(A.visText)}</p>
									</div>
								</div>
								{siteSwitches.map((g) => (
									<div key={g.group.it} className="adm__grp">
										<h3 className="adm__grph">{t(g.group)}</h3>
										<ul className="adm__sw" role="list">
											{g.items.map((it) => {
												const on = !hid.includes(it.key);
												return (
													<li key={it.key}>
														<button type="button" role="switch" aria-checked={on} className={`adm__swrow${on ? " on" : ""}`} onClick={() => toggleKey(it.key)}>
															<span className="adm__swtxt">
																<b>{t(it.label)}</b>
																<small>{t(it.hint)}</small>
															</span>
															<i className="adm__knob" aria-hidden="true" />
														</button>
													</li>
												);
											})}
										</ul>
									</div>
								))}
								<button type="button" className="btn glass sm" onClick={refreshDigest}>
									<FiRefreshCw aria-hidden="true" />
									{t(A.visDigest)}
								</button>
							</div>
							<div className="glass adm__card" data-lg-bezel="26">
								<div className="adm__top">
									<div>
										<h2 className="h3">{t(A.ordTitle)}</h2>
										<p className="muted adm__sub">{t(A.ordText)}</p>
									</div>
								</div>
								<ol className="adm__ord" role="list">
									{ord.map((o, i) => {
										const p = allProjects.find((x) => x.id === o.id);
										return (
											<li key={o.id} className={o.hidden ? "off" : ""}>
												<span className="adm__ordn">{i + 1}</span>
												<b>{p?.name ?? o.id}</b>
												{o.hidden && <span className="adm__tag">{t(A.ordHidden)}</span>}
												<span className="adm__ordbtns">
													<button type="button" className="adm__mini adm__ic" onClick={() => ordMove(i, -1)} disabled={i === 0} aria-label={t(A.up)}>
														<FiChevronUp aria-hidden="true" />
													</button>
													<button type="button" className="adm__mini adm__ic" onClick={() => ordMove(i, 1)} disabled={i === ord.length - 1} aria-label={t(A.down)}>
														<FiChevronDown aria-hidden="true" />
													</button>
													<button type="button" className="adm__mini adm__ic" onClick={() => setOrd((x) => x.map((y, n) => (n === i ? { ...y, hidden: !y.hidden } : y)))} aria-label={t(o.hidden ? A.ordShow : A.ordHide)} aria-pressed={!o.hidden}>
														{o.hidden ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
													</button>
												</span>
											</li>
										);
									})}
								</ol>
								<div className={`adm__save${ordDirty ? " dirty" : ""}`}>
									<span>{ordDirty ? t(A.unsaved) : t(A.inSync)}</span>
									<span className="adm__tools">
										{ordDirty && (
											<button type="button" className="btn glass sm" onClick={() => setOrd(JSON.parse(ordBase) as Ord[])} disabled={busy}>
												{t(A.cancel)}
											</button>
										)}
										<button type="button" className="btn pri sm" onClick={saveOrd} disabled={busy || !ordDirty}>
											{t(A.save)}
										</button>
									</span>
								</div>
								{ordSaved && (
									<p className={`adm__note ${ordSaved === "ok" ? "ok" : "warn"}`} role="status">
										{ordSaved === "ok" ? <FiCheckCircle aria-hidden="true" /> : <FiAlertTriangle aria-hidden="true" />}
										<span>{t(ordSaved === "ok" ? A.saved : A.saveFail)}</span>
									</p>
								)}
							</div>
							<div className="glass adm__card" data-lg-bezel="26">
								<div className="adm__top">
									<div>
										<h2 className="h3">{t(A.featTitle)}</h2>
										<p className="muted adm__sub">{t(A.featText)}</p>
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
								<label className="adm__add">
									<span>{t(A.addRepo)}</span>
									<select
										value=""
										disabled={picks.length >= 8}
										onChange={(e) => {
											const r = repoByName.get(e.target.value);
											if (r) setPicks((x) => [...x, { name: r.name, label: "", blurb: "", link: r.homepage ?? "" }]);
										}}
									>
										<option value="">{picks.length >= 8 ? t(A.max) : t(A.chooseRepo)}</option>
										{repos
											.filter((r) => !r.archived && !picks.some((x) => x.name === r.name))
											.map((r) => (
												<option key={r.name} value={r.name}>
													{r.name}
													{r.private ? " 🔒" : ""}
												</option>
											))}
									</select>
								</label>
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
									</>
								)}
							</div>
						</div>
					)}

					{tab === "repos" && (
						<div role="tabpanel" id="panel-repos" aria-labelledby="tab-repos">
							<div className="glass adm__card" data-lg-bezel="26">
								<div className="adm__top">
									<div>
										<h2 className="h3">{t(A.allRepos)}</h2>
										<p className="muted adm__sub">{t(A.reposSub)}</p>
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
								<div className="adm__sticky">
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
								</div>
								{chosen.length > 0 && !ask && (
									<div className="adm__bar adm__acts adm__dockbar">
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
						</div>
					)}
				</>
			)}
		</section>
	);
}
