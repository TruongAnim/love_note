# Love Note

A personal timeline site for a couple's story — hero intro, a milestone timeline, two "special" full-page chapters, and a stats/metrics popup. Content lives in Firestore; the site itself is a static React SPA that reads it at runtime.

## Tech stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- Tailwind CSS v4
- [Firebase Firestore](https://firebase.google.com/docs/firestore) — read-only from the browser, written via an admin script
- Deployed to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

## Project structure

```
src/
  App.tsx              # all UI: navbar, hero, milestone timeline, special sections, popups
  translations.ts       # UI copy (buttons, nav labels, headings) — EN + ZH, only for interface strings
  services/
    firebase.ts          # Firestore client init (reads VITE_FIREBASE_* env vars)
    milestones.ts        # MilestoneDoc type + fetchMilestones()
    config.ts            # SiteConfigDoc type + fetchSiteConfig()
    messengerStats.ts    # MessengerStatsDoc type + metric resolution/formatting for the stats UI

data/
  milestones.json       # source of truth for the timeline — edit this, then run a sync script
  site-config.json      # source of truth for hero copy, people, stats, footer — same deal

scripts/
  lib/firestore.ts      # shared admin SDK init + JSON read + timestamped backup helper
  sync-milestones.ts    # backs up, wipes, and rewrites the `milestones` collection from data/milestones.json
  sync-config.ts        # backs up and overwrites the `config/site` document from data/site-config.json

backups/                 # timestamped JSON snapshots written by the sync scripts before every overwrite (gitignored)
```

### Firestore collections

| Path | Written by | Holds |
| --- | --- | --- |
| `milestones/{id}` | `npm run sync:milestones` | timeline entries, including the special full-page chapters |
| `config/site` | `npm run sync:config` | hero copy, people, footer, and the *labels* for the stats UI |
| `messenger_stats/{conversation}` | external Messenger export tooling | raw conversation numbers powering "The Metrics of Us" |

### Why data lives in Firestore instead of the code

Everything that's about *this couple's story* (milestone content, hero copy, names, avatars, social links, stats) lives in Firestore, edited via the JSON files in `data/`. Everything that's *interface chrome* (button labels, nav item names, section headings like "By The Numbers") stays in `src/translations.ts`, since it only changes when the UI itself is redesigned.

The website only ever **reads** from Firestore with a public client config — see `.env.local`. It never writes; all writes go through the sync scripts using an admin service account key, which bypasses Firestore Security Rules entirely. Firestore rules only need to allow public `read`, and deny `write`.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - `VITE_FIREBASE_*` — from Firebase Console → Project Settings → Your apps (public client config, safe to expose in the browser bundle)
   - `GEMINI_API_KEY` — only needed if you use the Gemini API integration
3. To run the sync scripts (writing to Firestore), download a **service account key** from Firebase Console → Project Settings → Service Accounts → Generate new private key, and save it as `serviceAccountKey.json` at the repo root. This file is gitignored — never commit it, it's an admin credential, not a public config.

## Running locally

```
npm run dev
```

## Editing content

The site never gets edited directly for content changes — edit the JSON, then sync:

```
npm run sync              # syncs both milestones and config
npm run sync:milestones   # data/milestones.json -> milestones collection
npm run sync:config       # data/site-config.json -> config/site document
```

Both scripts write a timestamped backup of whatever was already on Firestore to `backups/` before overwriting, so a bad edit is always recoverable.

- **`data/milestones.json`**: an array of timeline entries. Regular entries need `id` (date-based slug), `order`, `date`, `icon` (`heart` | `message` | `sparkles`), bilingual `title`/`description`, optional `image`, and `isHighlight` to feature it on the homepage timeline. Set `isSpecial: true` for a milestone that gets its own full-page section (see existing entries for the full shape: `chapter`, `titleAccent`, `video`, `story`, etc.) — it will automatically get a nav link (if `navLabel` is set), its own section, and a standout card in the "See All Memories" popup that scrolls to it on click.
- **`data/site-config.json`**: hero background/copy/quote, the two people (name, avatar, Facebook link, accent color), the stats tile labels, and the footer line.

Deleting an entry from either JSON file and re-running the sync script removes it from Firestore too — the scripts do a full delete-then-rewrite, not a merge.

### The stats section ("The Metrics of Us")

Every number there comes from `messenger_stats/{id}`, not from the config — the config only decides *which* numbers to show and what to call them:

- `stats.source` picks the conversation document (e.g. `bich_ngoc`).
- Each summary/detail tile names a `metric` instead of carrying a value. Available metrics: `daysTogether` (derived from the first/last message timestamps), `messages`, `text`, `media`, `links`, `unsent`, `reactions`, `activeDays`, `longestStreak`, `avgPerActiveDay`.
- A detail tile can add `subMetric`; its `sub` caption then has any `{value}` token replaced with that number (e.g. `"~{value}/day"` → `~86.26/day`).
- The per-person contribution cards read `bySender[]`, matched to each person by the `messengerName` field in the config — set that to the exact name used in the Messenger export.

Because these numbers live in their own collection, re-running the Messenger export updates the site with no config change and no redeploy. The document also carries `byHour`, `byDay`, `byMonth`, and `topReactions`, which the UI does not use yet.

## Deploying

Live at **https://love.earth.io.vn** — GitHub Pages serving a custom subdomain of `earth.io.vn`, whose DNS is managed in Cloudflare.

Pushing to `main` triggers the GitHub Actions workflow, which builds with Vite and publishes to GitHub Pages. The build needs the same `VITE_FIREBASE_*` values as `.env.local`, set as repository secrets (Settings → Secrets and variables → Actions) under the same names.

Two pieces make the custom domain work, and both must stay in place:

- `public/CNAME` holds the domain, so it survives every deploy (GitHub otherwise drops the setting).
- `VITE_BASE_PATH: /` in the workflow. The site sits at the root of its own subdomain, so it must *not* carry the `/love_note/` prefix that a `user.github.io/repo` URL needs — with the wrong base every asset 404s.

Note that `love-note.earth.io.vn` is a separate Cloudflare R2 bucket holding the images and videos referenced from `data/milestones.json`. It is unrelated to hosting the site, so leave its DNS record alone.

Firestore data itself isn't part of the build — it's fetched at runtime, so updating content via `npm run sync` takes effect immediately on the live site without a redeploy.
