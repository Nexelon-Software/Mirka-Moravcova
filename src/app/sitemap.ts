import { type MetadataRoute } from "next";

import { getSiteUrl } from "~/lib/site";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await db.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: base,
      lastModified: new Date(),
    },
    ...projects.map((project) => ({
      url: `${base}/projekty/${project.slug}`,
      lastModified: project.updatedAt,
    })),
  ];
}
