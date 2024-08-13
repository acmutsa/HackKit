import type { userType } from "../shared/types";

export function isUserAdmin(user: userType) {
	return user.role === "admin" || user.role === "super_admin";
}
