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
