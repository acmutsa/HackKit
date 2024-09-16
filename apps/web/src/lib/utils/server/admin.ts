import type { User } from "db/types";

export function isUserAdmin(user: User) {
	return user.role === "admin" || user.role === "super_admin";
}
