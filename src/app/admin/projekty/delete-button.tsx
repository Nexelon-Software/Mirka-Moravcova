"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const deleteProject = api.project.adminDelete.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm(`Naozaj zmazať projekt „${title}“?`)) return;
        deleteProject.mutate({ id });
      }}
      disabled={deleteProject.isPending}
      style={{
        fontSize: "0.6rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        background: "transparent",
        border: "none",
        color: "var(--muted-foreground)",
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      {deleteProject.isPending ? "Mažem…" : "Zmazať"}
    </button>
  );
}
