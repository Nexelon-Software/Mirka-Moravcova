import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export async function deleteUploadThingKeys(keys: Array<string | null | undefined>) {
  const valid = keys.filter((key): key is string => Boolean(key));
  if (valid.length === 0) return;
  await utapi.deleteFiles(valid);
}
