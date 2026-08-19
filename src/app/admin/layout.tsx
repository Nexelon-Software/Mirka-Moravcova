import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "~/server/auth/roles";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session?.user || !isAdmin(session.user)) {
    redirect("/");
  }

  const { user } = session;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "oklch(97.7% 0.005 84 / 0.95)",
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
            gap: "1.5rem",
          }}
        >
          <nav
            style={{
              display: "flex",
              gap: "1.25rem",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <Link href="/admin/projekty" className="nav-link">
              Projekty
            </Link>
            <Link href="/admin/o-mne" className="nav-link">
              O mne
            </Link>
            <Link href="/" className="nav-link">
              Späť na web
            </Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--muted-foreground)",
                letterSpacing: "0.08em",
              }}
            >
              {user.name}
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
        </div>
      </header>
      {children}
    </div>
  );
}
