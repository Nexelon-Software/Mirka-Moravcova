# 003 — Prisma content models and seed

**Status:** done  
**Depends on:** none (can land with 002 in the same seed file)  
**Blocks:** 004, 005, 006

## Goal

Replace the hardcoded homepage arrays with Postgres models so admin CRUD has somewhere to write.

## Models

### `Project`

- `id`, `slug` (unique), `title`
- `description` — short text on the homepage card
- `body` — longer text on `/projekty/[slug]` (plain text + line breaks; no markdown renderer in v1)
- `category` — enum matching current chips: `RESIDENTIAL` (Rezidenčné projekty), `COMMERCIAL` (Komerčné priestory), `CONCEPT` (Koncepty & Štúdie)
- `tags` — `String[]` (e.g. Rekonštrukcia, Vizualizácia)
- `coverImageUrl`, `coverImageKey` (UploadThing key for later delete), `coverImageAlt`
- `published` — unpublished rows are omitted from the public site
- `sortOrder` — lower first
- `createdAt`, `updatedAt`

### `ProjectImage`

- `id`, `projectId`, `url`, `key`, `alt`, `caption?`, `sortOrder`

### `SiteContent`

Singleton for **O mne** (one row, id `"about"` or similar):

- `heading` (default `"O mne"`)
- `paragraph1`, `paragraph2`
- `portraitUrl`, `portraitKey`
- `skills` — `String[]`

Drop unused T3 `Post` model and `post` tRPC router when convenient (this ticket or a tiny follow-up in the same PR).

## Seed — reuse the current hardcoded projects

`prisma/seed.ts` must insert the **same four cards** that live in `src/app/page.tsx` today, plus plausible extra fields so `/projekty/[slug]` is not empty. Covers stay on local files until Mirka re-uploads in admin.

| sortOrder | slug | title | category | tags | cover |
| --- | --- | --- | --- | --- | --- |
| 1 | `byt-brno-kralovo-pole` | Byt Brno — Královo Pole | `RESIDENTIAL` | Rekonštrukcia, Vizualizácia | `/images/projekt-1.jpg` |
| 2 | `tichy-dom-spalnove-zona` | Tichý dom — spálňová zóna | `RESIDENTIAL` | Vizualizácia, Nábytok na mieru | `/images/projekt-2.jpg` |
| 3 | `showroom-neutral` | Showroom Neutral | `COMMERCIAL` | Koncept, Retail | `/images/projekt-3.jpg` |
| 4 | `materialova-studia-warm-neutrals` | Materiálová štúdia — Warm Neutrals | `CONCEPT` | Štúdia, Materiály | `/images/projekt-4.jpg` |

Card `description` (copy verbatim):

- Byt Brno: *Kompletná rekonštrukcia bytu 2+kk s dôrazom na svetlo a úložné riešenia.*
- Tichý dom: *Štúdia nočnej zóny rodinného domu s celodrevenou stenou a integrovaným nábytkom.*
- Showroom: *Koncept predajne módy a keramiky s modulárnym výstavným systémom.*
- Materiálová štúdia: *Výskum kombinácií prírodných materiálov a ich správania v dennom svetle.*

Also seed for each project:

- `published: true`
- `body` — 2–3 Slovak paragraphs expanding the card (mocked; not invented as a different project)
- `coverImageAlt` matching current `alt`
- at least one `ProjectImage` (the cover URL is enough) so the gallery is not empty

**O mne** singleton — copy current copy, `/images/portret.jpg`, skills: 3ds Max, Corona Renderer, AutoCAD, SketchUp, ArchiCAD, Adobe Photoshop, Adobe InDesign, Enscape.

Idempotent seed (`deleteMany` content tables then insert, or upsert by slug). Do not wipe Better Auth users.

Public pages must not go empty after migrate+seed.

## Acceptance criteria

- [ ] Migration applies on the existing Postgres (Supabase).
- [ ] Seed inserts exactly these 4 published projects (titles/descriptions match the homepage) + 1 About row + gallery rows.
- [ ] `slug` is unique; unpublished is supported on the model even if the admin UI comes later.
- [ ] Re-running seed does not duplicate projects.

## Out of scope

- Reading these models on the homepage (004), UploadThing URLs as the only image source.
