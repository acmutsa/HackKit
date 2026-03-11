import { PermissionType } from "@/lib/constants/permission";
import { userHasPermission } from "@/lib/utils/server/admin";
import { getCurrentUser } from "@/lib/utils/server/user";
import { notFound } from "next/navigation";

import SendExampleEmailForm from "./SendExampleEmailForm";

export default async function Page() {
	const user = await getCurrentUser();

	if (!userHasPermission(user, PermissionType.VIEW_EVENTS)) {
		return notFound();
	}

	const isUserAuthorized = userHasPermission(
		user,
		PermissionType.SEND_EMAILS,
	);

	if (!isUserAuthorized) {
		return notFound();
	}

	return (
		<div className="mx-auto max-w-7xl px-5 pt-40">
			<h2 className="text-3xl font-bold tracking-tight">Emails</h2>
			<SendExampleEmailForm />
		</div>
	);
}
