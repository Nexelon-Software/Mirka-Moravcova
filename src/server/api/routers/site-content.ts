import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const siteContentRouter = createTRPCRouter({
  getAbout: publicProcedure.query(({ ctx }) => {
    return ctx.db.siteContent.findUnique({
      where: { id: "about" },
    });
  }),
});
