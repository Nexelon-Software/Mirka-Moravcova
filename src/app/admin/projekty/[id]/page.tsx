import { notFound } from "next/navigation";

import { ProjectForm } from "~/app/admin/projekty/project-form";
import { db } from "~/server/db";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "2rem",
          fontWeight: 400,
          marginBottom: "2rem",
        }}
      >
        Upraviť projekt
      </h1>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          description: project.description,
          body: project.body,
          category: project.category,
          tags: project.tags.join(", "),
          coverImageUrl: project.coverImageUrl,
          coverImageKey: project.coverImageKey,
          coverImageAlt: project.coverImageAlt,
          published: project.published,
          sortOrder: project.sortOrder,
          images: project.images.map((image) => ({
            url: image.url,
            key: image.key,
            alt: image.alt,
            caption: image.caption,
            sortOrder: image.sortOrder,
          })),
        }}
      />
    </main>
  );
}
