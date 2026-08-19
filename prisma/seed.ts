import { PrismaClient, UserRole } from "../generated/prisma/index.js";

/**
 * Seed admins. Role is the source of truth — never an env allowlist.
 *
 * Changing Mirka’s Google email later:
 * 1. If she has not logged in yet: update user.email to her Google address.
 * 2. If she already logged in as the placeholder: update email AND delete the
 *    linked account row so Google can link again.
 * 3. If a USER already exists with that Gmail: set that row to ADMIN and stop
 *    using the placeholder.
 */
const ADMINS = [
  {
    email: "samuel.hrotik@gmail.com",
    name: "Samuel Hrotík",
  },
  {
    email: "mirka.moravcova@email.com",
    name: "Mirka Moravcová",
  },
] as const;

const prisma = new PrismaClient();

async function seedAdmins() {
  for (const admin of ADMINS) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: UserRole.ADMIN, name: admin.name },
      create: {
        id: crypto.randomUUID(),
        email: admin.email,
        name: admin.name,
        emailVerified: true,
        role: UserRole.ADMIN,
      },
    });
  }
}

async function main() {
  await seedAdmins();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
