# 004 — Public homepage from the database

**Status:** todo  
**Depends on:** 003  
**Blocks:** 005, 009

## Goal

`src/app/page.tsx` loads **Projekty** and **O mne** from Prisma instead of inline arrays. Visitors who are not admin see the same layout as today.

## Implementation notes

- Server Component: `db.project.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } })` and the About singleton.
- Cards link to `/projekty/[slug]` (005 can land right after; until then a placeholder route is fine, but prefer shipping 005 in the same slice if possible).
- Filter chips: **Všetko** + the three categories. Client filter is enough (four items). Empty category → empty grid, not an error.
- `next/image`: support both `/images/...` (seed) and UploadThing hosts (001).
- Do **not** show Upraviť yet (009). Do not hide content behind login.

## Acceptance criteria

- [ ] Homepage matches current visual structure with seeded data.
- [ ] Unpublished projects never appear.
- [ ] Category chips filter the grid.
- [ ] O mne heading, paragraphs, portrait, and skills come from `SiteContent`.

## Out of scope

- Admin shortcuts, hero CMS.
- Contact form (removed in 010), social URLs (011), Nexelon credit (013).
