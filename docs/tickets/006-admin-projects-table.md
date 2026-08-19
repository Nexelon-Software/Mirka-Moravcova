# 006 — Admin: `/admin` project table

**Status:** done  
**Depends on:** 002, 003  
**Blocks:** 007, 008, 009

## Goal

Mirka’s workspace is a **sub-site**, not a modal. `/admin` shows a table of all projects (including drafts). From here she adds, edits, or deletes a row. Long forms live on their own routes (007).

## Routes

| Path | Purpose |
| --- | --- |
| `/admin` | Redirect to `/admin/projekty` or the table itself |
| `/admin/projekty` | Table |
| `/admin/o-mne` | Link only in this ticket; page is 008 |

`src/app/admin/layout.tsx`: Slovak nav (Projekty, O mne, Späť na web), session name, Odhlásiť. Non-admin → redirect `/`.

## Table

Columns: cover thumb, title, category (Slovak label), published yes/no, updated, actions.

Actions:

- **Pridať projekt** → `/admin/projekty/new` (007)
- **Upraviť** → `/admin/projekty/[id]` (007)
- **Zmazať** → confirm, then delete row + related `ProjectImage`. If UploadThing keys exist, delete files via UTApi (can land in 007 if 001 keys are not stored yet).

List **all** projects, drafts first or by `sortOrder`. tRPC: `project.adminList`, `project.adminDelete` as `adminProcedure`.

Style: quiet, site-like (not a generic dashboard chrome). No need for drag-and-drop reorder in this ticket; `sortOrder` can be a number on the form in 007.

## Acceptance criteria

- [ ] `USER` and logged-out users cannot see `/admin`.
- [ ] Admin sees every project in a table and can delete with confirm.
- [ ] Add / Edit links exist even if 007 is a stub “coming soon” for one commit — prefer implementing 007 immediately after.

## Out of scope

- The long project form (007), About editor (008).
