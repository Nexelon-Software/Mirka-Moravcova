"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

import { SignInButton, SignOutButton } from "~/app/_components/auth-buttons";

type HeaderNavProps = {
  isSignedIn: boolean;
  isAdmin: boolean;
  userName?: string | null;
};

const navItems = [
  { href: "/#projekty", label: "Projekty" },
  { href: "/#o-mne", label: "O mne" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export function HeaderNav({ isSignedIn, isAdmin, userName }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <div className="desktop-nav">
        <nav className="desktop-nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin/projekty" className="nav-link">
              Admin
            </Link>
          ) : null}
        </nav>

        {!isSignedIn ? (
          <SignInButton />
        ) : (
          <div className="desktop-nav-session">
            {userName ? <span className="nav-user-name">{userName}</span> : null}
            <SignOutButton />
          </div>
        )}
      </div>

      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="Zavrieť menu"
            onClick={close}
          />
          <div id={menuId} className="mobile-nav-panel" role="dialog" aria-modal="true">
            <nav className="mobile-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link href="/admin/projekty" className="mobile-nav-link" onClick={close}>
                  Admin
                </Link>
              ) : null}
            </nav>

            <div className="mobile-nav-auth">
              {!isSignedIn ? (
                <SignInButton />
              ) : (
                <>
                  {userName ? <span className="nav-user-name">{userName}</span> : null}
                  <SignOutButton />
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
