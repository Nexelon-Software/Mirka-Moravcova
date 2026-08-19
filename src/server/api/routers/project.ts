import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { deleteUploadThingKeys } from "~/server/uploadthing";

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
      return { ok: true };
    }),
});
