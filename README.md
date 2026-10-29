# Portfolio di Salvatore D'Amico

Sito personale: una sola pagina, in italiano e in inglese, con un design a vetro scuro e la mascotte FR7 Bot. Non usa cookie né tracciamento.

- **Stack:** React 19, TypeScript, Vite e CSS scritto a mano. I font sono serviti dal sito stesso, non da Google Fonts.
- **Contenuti:** testi, progetti, percorso e attestati stanno tutti in `src/content/data.ts`. I testi dell'interfaccia sono in `src/content/ui.ts`.
- **Indirizzo del sito:** si imposta in `vite.config.ts` (costante `SITE_URL`). Da lì si aggiornano canonical, Open Graph, sitemap e robots.txt.

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # crea la cartella dist/
npm run typecheck  # controllo dei tipi TypeScript
```

## Aggiungere un progetto

Aggiungi un oggetto all'array `projects` in `src/content/data.ts`:

- con `status: "live"` e un campo `preview`, il progetto finisce in evidenza con l'anteprima su telefono;
- tutti gli altri compaiono nella lista filtrabile.

Per collegarlo a un livello della traccia nell'hero, aggiungi il suo `id` a `layers[].projects`.

## Pubblicazione su Cloudflare Pages (gratis)

1. Vai su dash.cloudflare.com, poi **Workers & Pages → Create → Pages → Connect to Git**.
2. Scegli il repository `Frelser77/portfolio-react` e il branch da pubblicare.
3. Imposta la build:
   - Framework preset: `Vite` (oppure `None`)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variabile d'ambiente: `NODE_VERSION` = `22`
4. Il progetto è un Worker chiamato `portfolio` (vedi `wrangler.jsonc`): l'indirizzo è `https://portfolio.damicosalvatorealessandro.workers.dev`. Se cambi nome o dominio, aggiorna `SITE_URL` in `vite.config.ts`.

Ogni push sul branch scelto pubblica il sito in automatico. Gli header di sicurezza e di cache sono in `public/_headers`.

## Backend su Cloudflare (Worker)

Il sito è multipagina (`/`, `/progetti`, `/progetti/:id`, `/stack`, `/lab`, `/chi-sono`, `/contatti`). Un Worker (`worker/index.ts`) risponde solo a `/api/*`; il resto è servito come file statici.

| Endpoint | Cosa fa | Richiede |
| --- | --- | --- |
| `GET /api/health` | cosa è attivo | niente |
| `GET /api/github` | attività GitHub in cache (1 ora) | niente |
| `POST /api/chat` | chat con FR7 Bot in streaming | binding `AI` (Workers AI) |
| `POST /api/plan` | dal problema al piano (JSON validato) | binding `AI` |
| `POST /api/visit`, `GET /api/stats`, `POST /api/likes` | visite anonime e "mi piace" | binding `DB` (D1) |
| `POST /api/brief` | richieste dal modulo contatti | `DB` e/o secret `NOTIFY_WEBHOOK` |
| `GET /api/admin/briefs` | elenco richieste (pagina `/admin`) | `DB` + secret `ADMIN_TOKEN` |
| `GET/POST /api/admin/featured` | repository scelti dal pannello per la pagina Stack (tabella D1 `featured`) | `DB` + `ADMIN_TOKEN` + `GITHUB_TOKEN` |
| `POST /api/admin/repo-action` | rende privati/pubblici o archivia repo dal pannello (mai cancella; serve essere admin del repo) | `ADMIN_TOKEN` + `GITHUB_TOKEN` (classic, scope `repo`) |
| `POST /api/admin/totp-setup`, `POST /api/admin/logout-all` | genera il segreto del 2FA da mettere in Cloudflare; esce da tutti i dispositivi | `ADMIN_TOKEN` (+ `DB` per l'uscita globale) |
| `GET /api/admin/repos` | tutti i repo (privati e di collaborazione), solo in `/admin` | `ADMIN_TOKEN` + `GITHUB_TOKEN` |

Senza uno di questi pezzi il sito continua a funzionare: la chat risponde dai dati del sito, i contatori spariscono, il modulo usa email/WhatsApp.

### Attivare database e notifiche
1. **D1**: in `wrangler.jsonc` aggiungi `"d1_databases": [{ "binding": "DB" }]` (provisioning automatico) oppure crea il database dalla dashboard e inserisci `database_name` e `database_id`. Le tabelle si creano da sole alla prima richiesta.
2. **Secret** (dashboard → Worker → Settings → Variables and Secrets): `ADMIN_TOKEN` (una password lunga per `/admin`), facoltativo `GITHUB_TOKEN` (token GitHub in sola lettura: la pagina Stack mostra lingue e contributi anche dei repo privati, ma solo come numeri; i nomi compaiono solo in `/admin`), facoltativo `NOTIFY_WEBHOOK` (URL webhook Slack/Discord per ricevere le richieste), consigliato `ADMIN_TOTP` (segreto del 2FA: si genera da `/admin` › Sicurezza › Attiva il 2FA; con questo, per entrare servono chiave **e** codice a 6 cifre dell'app, e dopo 5 errori il login si blocca 15 minuti), facoltativo `SALT` (stringa casuale per gli hash anonimi).
3. Workers AI ha una quota gratuita giornaliera; se finisce, il sito ricade sulle risposte locali.
