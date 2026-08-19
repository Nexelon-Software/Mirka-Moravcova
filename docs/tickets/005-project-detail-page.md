# 005 — Project detail page

**Status:** todo  
**Depends on:** 003, 004  
**Blocks:** none (007 writes the fields this page reads)

## Goal

Each homepage card opens a public subpage with the full project: cover, tags, short description, longer body, gallery.

## Route

`src/app/projekty/[slug]/page.tsx`

- 404 if slug missing or `published === false` (admins preview unpublished in `/admin`, not here, unless you add a later ticket).
- Layout: same typography / colors as the homepage (Cormorant headings, muted body).
- Back link to `/#projekty`.
- Gallery: `ProjectImage` ordered by `sortOrder`. If none, show cover only.
- `generateMetadata` from `title` + `description` (full Open Graph / canonical rules are in 012; this ticket at least sets unique title and description per slug).

## Acceptance criteria

- [ ] Seeded cards navigate to a working slug page.
- [ ] Unpublished slugs 404 for anonymous visitors.
- [ ] Extra images render in order when present.

## Out of scope

- Admin edit button on the public detail page (optional later; homepage Upraviť is 009).
