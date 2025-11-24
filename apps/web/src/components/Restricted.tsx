import {
	compareUserPosition,
	userHasPermission,
} from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { UserWithRole } from "db/types";
import { ReactNode } from "react";

function Restricted({
	user,
	permissions,
	children,
	position = "higher",
	targetRolePosition = undefined,
}: {
	user: UserWithRole;
	permissions: PermissionType | [PermissionType];
	children: ReactNode;
	position?: "higher" | "lower" | "equal";
	targetRolePosition?: number;
}) {
	if (!userHasPermission(user, permissions)) {
		return <></>;
	}
	if (targetRolePosition !== undefined) {
		if (
			position === "higher" &&
			compareUserPosition(user, targetRolePosition)
		) {
			return <>{children}</>;
		}
		if (
			position === "lower" &&
			compareUserPosition(user, targetRolePosition) !== -1
		) {
			return <>{children}</>;
		}
		if (
			position === "equal" &&
			compareUserPosition(user, targetRolePosition) !== 0
		) {
			return <>{children}</>;
		}

		return <></>;
	}
	return <>{children}</>;
}

export default Restricted;
