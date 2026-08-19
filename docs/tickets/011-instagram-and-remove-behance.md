# 011 — Instagram URL, remove Behance

**Status:** todo  
**Depends on:** none (do with 010 if touching Kontakt)  
**Blocks:** none

## Goal

Instagram points at Mirka’s real profile. Behance is removed everywhere. Dead `href="#"` social links must not remain.

## Links

| Network | Action |
| --- | --- |
| Instagram | `https://www.instagram.com/mmoravcovaa/` — label Instagram, `target="_blank"` + `rel="noopener noreferrer"` |
| Behance | **Remove** (header/footer/kontakt arrays that currently include it) |
| LinkedIn | No URL was provided. **Remove** the placeholder `#` link. Do not keep a fake LinkedIn. If a URL is supplied later, add it in one constant. |

Today both Kontakt and the footer map `["Instagram", "LinkedIn", "Behance"]` to `#`. Replace with a single shared list (e.g. `src/lib/social.ts`) used in Kontakt, footer, and later admin chrome if needed.

## Acceptance criteria

- [ ] Instagram opens [instagram.com/mmoravcovaa](https://www.instagram.com/mmoravcovaa/) from Kontakt and footer.
- [ ] Behance does not appear anywhere in the UI.
- [ ] No social link goes to `#`.

## Out of scope

- Contact form (010), JSON-LD `sameAs` can wait for 012 but should use this same URL.
