import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { deleteUploadThingKeys } from "~/server/uploadthing";

export const siteContentRouter = createTRPCRouter({
  getAbout: publicProcedure.query(({ ctx }) => {
    return ctx.db.siteContent.findUnique({
      where: { id: "about" },
    });
  }),

  adminUpdate: adminProcedure
    .input(
      z.object({
        heading: z.string().min(1, "Nadpis je povinný"),
        paragraph1: z.string().min(1),
        paragraph2: z.string().min(1),
        portraitUrl: z.string().min(1, "Nahrajte portrét"),
        portraitKey: z.string().nullable().optional(),
        skills: z.array(z.string().min(1)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.siteContent.findUnique({
        where: { id: "about" },
      });
      if (existing?.portraitKey && existing.portraitKey !== input.portraitKey) {
        await deleteUploadThingKeys([existing.portraitKey]);
      }

      const about = await ctx.db.siteContent.upsert({
        where: { id: "about" },
        update: input,
        create: { id: "about", ...input },
      });
      revalidatePath("/");
      return about;
    }),
});
