# CMS and site tickets

Build order for project cards, project detail pages, About editing, UploadThing, `/admin`, and public-site polish.

Roles live on `User` in Postgres. There is no `ADMIN_EMAILS` env var.

| # | File | Depends on |
| --- | --- | --- |
| 001 | [uploadthing-foundation.md](./001-uploadthing-foundation.md) | — |
| 002 | [user-roles-and-admin-seed.md](./002-user-roles-and-admin-seed.md) | — |
| 003 | [prisma-content-models-and-seed.md](./003-prisma-content-models-and-seed.md) | — |
| 004 | [public-homepage-from-db.md](./004-public-homepage-from-db.md) | 003 |
| 005 | [project-detail-page.md](./005-project-detail-page.md) | 003, 004 |
| 006 | [admin-projects-table.md](./006-admin-projects-table.md) | 002, 003 |
| 007 | [admin-project-form.md](./007-admin-project-form.md) | 001, 006 |
| 008 | [admin-about-page.md](./008-admin-about-page.md) | 001, 006 |
| 009 | [homepage-admin-shortcuts.md](./009-homepage-admin-shortcuts.md) | 006, 007, 008 |
| 010 | [remove-contact-form.md](./010-remove-contact-form.md) | — |
| 011 | [instagram-and-remove-behance.md](./011-instagram-and-remove-behance.md) | — |
| 012 | [seo.md](./012-seo.md) | 005 (for project OG); rest independent |
| 013 | [nexelon-credit.md](./013-nexelon-credit.md) | — |

001–003 can start in parallel. Public pages (004–005) need 003. Admin UI (006–009) needs 002.

**010, 011, 013** are public-site changes and can ship before the CMS. **003** already includes seeding the four current hardcoded projects (not a separate ticket).
