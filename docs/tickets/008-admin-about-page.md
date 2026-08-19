# 008 — Admin: edit O mne

**Status:** todo  
**Depends on:** 001, 006  
**Blocks:** 009

## Goal

`/admin/o-mne` edits the About singleton: portrait, heading, two paragraphs, skills. Same idea as projects — a real page, not an overlay on the homepage.

## Fields

- Portrait — UploadThing `aboutPortrait`; replacing deletes the previous `portraitKey`
- Heading
- Paragraph 1, paragraph 2
- Skills — list of strings (add/remove rows)

tRPC `siteContent.get` (public) already used on the homepage; `siteContent.adminUpdate` is `adminProcedure`. Never insert a second About row.

## Acceptance criteria

- [ ] Saving updates `#o-mne` on `/` after refresh (or revalidate).
- [ ] Portrait can be changed without breaking `next/image`.
- [ ] Skills can be added and removed.
- [ ] Non-admin cannot update.

## Out of scope

- Hero, contact block, software logos.
