import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "~/server/auth/roles";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50,
        borderBottom: "1px solid oklch(90% 0.012 80 / 0.6)",
        backgroundColor: "oklch(97.7% 0.005 84 / 0.85)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto", padding: "0 2rem",
          height: "4rem", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.875rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--foreground)", textDecoration: "none",
          }}>
            Mirka Moravcová
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <nav style={{
              display: "flex", gap: "1.5rem",
              fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}>
              <a href="#projekty" className="nav-link">Projekty</a>
              <a href="#o-mne" className="nav-link">O mne</a>
              <a href="#kontakt" className="nav-link">Kontakt</a>
            </nav>

            {/* Login button — diskrétne */}
            {!session ? (
              <form>
                <button formAction={async () => {
                  "use server";
                  const res = await auth.api.signInSocial({ body: { provider: "google", callbackURL: "/" } });
                  if (!res.url) throw new Error("No URL");
                  redirect(res.url);
                }} style={{
                  fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "0.3rem 0.75rem",
                  border: "1px solid oklch(85% 0.012 80)",
                  borderRadius: "2px", background: "transparent",
                  color: "var(--muted-foreground)", cursor: "pointer",
                }}>
                  Prihlásiť
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>
                  {session.user?.name}
                </span>
                <form>
                  <button formAction={async () => {
                    "use server";
                    await auth.api.signOut({ headers: await headers() });
                    redirect("/");
                  }} style={{
                    fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
                    padding: "0.3rem 0.75rem",
                    border: "1px solid oklch(85% 0.012 80)",
                    borderRadius: "2px", background: "transparent",
                    color: "var(--muted-foreground)", cursor: "pointer",
                  }}>
                    Odhlásiť
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

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

        {/* ── PROJEKTY ── */}
        <section id="projekty" style={{ padding: "5rem 0", backgroundColor: "var(--background)" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" }}>
            {/* Header riadok */}
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              flexWrap: "wrap", gap: "1rem", marginBottom: "3rem",
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400,
                color: "var(--foreground)",
              }}>
                Projekty
              </h2>
              {/* Filter tlačidlá */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["Všetko", "Rezidenčné projekty", "Komerčné priestory", "Koncepty & Štúdie"].map((cat, i) => (
                  <span key={cat} style={{
                    fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "0.375rem 0.875rem",
                    border: "1px solid oklch(85% 0.012 80)",
                    borderRadius: "2px",
                    backgroundColor: i === 0 ? "var(--foreground)" : "transparent",
                    color: i === 0 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    cursor: "pointer",
                  }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid projektov */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
              gap: "2rem",
            }}>
              {[
                {
                  img: "/images/projekt-1.jpg",
                  alt: "Byt Brno — Královo Pole",
                  tags: ["Rekonštrukcia", "Vizualizácia"],
                  title: "Byt Brno — Královo Pole",
                  desc: "Kompletná rekonštrukcia bytu 2+kk s dôrazom na svetlo a úložné riešenia.",
                },
                {
                  img: "/images/projekt-2.jpg",
                  alt: "Tichý dom — spálňová zóna",
                  tags: ["Vizualizácia", "Nábytok na mieru"],
                  title: "Tichý dom — spálňová zóna",
                  desc: "Štúdia nočnej zóny rodinného domu s celodrevenou stenou a integrovaným nábytkom.",
                },
                {
                  img: "/images/projekt-3.jpg",
                  alt: "Showroom Neutral",
                  tags: ["Koncept", "Retail"],
                  title: "Showroom Neutral",
                  desc: "Koncept predajne módy a keramiky s modulárnym výstavným systémom.",
                },
                {
                  img: "/images/projekt-4.jpg",
                  alt: "Materiálová štúdia — Warm Neutrals",
                  tags: ["Štúdia", "Materiály"],
                  title: "Materiálová štúdia — Warm Neutrals",
                  desc: "Výskum kombinácií prírodných materiálov a ich správania v dennom svetle.",
                },
              ].map((p) => (
                <a key={p.title} href="#projekty" style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
                    <Image src={p.img} alt={p.alt} fill style={{ objectFit: "cover", transition: "transform 0.7s" }} />
                    {isAdmin(session?.user) && (
                      <div style={{
                        position: "absolute", top: "0.75rem", right: "0.75rem",
                        backgroundColor: "oklch(97.7% 0.005 84 / 0.9)",
                        padding: "0.2rem 0.5rem", borderRadius: "2px",
                        fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "var(--muted-foreground)",
                      }}>
                        Upraviť
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.625rem", flexWrap: "wrap" }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "0.2rem 0.5rem",
                        border: "1px solid oklch(85% 0.012 80)",
                        borderRadius: "2px", color: "var(--muted-foreground)",
                      }}>{t}</span>
                    ))}
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.5rem", fontWeight: 400,
                    color: "var(--foreground)", marginBottom: "0.375rem",
                  }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "var(--muted-foreground)" }}>
                    {p.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── O MNE ── */}
        <section id="o-mne" style={{ padding: "5rem 0", backgroundColor: "oklch(95.5% 0.007 82)" }}>
          <div style={{
            maxWidth: "72rem", margin: "0 auto", padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "4rem", alignItems: "start",
          }}>
            {/* Foto */}
            <div style={{ position: "relative", aspectRatio: "2/3", borderRadius: "2px", overflow: "hidden", maxWidth: "380px" }}>
              <Image
                src="/images/portret.jpg"
                alt="Portrét Mirky Moravcovej"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>

            {/* Text */}
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 400,
                color: "var(--foreground)", marginBottom: "1.5rem",
              }}>
                O mne
              </h2>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                Volám sa Mirka Moravcová a študujem dizajn na Mendelovej univerzite v Brne.
                Zaujímajú ma priestory, ktoré sú tiché, ale nie prázdne — kde každý materiál má dôvod, prečo tam je.
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted-foreground)", marginBottom: "2.5rem" }}>
                Venujem sa rezidenčným rekonštrukciám, konceptom komerčných priestorov a materiálovým štúdiám.
                Pri práci vychádzam z presnej dispozície a svetla, výsledok overujem 3D vizualizáciami.
              </p>

              <h3 style={{
                fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted-foreground)", marginBottom: "1rem",
              }}>
                Softvér a zručnosti
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem 2rem" }}>
                {["3ds Max", "Corona Renderer", "AutoCAD", "SketchUp", "ArchiCAD", "Adobe Photoshop", "Adobe InDesign", "Enscape"].map(s => (
                  <span key={s} style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", paddingBottom: "0.375rem", borderBottom: "1px solid oklch(88% 0.01 80)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

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

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
          fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--muted-foreground)",
        }}>
          <span>© {new Date().getFullYear()} Mirka Moravcová</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Instagram", "LinkedIn", "Behance"].map(s => (
              <a key={s} href="#" style={{ color: "inherit", textDecoration: "none" }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
