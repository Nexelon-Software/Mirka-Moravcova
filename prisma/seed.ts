import {
  PrismaClient,
  ProjectCategory,
  UserRole,
} from "../generated/prisma/index.js";

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

const PROJECTS = [
  {
    slug: "byt-brno-kralovo-pole",
    title: "Byt Brno — Královo Pole",
    description:
      "Kompletná rekonštrukcia bytu 2+kk s dôrazom na svetlo a úložné riešenia.",
    body: `Byt v Královom Poli sme otvorili svetlu: dispozícia 2+kk ostala čitateľná, úložné plochy sme schovali do stien, aby obývacia časť ostala pokojná.

Materiály sú teplé a tiché — drevo, omietka, textil. Kuchyňa nadväzuje na obývaciu zónu bez zbytočných delení.

Vizualizácie overili dennú stopu slnka pred realizáciou, aby úložné riešenia neubrali na svetlosti.`,
    category: ProjectCategory.RESIDENTIAL,
    tags: ["Rekonštrukcia", "Vizualizácia"],
    coverImageUrl: "/images/projekt-1.jpg",
    coverImageAlt: "Byt Brno — Královo Pole",
    sortOrder: 1,
  },
  {
    slug: "tichy-dom-spalnove-zona",
    title: "Tichý dom — spálňová zóna",
    description:
      "Štúdia nočnej zóny rodinného domu s celodrevenou stenou a integrovaným nábytkom.",
    body: `Nočná zóna domu je stavaná okolo jednej drevenej steny, ktorá berie na seba úložný nábytok aj akustiku.

Integrované skrine nahrádzajú voľne stojace kusy. Svetlo je tlmené, bez ostrých kontrastov.

Štúdia overuje, ako sa materiál správa večer a ráno — kedy má byť priestor najtichší.`,
    category: ProjectCategory.RESIDENTIAL,
    tags: ["Vizualizácia", "Nábytok na mieru"],
    coverImageUrl: "/images/projekt-2.jpg",
    coverImageAlt: "Tichý dom — spálňová zóna",
    sortOrder: 2,
  },
  {
    slug: "showroom-neutral",
    title: "Showroom Neutral",
    description:
      "Koncept predajne módy a keramiky s modulárnym výstavným systémom.",
    body: `Showroom spája módu a keramiku v jednom neutrálnom priestore. Modulárny výstavný systém sa dá prestavať podľa sezóny.

Podlaha a steny ostávajú tiché, aby produkt niesol farbu. Svetlo je rovnomerné, bez ostrých výkladných bodov.

Koncept overuje, ako maloobchodný priestor ostane čitateľný aj pri výmene kolekcie.`,
    category: ProjectCategory.COMMERCIAL,
    tags: ["Koncept", "Retail"],
    coverImageUrl: "/images/projekt-3.jpg",
    coverImageAlt: "Showroom Neutral",
    sortOrder: 3,
  },
  {
    slug: "materialova-studia-warm-neutrals",
    title: "Materiálová štúdia — Warm Neutrals",
    description:
      "Výskum kombinácií prírodných materiálov a ich správania v dennom svetle.",
    body: `Štúdia skúma teplé neutrálne tóny — kameň, drevo, textil a omietku — a to, ako sa ich farba mení počas dňa.

Vzorky sme skladali vedľa seba v dennom svetle aj pri umelom osvetlení, aby kombinácia ostala pokojná.

Výsledok slúži ako paleta pre rezidenčné aj komerčné zadania, kde materiál má mať dôvod, prečo tam je.`,
    category: ProjectCategory.CONCEPT,
    tags: ["Štúdia", "Materiály"],
    coverImageUrl: "/images/projekt-4.jpg",
    coverImageAlt: "Materiálová štúdia — Warm Neutrals",
    sortOrder: 4,
  },
] as const;

const ABOUT = {
  id: "about",
  heading: "O mne",
  paragraph1:
    "Volám sa Mirka Moravcová a študujem dizajn na Mendelovej univerzite v Brne. Zaujímajú ma priestory, ktoré sú tiché, ale nie prázdne — kde každý materiál má dôvod, prečo tam je.",
  paragraph2:
    "Venujem sa rezidenčným rekonštrukciám, konceptom komerčných priestorov a materiálovým štúdiám. Pri práci vychádzam z presnej dispozície a svetla, výsledok overujem 3D vizualizáciami.",
  portraitUrl: "/images/portret.jpg",
  skills: [
    "3ds Max",
    "Corona Renderer",
    "AutoCAD",
    "SketchUp",
    "ArchiCAD",
    "Adobe Photoshop",
    "Adobe InDesign",
    "Enscape",
  ],
};

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

async function seedContent() {
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();

  for (const project of PROJECTS) {
    await prisma.project.create({
      data: {
        ...project,
        tags: [...project.tags],
        published: true,
        images: {
          create: {
            url: project.coverImageUrl,
            alt: project.coverImageAlt,
            sortOrder: 0,
          },
        },
      },
    });
  }

  await prisma.siteContent.upsert({
    where: { id: ABOUT.id },
    update: {
      heading: ABOUT.heading,
      paragraph1: ABOUT.paragraph1,
      paragraph2: ABOUT.paragraph2,
      portraitUrl: ABOUT.portraitUrl,
      skills: [...ABOUT.skills],
    },
    create: {
      id: ABOUT.id,
      heading: ABOUT.heading,
      paragraph1: ABOUT.paragraph1,
      paragraph2: ABOUT.paragraph2,
      portraitUrl: ABOUT.portraitUrl,
      skills: [...ABOUT.skills],
    },
  });
}

async function main() {
  await seedAdmins();
  await seedContent();
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
