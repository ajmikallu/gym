export const ALLOWED_ADMIN_ROLES = ["ADMIN", "SUPERADMIN", "TRAINER", "BLOGGER"];

export function hasAdminAccess(role?: string): boolean {
  if (!role || typeof role !== "string") return false;
  return ALLOWED_ADMIN_ROLES.includes(role.toUpperCase());
}
