import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "~/server/auth/roles";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 50,
        borderBottom: "1px solid oklch(90% 0.012 80 / 0.6)",
        backgroundColor: "oklch(97.7% 0.005 84 / 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 2rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--foreground)",
            textDecoration: "none",
          }}
        >
          Mirka Moravcová
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <nav
            style={{
              display: "flex",
              gap: "1.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}
          >
            <Link href="/#projekty" className="nav-link">
              Projekty
            </Link>
            <Link href="/#o-mne" className="nav-link">
              O mne
            </Link>
            <Link href="/#kontakt" className="nav-link">
              Kontakt
            </Link>
            {isAdmin(session?.user) ? (
              <Link href="/admin/projekty" className="nav-link">
                Admin
              </Link>
            ) : null}
          </nav>

          {!session ? (
            <form>
              <button
                formAction={async () => {
                  "use server";
                  const res = await auth.api.signInSocial({
                    body: { provider: "google", callbackURL: "/" },
                  });
                  if (!res.url) throw new Error("No URL");
                  redirect(res.url);
                }}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.75rem",
                  border: "1px solid oklch(85% 0.012 80)",
                  borderRadius: "2px",
                  background: "transparent",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                Prihlásiť
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.08em",
                }}
              >
                {session.user?.name}
              </span>
              <form>
                <button
                  formAction={async () => {
                    "use server";
                    await auth.api.signOut({ headers: await headers() });
                    redirect("/");
                  }}
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "0.3rem 0.75rem",
                    border: "1px solid oklch(85% 0.012 80)",
                    borderRadius: "2px",
                    background: "transparent",
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                  }}
                >
                  Odhlásiť
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
