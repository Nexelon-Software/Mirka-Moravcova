import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { isAdmin } from "~/server/auth/roles";
import { auth } from "~/server/better-auth";

const f = createUploadthing();

async function requireAdmin(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user || !isAdmin(session.user)) {
    // UploadThingError extends Effect Micro.Error, not native Error — required by uploadthing API
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new UploadThingError("Unauthorized");
  }

  return { userId: session.user.id };
}

const uploadedFile = ({
  file,
}: {
  file: { ufsUrl: string; name: string; key: string };
}) => ({
  url: file.ufsUrl,
  name: file.name,
  key: file.key,
});

export const ourFileRouter = {
  projectCover: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => requireAdmin(req))
    .onUploadComplete(async ({ file }) => uploadedFile({ file })),

  projectGallery: f({
    image: { maxFileSize: "16MB", maxFileCount: 20 },
  })
    .middleware(async ({ req }) => requireAdmin(req))
    .onUploadComplete(async ({ file }) => uploadedFile({ file })),

  aboutPortrait: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => requireAdmin(req))
    .onUploadComplete(async ({ file }) => uploadedFile({ file })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
