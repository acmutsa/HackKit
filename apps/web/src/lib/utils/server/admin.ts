import type { userType } from "../../types/shared";

export function isUserAdmin(user: userType) {
	return user.role === "admin" || user.role === "super_admin";
}
