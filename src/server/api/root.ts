import { projectRouter } from "~/server/api/routers/project";
import { siteContentRouter } from "~/server/api/routers/site-content";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  siteContent: siteContentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
