"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";

type AboutFormValues = {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  portraitUrl: string;
  portraitKey?: string | null;
  skills: string[];
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

export function AboutForm({ initial }: { initial: AboutFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [skillDraft, setSkillDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateAbout = api.siteContent.adminUpdate.useMutation();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await updateAbout.mutateAsync({
        heading: values.heading.trim(),
        paragraph1: values.paragraph1.trim(),
        paragraph2: values.paragraph2.trim(),
        portraitUrl: values.portraitUrl,
        portraitKey: values.portraitKey,
        skills: values.skills.map((skill) => skill.trim()).filter(Boolean),
      });
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
        <label style={labelStyle}>Nadpis</label>
        <input
          required
          value={values.heading}
          onChange={(event) => setValues({ ...values, heading: event.target.value })}
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Prvý odsek</label>
        <textarea
          required
          rows={4}
          value={values.paragraph1}
          onChange={(event) =>
            setValues({ ...values, paragraph1: event.target.value })
          }
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Druhý odsek</label>
        <textarea
          required
          rows={4}
          value={values.paragraph2}
          onChange={(event) =>
            setValues({ ...values, paragraph2: event.target.value })
          }
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Portrét</label>
        {values.portraitUrl ? (
          <div
            style={{
              position: "relative",
              width: "220px",
              aspectRatio: "2/3",
              marginBottom: "0.75rem",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <Image
              src={values.portraitUrl}
              alt="Portrét"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : null}
        <UploadButton
          endpoint="aboutPortrait"
          onClientUploadComplete={(files) => {
            const file = files[0];
            if (!file) return;
            setValues({
              ...values,
              portraitUrl: file.ufsUrl,
              portraitKey: file.key,
            });
          }}
          onUploadError={(uploadError) => setError(uploadError.message)}
        />
      </div>

      <div>
        <label style={labelStyle}>Zručnosti</label>
        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {values.skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              <span style={{ fontSize: "0.85rem", flex: 1 }}>{skill}</span>
              <button
                type="button"
                onClick={() =>
                  setValues({
                    ...values,
                    skills: values.skills.filter((_, skillIndex) => skillIndex !== index),
                  })
                }
                style={{
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
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            value={skillDraft}
            onChange={(event) => setSkillDraft(event.target.value)}
            style={fieldStyle}
            placeholder="Nová zručnosť"
          />
          <button
            type="button"
            onClick={() => {
              const next = skillDraft.trim();
              if (!next) return;
              setValues({ ...values, skills: [...values.skills, next] });
              setSkillDraft("");
            }}
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "none",
              border: "1px solid var(--border)",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
            }}
          >
            Pridať
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={updateAbout.isPending}
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
        {updateAbout.isPending ? "Ukladám…" : "Uložiť"}
      </button>
    </form>
  );
}
