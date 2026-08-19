# 002 — User roles and admin seed

**Status:** done  
**Depends on:** none  
**Blocks:** 006, 007, 008, 009 (and UploadThing middleware tightening from 001)

## Goal

Permission to edit the site comes from `User.role` in Postgres — **not** from an `ADMIN_EMAILS` env var.

Seed two admins. Anyone else who signs in with Google becomes `USER` and can view the public site but cannot open `/admin`, upload, or see “Upraviť”.

## Seeded admins

| Email | Role | Notes |
| --- | --- | --- |
| `samuel.hrotik@gmail.com` | `ADMIN` | |
| `mirka.moravcova@email.com` | `ADMIN` | Placeholder. Change `user.email` in the DB later (Prisma Studio) to Mirka’s real Google address **before** she first logs in. |

## Why seed users, not emails in env

Google OAuth still creates a row for unknown emails. Role on that row is the source of truth: promote/demote by updating the database, not by redeploying env.

## Implementation notes

### Schema

On `User` add:

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  // existing fields…
  role UserRole @default(USER)
}
```

Keep Better Auth’s table name `@@map("user")`.

### Better Auth

- `user.additionalFields.role`: type `["USER", "ADMIN"]`, `defaultValue: "USER"`, **`input: false`** so the client cannot self-promote. See [Better Auth additional fields](https://www.better-auth.com/docs/concepts/database).
- Enable **account linking** for Google as a trusted provider so the first Google login for a seeded email **attaches an `Account` to the existing `User`** and keeps `ADMIN`. If linking is off, Google will create a second `USER` row and the seed is useless.
- `user.create` hook: new users always get `USER`. Never assign `ADMIN` in a hook.
- Session / tRPC context must expose `role` (returned field).

### Seed

Add `prisma/seed.ts` and `"prisma": { "seed": "tsx prisma/seed.ts" }` (or the project’s equivalent). Seed two users with stable ids, those emails, names, `emailVerified: true`, `role: ADMIN`. Do **not** invent Google `Account` rows — linking happens on first real login.

### Authorization

- Add `adminProcedure` in `src/server/api/trpc.ts`: logged in **and** `ctx.session.user.role === "ADMIN"`, otherwise `FORBIDDEN`.
- `/admin/**` layout: if not admin → redirect `/`. Users with `USER` are signed in but get no admin UI.
- Header: `USER` may see name + Odhlásiť; they must **not** see Upraviť / Pridať projekt / Admin.
- After 001: UploadThing middleware uses the same `ADMIN` check.

### Changing Mirka’s email later

Document in the seed comment / README:

1. If she has **not** logged in yet: `UPDATE` `user.email` to her Google address.
2. If she **has** logged in as the placeholder: update email **and** delete the linked `account` row so Google can link again.
3. If a `USER` already exists with that Gmail: set that row to `ADMIN` and stop using the placeholder.

## Acceptance criteria

- [ ] No `ADMIN_EMAILS` (or similar) env var.
- [ ] Fresh seed creates exactly those two `ADMIN` users.
- [ ] First Google login as `samuel.hrotik@gmail.com` is the seeded admin, not a duplicate `USER`.
- [ ] A different Google account signs in as `USER`, cannot call admin tRPC, cannot open `/admin`, cannot upload.
- [ ] Role cannot be set from the client (`input: false`).
- [ ] Notes exist for changing Mirka’s email in the DB.

## Out of scope

- Admin UI, content models, hiding “Prihlásiť” from the public (keep the discreet header button).
