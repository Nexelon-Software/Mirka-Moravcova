import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

/** PgBouncer transaction poolers (Supabase :6543) do not support Prisma prepared statements. */
function databaseUrl() {
  const url = env.DATABASE_URL;
  if (url.includes("pgbouncer=")) return url;

  const usesTransactionPooler =
    url.includes(":6543") || url.includes("pooler.supabase.com");
  if (!usesTransactionPooler) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}pgbouncer=true&connection_limit=1`;
}

const createPrismaClient = () =>
  new PrismaClient({
    datasources: { db: { url: databaseUrl() } },
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
