# 013 — Nexelon credit on the site

**Status:** todo  
**Depends on:** none  
**Blocks:** none

## Goal

At relevant public (and admin) places, state that the site was built by **Nexelon s.r.o.**, linking to [https://nexelon.sk/](https://nexelon.sk/).

## Copy (Slovak)

Use one consistent line, e.g.:

**Stránku naprogramovala [Nexelon s.r.o.](https://nexelon.sk/)**

Link: `https://nexelon.sk/` · `target="_blank"` · `rel="noopener noreferrer"`  
Do not use “Nexelon” without s.r.o. in the legal name. Do not put a logo unless it stays smaller than Mirka’s identity.

## Where

| Place | Treatment |
| --- | --- |
| **Footer** (public) | Required. Next to or under `© {year} Mirka Moravcová`. Quiet type (`0.65rem`, muted, uppercase tracking like the rest of the footer). |
| **Kontakt** | Optional one muted sentence under the email/city block — only if the footer feels too easy to miss on mobile. Prefer footer-only if the section is already sparse after 010. |
| **Admin layout** | Same short line in `/admin` footer so the credit exists on the app Mirka uses, still discreet. |
| **Hero / O mne / project cards** | Do **not** put Nexelon there. |

Shared component (e.g. `NexelonCredit`) so wording cannot drift.

JSON-LD `WebSite.creator` for Nexelon belongs in 012, not duplicated as visible marketing on every section.

## Acceptance criteria

- [ ] Public footer credits Nexelon s.r.o. and the link opens https://nexelon.sk/
- [ ] Credit is readable but secondary to Mirka’s name
- [ ] Not on hero, About, or project cards
- [ ] Admin shows the same credit once

## Out of scope

- Nexelon branding, cookie banner, extra “powered by” widgets.
