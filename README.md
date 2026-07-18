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

data/
  milestones.json       # source of truth for the timeline — edit this, then run a sync script
  site-config.json      # source of truth for hero copy, people, stats, footer — same deal

scripts/
  lib/firestore.ts      # shared admin SDK init + JSON read + timestamped backup helper
  sync-milestones.ts    # backs up, wipes, and rewrites the `milestones` collection from data/milestones.json
  sync-config.ts        # backs up and overwrites the `config/site` document from data/site-config.json

backups/                 # timestamped JSON snapshots written by the sync scripts before every overwrite (gitignored)
```

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
- **`data/site-config.json`**: hero background/copy/quote, the two people (name, avatar, Facebook link, accent color), the stats popup numbers, and the footer line.

Deleting an entry from either JSON file and re-running the sync script removes it from Firestore too — the scripts do a full delete-then-rewrite, not a merge.

## Deploying

Pushing to `main` triggers the GitHub Actions workflow, which builds with Vite and publishes to GitHub Pages. The build needs the same `VITE_FIREBASE_*` values as `.env.local`, set as repository secrets (Settings → Secrets and variables → Actions) under the same names.

Firestore data itself isn't part of the build — it's fetched at runtime, so updating content via `npm run sync` takes effect immediately on the live site without a redeploy.
