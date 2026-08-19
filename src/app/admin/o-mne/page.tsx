import { AboutForm } from "~/app/admin/o-mne/about-form";
import { db } from "~/server/db";

export default async function AdminAboutPage() {
  const about = await db.siteContent.findUnique({ where: { id: "about" } });

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
        O mne
      </h1>
      <AboutForm
        initial={{
          heading: about?.heading ?? "O mne",
          paragraph1: about?.paragraph1 ?? "",
          paragraph2: about?.paragraph2 ?? "",
          portraitUrl: about?.portraitUrl ?? "",
          portraitKey: about?.portraitKey,
          skills: about?.skills ?? [],
        }}
      />
    </main>
  );
}
