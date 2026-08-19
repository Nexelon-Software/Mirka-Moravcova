import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "~/app/_components/auth-buttons";
import { NexelonCredit } from "~/app/_components/nexelon-credit";
import { isAdmin } from "~/server/auth/roles";
import { getSession } from "~/server/better-auth/server";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Admin",
};

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
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
      <footer style={{ padding: "1.5rem 2rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <NexelonCredit />
        </div>
      </footer>
    </div>
  );
}
