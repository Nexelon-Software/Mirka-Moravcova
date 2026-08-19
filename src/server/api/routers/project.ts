import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  listPublished: publicProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  }),
});
