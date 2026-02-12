import NewEventForm from "@/components/events/admin/NewEventForm";
import { PermissionType } from "@/lib/constants/permission";
import { userHasPermission } from "@/lib/utils/server/admin";
import { getCurrentUser } from "@/lib/utils/server/user";
import { notFound } from "next/navigation";

export default async function Page() {
	const user = await getCurrentUser();
	if (!userHasPermission(user, PermissionType.CREATE_EVENTS)) {
		return notFound();
	}
	const defaultDate = new Date();

	return (
		<div className="mx-auto max-w-3xl pt-32">
			<div className="grid grid-cols-2">
				<h1 className="text-3xl font-bold tracking-tight">New Event</h1>
			</div>
			<div className="mt-2 rounded-xl border border-muted p-5">
				<NewEventForm defaultDate={defaultDate} />
			</div>
		</div>
	);
}
