"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PROJECT_FILTERS,
  type ProjectCategory,
  type ProjectFilterId,
} from "~/lib/categories";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImageUrl: string;
  coverImageAlt: string;
  category: ProjectCategory;
};

export function ProjectGrid({
  projects,
  isAdmin = false,
}: {
  projects: ProjectCardData[];
  isAdmin?: boolean;
}) {
  const [filter, setFilter] = useState<ProjectFilterId>("ALL");

  const visible = useMemo(() => {
    if (filter === "ALL") return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter, projects]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: "var(--foreground)",
            }}
          >
            Projekty
          </h2>
          {isAdmin ? (
            <Link
              href="/admin/projekty/new"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--foreground)",
                textDecoration: "none",
                borderBottom: "1px solid var(--foreground)",
                paddingBottom: "0.125rem",
              }}
            >
              Pridať projekt
            </Link>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PROJECT_FILTERS.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.375rem 0.875rem",
                  border: "1px solid oklch(85% 0.012 80)",
                  borderRadius: "2px",
                  backgroundColor: active ? "var(--foreground)" : "transparent",
                  color: active
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
          gap: "2rem",
        }}
      >
        {visible.map((project) => (
          <div key={project.id} style={{ position: "relative" }}>
            {isAdmin ? (
              <Link
                href={`/admin/projekty/${project.id}`}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  zIndex: 2,
                  backgroundColor: "oklch(97.7% 0.005 84 / 0.9)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "2px",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                }}
              >
                Upraviť
              </Link>
            ) : null}
            <Link
              href={`/projekty/${project.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              <Image
                src={project.coverImageUrl}
                alt={project.coverImageAlt}
                fill
                style={{ objectFit: "cover", transition: "transform 0.7s" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.625rem",
                flexWrap: "wrap",
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
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "var(--foreground)",
                marginBottom: "0.375rem",
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                lineHeight: 1.6,
                color: "var(--muted-foreground)",
              }}
            >
              {project.description}
            </p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
