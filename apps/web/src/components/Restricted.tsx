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
		console.log(
			user.role?.name + ":" + user.role?.position,
			targetRolePosition,
			compareUserPosition(user, targetRolePosition, position),
		);
		if (!compareUserPosition(user, targetRolePosition, position)) {
			return <></>;
		}
	}
	return <>{children}</>;
}

export default Restricted;
