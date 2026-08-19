export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export function isAdmin(user: { role?: unknown } | null | undefined) {
  return user?.role === UserRole.ADMIN;
}
