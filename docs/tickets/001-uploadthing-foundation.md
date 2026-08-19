# 001 — UploadThing foundation

**Status:** done  
**Depends on:** none  
**Blocks:** 007, 008

## Goal

Wire [UploadThing for Next.js App Router](https://docs.uploadthing.com/getting-started/appdir) so later admin forms can upload a project cover, a gallery, and an About portrait. No public UI in this ticket.

## Context

- Token is already in `.env` as `UPLOADTHING_TOKEN`.
- Do **not** commit the token. Add it to `.env.example` as an empty placeholder and to `src/env.js`.
- Pass it through `Dockerfile` / `cloudbuild.yaml` the same way as the other secrets (`SKIP_ENV_VALIDATION` is already used at build time).

## Implementation notes

1. Install `uploadthing` and `@uploadthing/react`.
2. FileRouter at `src/app/api/uploadthing/core.ts` with three routes:
   - `projectCover` — 1 image, max ~8–16 MB
   - `projectGallery` — up to 20 images
   - `aboutPortrait` — 1 image
3. Route handler at `src/app/api/uploadthing/route.ts` (`GET` + `POST`).
4. Typed helpers (`UploadButton` / `UploadDropzone`) in `src/utils/uploadthing.ts`.
5. `NextSSRPlugin` + `extractRouterConfig` in `src/app/layout.tsx`.
6. Allow UploadThing hosts on `next/image` (`utfs.io`, `*.ufs.sh`, or current docs hosts).
7. **Auth:** each FileRoute `.middleware()` must reject unless the session user has `role === "ADMIN"`. If ticket 002 is not merged yet, gate on “logged in” and tighten to `ADMIN` in 002 — do **not** protect the whole `/api/uploadthing` route; UploadThing calls it as a webhook ([auth docs](https://docs.uploadthing.com/concepts/auth-security)).
8. `onUploadComplete` returns `{ url: file.ufsUrl, name, key }` for the client. Do not write Prisma rows here; forms in 007/008 persist URLs.

## Acceptance criteria

- [ ] `UPLOADTHING_TOKEN` is in env schema and example; production build can receive it.
- [ ] Three FileRoutes exist and are reachable at `/api/uploadthing`.
- [ ] Unauthenticated (and, once 002 lands, non-admin) uploads fail in middleware.
- [ ] `next/image` can render an UploadThing URL without a config error.
- [ ] SSR plugin is mounted so upload buttons do not flash a permissions loading state.

## Out of scope

- Admin forms, deleting files via UTApi, storing URLs in Postgres.
