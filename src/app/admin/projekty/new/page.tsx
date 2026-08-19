import { ProjectForm } from "~/app/admin/projekty/project-form";
import { ProjectCategory } from "~/lib/categories";

export default function NewProjectPage() {
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
        Nový projekt
      </h1>
      <ProjectForm
        initial={{
          title: "",
          slug: "",
          description: "",
          body: "",
          category: ProjectCategory.RESIDENTIAL,
          tags: "",
          coverImageUrl: "",
          coverImageAlt: "",
          published: false,
          sortOrder: 0,
          images: [],
        }}
      />
    </main>
  );
}
