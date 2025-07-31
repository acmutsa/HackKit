import type { User } from "db/types";

export function isUserAdmin(user: User) {
	return ["admin", "super_admin"].includes(user.role);
}
