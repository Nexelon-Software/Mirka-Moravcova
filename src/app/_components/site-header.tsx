import Link from "next/link";

import { HeaderNav } from "~/app/_components/header-nav";
import { isAdmin } from "~/server/auth/roles";
import { getSession } from "~/server/better-auth/server";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-header-brand">
          Mirka Moravcová
        </Link>
        <HeaderNav
          isSignedIn={Boolean(session)}
          isAdmin={isAdmin(session?.user)}
          userName={session?.user?.name}
        />
      </div>
    </header>
  );
}
