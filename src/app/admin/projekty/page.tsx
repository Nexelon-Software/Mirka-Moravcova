import Image from "next/image";
import Link from "next/link";

import { DeleteProjectButton } from "~/app/admin/projekty/delete-button";
import { PROJECT_CATEGORY_LABELS } from "~/lib/categories";
import { db } from "~/server/db";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: [{ published: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "2rem",
            fontWeight: 400,
          }}
        >
          Projekty
        </h1>
        <Link
          href="/admin/projekty/new"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--primary-foreground)",
            backgroundColor: "var(--primary)",
            textDecoration: "none",
            padding: "0.75rem 1.25rem",
            borderRadius: "2px",
          }}
        >
          Pridať projekt
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
              }}
            >
              <th style={{ padding: "0.75rem 0.5rem" }}>Náhľad</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Názov</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Kategória</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Stav</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Upravené</th>
              <th style={{ padding: "0.75rem 0.5rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "72px",
                      height: "54px",
                      overflow: "hidden",
                      borderRadius: "2px",
                    }}
                  >
                    <Image
                      src={project.coverImageUrl}
                      alt={project.coverImageAlt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td style={{ padding: "0.75rem 0.5rem" }}>{project.title}</td>
                <td style={{ padding: "0.75rem 0.5rem", color: "var(--muted-foreground)" }}>
                  {PROJECT_CATEGORY_LABELS[project.category]}
                </td>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  {project.published ? "Publikovaný" : "Koncept"}
                </td>
                <td style={{ padding: "0.75rem 0.5rem", color: "var(--muted-foreground)" }}>
                  {project.updatedAt.toLocaleDateString("sk-SK")}
                </td>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link
                      href={`/admin/projekty/${project.id}`}
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--foreground)",
                      }}
                    >
                      Upraviť
                    </Link>
                    <DeleteProjectButton id={project.id} title={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
