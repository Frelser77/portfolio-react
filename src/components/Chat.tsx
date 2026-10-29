import { useEffect, useRef, useState } from "react";
import { FiSend, FiSquare } from "react-icons/fi";
import { streamChat } from "../api";
import { ui2 } from "../content/ui2";
import { localAnswer } from "../lab/local";
import { usePrefs } from "../prefs";

interface Msg {
	role: "user" | "assistant";
	content: string;
}

/** Chat con FR7 Bot: AI in streaming dal Worker; se non c'è, risponde dai dati del sito. */
export default function Chat() {
	const { t, lang } = usePrefs();
	const [msgs, setMsgs] = useState<Msg[]>([]);
	const [text, setText] = useState("");
	const [busy, setBusy] = useState(false);
	const [mode, setMode] = useState<"unknown" | "live" | "offline">("unknown");
	const ctl = useRef<AbortController | null>(null);
	const log = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = log.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [msgs]);
	useEffect(() => () => ctl.current?.abort(), []);

	const ask = async (q: string) => {
		const question = q.trim().slice(0, 500);
		if (!question || busy) return;
		setText("");
		const history: Msg[] = [...msgs, { role: "user", content: question }];
		setMsgs([...history, { role: "assistant", content: "" }]);
		setBusy(true);
		ctl.current = new AbortController();
		let acc = "";
		const ok = await streamChat(
			history.slice(-8),
			lang,
			(tok) => {
				acc += tok;
				setMsgs((m) => {
					const c = m.slice();
					c[c.length - 1] = { role: "assistant", content: acc };
					return c;
				});
			},
			ctl.current.signal,
		);
		if (ok) setMode("live");
		else {
			setMode("offline");
			const answer = localAnswer(question, lang);
			// scrittura a piccoli passi, per dare la stessa sensazione dello streaming
			for (let i = 0; i < answer.length && !ctl.current.signal.aborted; i += 6) {
				await new Promise((r) => setTimeout(r, 16));
				const part = answer.slice(0, i + 6);
				setMsgs((m) => {
					const c = m.slice();
					c[c.length - 1] = { role: "assistant", content: part };
					return c;
				});
			}
		}
		setBusy(false);
	};

	const stop = () => {
		ctl.current?.abort();
		setBusy(false);
	};

	return (
		<div className="chat glass" data-lg-bezel="26">
			<div className="chat__log" ref={log} role="log" aria-live="polite" aria-label={t(ui2.lab.chat.bot)}>
				<div className="msg bot">
					<span className="who">{t(ui2.lab.chat.bot)}</span>
					<p>{t(ui2.lab.chat.hello)}</p>
				</div>
				{msgs.map((m, i) => (
					<div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
						<span className="who">{m.role === "user" ? t(ui2.lab.chat.you) : t(ui2.lab.chat.bot)}</span>
						<p>{m.content || (busy && i === msgs.length - 1 ? <span className="dots" aria-hidden="true" /> : "")}</p>
					</div>
				))}
			</div>
			<ul className="chips" role="list">
				{ui2.lab.chat.suggestions.map((s) => (
					<li key={s.it}>
						<button type="button" className="cchip" disabled={busy} onClick={() => ask(t(s))}>
							{t(s)}
						</button>
					</li>
				))}
			</ul>
			<form
				className="chat__form"
				onSubmit={(e) => {
					e.preventDefault();
					ask(text);
				}}
			>
				<label className="sr-only" htmlFor="chat-q">
					{t(ui2.lab.chat.placeholder)}
				</label>
				<input id="chat-q" type="text" maxLength={500} autoComplete="off" value={text} placeholder={t(ui2.lab.chat.placeholder)} onChange={(e) => setText(e.target.value)} />
				{busy ? (
					<button type="button" className="btn" onClick={stop}>
						<FiSquare aria-hidden="true" />
						{t(ui2.lab.chat.stop)}
					</button>
				) : (
					<button type="submit" className="btn pri" disabled={!text.trim()}>
						<FiSend aria-hidden="true" />
						{t(ui2.lab.chat.send)}
					</button>
				)}
			</form>
			<p className="chat__note">
				{mode !== "unknown" && <span className={`badge ${mode}`}>{mode === "live" ? t(ui2.lab.chat.live) : t(ui2.lab.chat.offline)}</span>} {t(ui2.lab.chat.note)}
			</p>
		</div>
	);
}
