# 009 — Homepage admin shortcuts

**Status:** done  
**Depends on:** 006, 007, 008  
**Blocks:** none

## Goal

The public homepage stays the visitor view. For **ADMIN** only, add discreet shortcuts into `/admin` — not inline editors or modals.

## Shortcuts

| Control | Goes to |
| --- | --- |
| **Pridať projekt** near the Projekty heading | `/admin/projekty/new` |
| **Upraviť** on a project card (already sketched in `page.tsx`) | `/admin/projekty/[id]` — stop using `#projekty` |
| **Upraviť** on the O mne section | `/admin/o-mne` |
| Optional: **Admin** in the header | `/admin/projekty` |

`USER` and logged-out: no extra controls (same as a visitor). Header may still show name + Odhlásiť for `USER`.

Project card `<a>` must go to `/projekty/[slug]`. Put Upraviť **outside** that link (button/link of its own) so Edit does not trigger the public navigation.

## Acceptance criteria

- [ ] Only `role === ADMIN` sees shortcuts.
- [ ] Card click → public detail; Upraviť → admin form.
- [ ] O mne Upraviť → About form.

## Out of scope

- Editing text on the homepage in place.
