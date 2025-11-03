"use server";

import { EventDataTable } from "@/components/events/shared/EventDataTable";
import { columns } from "@/components/events/shared/EventColumns";
import { Button } from "@/components/shadcn/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAllEvents } from "db/functions";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { userHasPermission } from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/utils/server/user";

export default async function Page() {
	const user = await getCurrentUser();

	if (!userHasPermission(user, PermissionType.VIEW_EVENTS)) {
		return notFound();
	}

	const events = await getAllEvents();
	const isUserAuthorized = userHasPermission(
		user,
		PermissionType.CREATE_EVENTS,
	);
	return (
		<div className="mx-auto max-w-7xl px-5 pt-44">
			<div className="mb-5 grid w-full grid-cols-2">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							Events
						</h2>
						<p className="text-sm text-muted-foreground">
							{events.length} Event{events.length != 1 && "s"}
						</p>
					</div>
				</div>
				{isUserAuthorized && (
					<div className="flex items-center justify-end">
						<Link href="/admin/events/new">
							<Button className="flex gap-x-1">
								<PlusCircle />
								New Event
							</Button>
						</Link>
					</div>
				)}
			</div>
			<EventDataTable
				columns={columns}
				data={events.map((ev) => ({
					...ev,
					isUserAdmin: isUserAuthorized,
				}))}
			/>
		</div>
	);
}
