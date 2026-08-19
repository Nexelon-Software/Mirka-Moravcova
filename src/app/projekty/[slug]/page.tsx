import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SiteFooter } from "~/app/_components/site-footer";
import { SiteHeader } from "~/app/_components/site-header";
import { PROJECT_CATEGORY_LABELS } from "~/lib/categories";
import { db } from "~/server/db";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const getPublishedProject = cache(async (slug: string) => {
  return db.project.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
});

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projekty/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: [{ url: project.coverImageUrl }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  const gallery =
    project.images.length > 0
      ? project.images
      : [
          {
            id: "cover",
            url: project.coverImageUrl,
            alt: project.coverImageAlt,
          },
        ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <SiteHeader />
      <main style={{ padding: "7rem 0 5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" }}>
          <Link
            href="/#projekty"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "0.125rem",
            }}
          >
            Späť na projekty
          </Link>

          <p
            style={{
              marginTop: "2rem",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}
          >
            {PROJECT_CATEGORY_LABELS[project.category]}
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              margin: "0.5rem 0 1rem",
            }}
          >
            {project.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.2rem 0.5rem",
                  border: "1px solid oklch(85% 0.012 80)",
                  borderRadius: "2px",
                  color: "var(--muted-foreground)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "var(--muted-foreground)",
              maxWidth: "40rem",
              marginBottom: "2.5rem",
            }}
          >
            {project.description}
          </p>

          <div
            style={{
              position: "relative",
              aspectRatio: "16/10",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "3rem",
            }}
          >
            <Image
              src={project.coverImageUrl}
              alt={project.coverImageAlt}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              maxWidth: "40rem",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              color: "var(--muted-foreground)",
              whiteSpace: "pre-line",
              marginBottom: "3.5rem",
            }}
          >
            {project.body}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "1.25rem",
            }}
          >
            {gallery.map((image) => (
              <div
                key={image.id}
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
