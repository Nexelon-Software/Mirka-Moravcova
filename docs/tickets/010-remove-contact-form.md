# 010 — Remove the contact form

**Status:** todo  
**Depends on:** none (do with 011 if touching the same section)  
**Blocks:** none

## Goal

The Kontakt section stays as **email + location + socials**. Remove the name / email / message form. There is no backend for it and it should not be built.

## Current UI

`src/app/page.tsx` section `#kontakt` is a two-column grid: copy on the left, a non-working `<form>` on the right.

## Implementation notes

- Delete the form (Meno, Email, Správa, Odoslať).
- Keep heading **Kontakt**, intro paragraph, `mailto:mirka.moravcova@email.com`, **Brno, Česká republika**.
- Collapse layout to one column / max-width so the section does not leave a blank right side.
- Header nav **Kontakt** still scrolls to `#kontakt`.
- Do not add Formspree, tRPC contact mutation, or mailto-from-form.

## Acceptance criteria

- [ ] No contact `<form>` on the public site.
- [ ] Email and city remain visible and usable.
- [ ] Layout still matches the rest of the site (no empty second column).

## Out of scope

- Changing the email address, Instagram/Behance (011), Nexelon line (013).
