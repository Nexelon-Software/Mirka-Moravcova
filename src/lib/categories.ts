export const ProjectCategory = {
  RESIDENTIAL: "RESIDENTIAL",
  COMMERCIAL: "COMMERCIAL",
  CONCEPT: "CONCEPT",
} as const;

export type ProjectCategory =
  (typeof ProjectCategory)[keyof typeof ProjectCategory];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  RESIDENTIAL: "Rezidenčné projekty",
  COMMERCIAL: "Komerčné priestory",
  CONCEPT: "Koncepty & Štúdie",
};

export const PROJECT_FILTERS = [
  { id: "ALL", label: "Všetko" },
  { id: ProjectCategory.RESIDENTIAL, label: PROJECT_CATEGORY_LABELS.RESIDENTIAL },
  { id: ProjectCategory.COMMERCIAL, label: PROJECT_CATEGORY_LABELS.COMMERCIAL },
  { id: ProjectCategory.CONCEPT, label: PROJECT_CATEGORY_LABELS.CONCEPT },
] as const;

export type ProjectFilterId = (typeof PROJECT_FILTERS)[number]["id"];
