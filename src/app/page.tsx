import Image from "next/image";

import { ProjectGrid } from "~/app/_components/project-grid";
import { SiteFooter } from "~/app/_components/site-footer";
import { SiteHeader } from "~/app/_components/site-header";
import { db } from "~/server/db";

export default async function Home() {
  const [projects, about] = await Promise.all([
    db.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.siteContent.findUnique({ where: { id: "about" } }),
  ]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <SiteHeader />

      <main>
        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end" }}>
          <Image
            src="/images/hero.jpg"
            alt="Interiér obývacej izby v neutrálnych tónoch"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          {/* gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, oklch(97.7% 0.005 84) 0%, oklch(97.7% 0.005 84 / 0.55) 45%, oklch(97.7% 0.005 84 / 0.1) 100%)",
          }} />
          <div style={{
            position: "relative", zIndex: 1,
            maxWidth: "72rem", margin: "0 auto", padding: "0 2rem 5rem", width: "100%",
          }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.01em",
              color: "var(--foreground)", maxWidth: "40rem", marginBottom: "1.25rem",
            }}>
              Mirka Moravcová<br />
              <em style={{ fontStyle: "italic" }}>— Interiérový dizajn</em>
            </h1>
            <p style={{
              fontSize: "0.875rem", lineHeight: 1.7,
              color: "var(--muted-foreground)", maxWidth: "26rem", marginBottom: "2.5rem",
            }}>
              Študentka dizajnu na Mendelovej univerzite v Brne. Tvorba priestorov s dôrazom na detail, funkčnosť a estetiku.
            </p>
            <a href="#projekty" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--foreground)", textDecoration: "none",
              borderBottom: "1px solid var(--foreground)", paddingBottom: "0.125rem",
            }}>
              Pozrieť projekty
            </a>
          </div>
        </section>

        <section id="projekty" style={{ padding: "5rem 0", backgroundColor: "var(--background)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" }}>
            <ProjectGrid
              projects={projects.map((project) => ({
                id: project.id,
                slug: project.slug,
                title: project.title,
                description: project.description,
                tags: project.tags,
                coverImageUrl: project.coverImageUrl,
                coverImageAlt: project.coverImageAlt,
                category: project.category,
              }))}
            />
          </div>
        </section>

        {about ? (
        <section id="o-mne" style={{ padding: "5rem 0", backgroundColor: "oklch(95.5% 0.007 82)" }}>
          <div style={{
            maxWidth: "72rem", margin: "0 auto", padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "4rem", alignItems: "start",
          }}>
            <div style={{ position: "relative", aspectRatio: "2/3", borderRadius: "2px", overflow: "hidden", maxWidth: "380px" }}>
              <Image
                src={about.portraitUrl}
                alt={`Portrét — ${about.heading}`}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>

            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400,
                color: "var(--foreground)", marginBottom: "1.5rem",
              }}>
                {about.heading}
              </h2>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                {about.paragraph1}
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "2.5rem" }}>
                {about.paragraph2}
              </p>

              <h3 style={{
                fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted-foreground)", marginBottom: "1rem",
              }}>
                Softvér a zručnosti
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem 2rem" }}>
                {about.skills.map((skill) => (
                  <span key={skill} style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", paddingBottom: "0.375rem", borderBottom: "1px solid oklch(88% 0.01 80)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {/* ── KONTAKT ── */}
        <section id="kontakt" style={{ padding: "5rem 0", backgroundColor: "var(--background)" }}>
          <div style={{
            maxWidth: "72rem", margin: "0 auto", padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "4rem",
          }}>
            {/* Ľavá strana */}
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400,
                color: "var(--foreground)", marginBottom: "1.25rem",
              }}>
                Kontakt
              </h2>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "2rem", maxWidth: "24rem" }}>
                Máte priestor, ktorý by potreboval nový pohľad? Napíšte mi — rada sa pozriem na zadanie, spoluprácu alebo stáž.
              </p>
              <div style={{ marginBottom: "1.75rem" }}>
                <a href="mailto:mirka.moravcova@email.com" style={{
                  display: "block", fontSize: "0.875rem", color: "var(--foreground)",
                  textDecoration: "none", marginBottom: "0.375rem",
                }}>
                  mirka.moravcova@email.com
                </a>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Brno, Česká republika
                </span>
              </div>
              <div style={{ display: "flex", gap: "1.25rem" }}>
                {["Instagram", "LinkedIn", "Behance"].map(s => (
                  <a key={s} href="#" style={{
                    fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "var(--foreground)", textDecoration: "none",
                    borderBottom: "1px solid var(--foreground)", paddingBottom: "0.125rem",
                  }}>
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Formulár */}
            <form style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { name: "name", label: "Meno", type: "text" },
                { name: "email", label: "Email", type: "email" },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block", fontSize: "0.6rem", letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: "0.625rem",
                  }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    required
                    style={{
                      width: "100%", padding: "0.5rem 0",
                      border: "none", borderBottom: "1px solid oklch(82% 0.012 80)",
                      backgroundColor: "transparent", fontSize: "0.875rem",
                      color: "var(--foreground)", outline: "none",
                    }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block", fontSize: "0.6rem", letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: "0.625rem",
                }}>
                  Správa
                </label>
                <textarea
                  required
                  rows={4}
                  style={{
                    width: "100%", padding: "0.5rem 0",
                    border: "none", borderBottom: "1px solid oklch(82% 0.012 80)",
                    backgroundColor: "transparent", fontSize: "0.875rem",
                    color: "var(--foreground)", outline: "none", resize: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <button type="submit" style={{
                alignSelf: "flex-start",
                padding: "0.875rem 2.5rem",
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                border: "none", borderRadius: "2px",
                fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase",
                cursor: "pointer",
              }}>
                Odoslať
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
