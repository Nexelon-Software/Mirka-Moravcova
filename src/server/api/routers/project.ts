import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ProjectCategory } from "~/lib/categories";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { deleteUploadThingKeys } from "~/server/uploadthing";

const galleryImageSchema = z.object({
  url: z.string().min(1),
  key: z.string().nullable().optional(),
  alt: z.string().min(1),
  caption: z.string().nullable().optional(),
  sortOrder: z.number().int(),
});

const projectFieldsSchema = z.object({
  title: z.string().min(1, "Názov je povinný"),
  slug: z.string().min(1, "Slug je povinný"),
  description: z.string().min(1, "Krátky popis je povinný"),
  body: z.string(),
  category: z.enum([
    ProjectCategory.RESIDENTIAL,
    ProjectCategory.COMMERCIAL,
    ProjectCategory.CONCEPT,
  ]),
  tags: z.array(z.string()),
  coverImageUrl: z.string(),
  coverImageKey: z.string().nullable().optional(),
  coverImageAlt: z.string(),
  published: z.boolean(),
  sortOrder: z.number().int(),
  images: z.array(galleryImageSchema),
});

const publishRefine = (
  data: z.infer<typeof projectFieldsSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.published && !data.coverImageUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Pred publikovaním nahrajte úvodný obrázok",
      path: ["coverImageUrl"],
    });
  }
};

const projectInputSchema = projectFieldsSchema.superRefine(publishRefine);

function revalidateProject(slug: string) {
  revalidatePath("/");
  revalidatePath(`/projekty/${slug}`);
  revalidatePath("/admin/projekty");
}

function isUniqueSlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export const projectRouter = createTRPCRouter({
  listPublished: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  }),

  adminList: adminProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      orderBy: [{ published: "asc" }, { sortOrder: "asc" }],
    });
  }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: { images: true },
      });
      if (!project) return { ok: true };

      await deleteUploadThingKeys([
        project.coverImageKey,
        ...project.images.map((image) => image.key),
      ]);
      await ctx.db.project.delete({ where: { id: input.id } });
      revalidatePath("/");
      return { ok: true };
    }),

  adminGet: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
    }),

  adminCreate: adminProcedure
    .input(projectInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.create({
          data: {
            title: input.title,
            slug: input.slug,
            description: input.description,
            body: input.body,
            category: input.category,
            tags: input.tags,
            coverImageUrl: input.coverImageUrl,
            coverImageKey: input.coverImageKey,
            coverImageAlt: input.coverImageAlt || input.title,
            published: input.published,
            sortOrder: input.sortOrder,
            images: {
              create: input.images.map((image, index) => ({
                url: image.url,
                key: image.key,
                alt: image.alt,
                caption: image.caption,
                sortOrder: image.sortOrder ?? index,
              })),
            },
          },
        });
        revalidateProject(project.slug);
        return project;
      } catch (error) {
        if (isUniqueSlugError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug už existuje. Zvoľte iný.",
          });
        }
        throw error;
      }
    }),

  adminUpdate: adminProcedure
    .input(projectFieldsSchema.extend({ id: z.string() }).superRefine(publishRefine))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: { images: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Projekt sa nenašiel." });
      }

      const removedKeys = [
        existing.coverImageKey !== input.coverImageKey ? existing.coverImageKey : null,
        ...existing.images
          .map((image) => image.key)
          .filter(
            (key) => key && !input.images.some((image) => image.key === key),
          ),
      ];
      await deleteUploadThingKeys(removedKeys);

      try {
        const project = await ctx.db.project.update({
          where: { id: input.id },
          data: {
            title: input.title,
            slug: input.slug,
            description: input.description,
            body: input.body,
            category: input.category,
            tags: input.tags,
            coverImageUrl: input.coverImageUrl,
            coverImageKey: input.coverImageKey,
            coverImageAlt: input.coverImageAlt || input.title,
            published: input.published,
            sortOrder: input.sortOrder,
            images: {
              deleteMany: {},
              create: input.images.map((image, index) => ({
                url: image.url,
                key: image.key,
                alt: image.alt,
                caption: image.caption,
                sortOrder: image.sortOrder ?? index,
              })),
            },
          },
        });
        revalidateProject(existing.slug);
        revalidateProject(project.slug);
        return project;
      } catch (error) {
        if (isUniqueSlugError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug už existuje. Zvoľte iný.",
          });
        }
        throw error;
      }
    }),
});
