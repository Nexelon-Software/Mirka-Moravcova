"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PROJECT_CATEGORY_LABELS, ProjectCategory } from "~/lib/categories";
import { slugify } from "~/lib/slug";
import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";

type GalleryItem = {
  url: string;
  key?: string | null;
  alt: string;
  caption?: string | null;
  sortOrder: number;
};

export type ProjectFormValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  category: ProjectCategory;
  tags: string;
  coverImageUrl: string;
  coverImageKey?: string | null;
  coverImageAlt: string;
  published: boolean;
  sortOrder: number;
  images: GalleryItem[];
};

const fieldStyle = {
  width: "100%" as const,
  padding: "0.5rem 0",
  border: "none",
  borderBottom: "1px solid oklch(82% 0.012 80)",
  backgroundColor: "transparent",
  fontSize: "0.875rem",
  color: "var(--foreground)",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block" as const,
  fontSize: "0.6rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "var(--muted-foreground)",
  marginBottom: "0.5rem",
};

export function ProjectForm({ initial }: { initial: ProjectFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [error, setError] = useState<string | null>(null);

  const createProject = api.project.adminCreate.useMutation();
  const updateProject = api.project.adminUpdate.useMutation();
  const pending = createProject.isPending || updateProject.isPending;

  function update<K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      body: values.body,
      category: values.category,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverImageUrl: values.coverImageUrl,
      coverImageKey: values.coverImageKey,
      coverImageAlt: values.coverImageAlt.trim() || values.title.trim(),
      published: values.published,
      sortOrder: Number(values.sortOrder) || 0,
      images: values.images.map((image, index) => ({
        ...image,
        sortOrder: index,
        alt: image.alt || values.title.trim(),
      })),
    };

    try {
      if (values.id) {
        await updateProject.mutateAsync({ id: values.id, ...payload });
      } else {
        await createProject.mutateAsync(payload);
      }
      router.push("/admin/projekty");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uloženie zlyhalo.");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.5rem" }}>
      {error ? (
        <p style={{ color: "oklch(45% 0.12 25)", fontSize: "0.85rem" }}>{error}</p>
      ) : null}

      <div>
        <label style={labelStyle}>Názov</label>
        <input
          required
          value={values.title}
          onChange={(event) => {
            const title = event.target.value;
            update("title", title);
            if (!slugTouched) update("slug", slugify(title));
          }}
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Slug</label>
        <input
          required
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true);
            update("slug", event.target.value);
          }}
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Krátky popis na karte</label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Dlhší text na stránke projektu</label>
        <textarea
          rows={8}
          value={values.body}
          onChange={(event) => update("body", event.target.value)}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Kategória</label>
        <select
          value={values.category}
          onChange={(event) =>
            update("category", event.target.value as ProjectCategory)
          }
          style={fieldStyle}
        >
          {Object.entries(PROJECT_CATEGORY_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Tagy (oddelené čiarkou)</label>
        <input
          value={values.tags}
          onChange={(event) => update("tags", event.target.value)}
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Poradie</label>
        <input
          type="number"
          value={values.sortOrder}
          onChange={(event) => update("sortOrder", Number(event.target.value))}
          style={fieldStyle}
        />
      </div>

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={values.published}
          onChange={(event) => update("published", event.target.checked)}
        />
        <span style={{ fontSize: "0.8rem" }}>Publikovať na webe</span>
      </label>

      <div>
        <label style={labelStyle}>Úvodný obrázok</label>
        {values.coverImageUrl ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "420px",
              aspectRatio: "4/3",
              marginBottom: "0.75rem",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <Image
              src={values.coverImageUrl}
              alt={values.coverImageAlt || values.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : null}
        <UploadButton
          endpoint="projectCover"
          onClientUploadComplete={(files) => {
            const file = files[0];
            if (!file) return;
            update("coverImageUrl", file.ufsUrl);
            update("coverImageKey", file.key);
            if (!values.coverImageAlt) update("coverImageAlt", values.title);
          }}
          onUploadError={(uploadError) => setError(uploadError.message)}
        />
        <input
          placeholder="Alt text"
          value={values.coverImageAlt}
          onChange={(event) => update("coverImageAlt", event.target.value)}
          style={{ ...fieldStyle, marginTop: "0.75rem" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Galéria</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          {values.images.map((image, index) => (
            <div key={`${image.url}-${index}`}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  borderRadius: "2px",
                }}
              >
                <Image src={image.url} alt={image.alt} fill style={{ objectFit: "cover" }} />
              </div>
              <button
                type="button"
                onClick={() =>
                  update(
                    "images",
                    values.images.filter((_, imageIndex) => imageIndex !== index),
                  )
                }
                style={{
                  marginTop: "0.35rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                Odstrániť
              </button>
            </div>
          ))}
        </div>
        <UploadButton
          endpoint="projectGallery"
          onClientUploadComplete={(files) => {
            update("images", [
              ...values.images,
              ...files.map((file, index) => ({
                url: file.ufsUrl,
                key: file.key,
                alt: values.title || file.name,
                sortOrder: values.images.length + index,
              })),
            ]);
          }}
          onUploadError={(uploadError) => setError(uploadError.message)}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          alignSelf: "flex-start",
          padding: "0.875rem 2.5rem",
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "2px",
          fontSize: "0.65rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {pending ? "Ukladám…" : "Uložiť"}
      </button>
    </form>
  );
}
