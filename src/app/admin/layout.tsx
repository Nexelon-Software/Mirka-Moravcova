import { redirect } from "next/navigation";

import { isAdmin } from "~/server/auth/roles";
import { getSession } from "~/server/better-auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!isAdmin(session?.user)) {
    redirect("/");
  }

  return children;
}
