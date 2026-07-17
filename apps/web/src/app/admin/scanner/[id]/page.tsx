import PassScanner from "@/components/admin/scanner/PassScanner";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { getHacker } from "db/functions";
import { events, scans } from "db/schema";
import { userHasPermission } from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { notFound } from "next/dist/client/components/navigation";
import { getCurrentUser } from "@/lib/utils/server/user";

export default async function Page({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}) {
	// TODO: maybe move event existant check into a layout so it holds state?

	const user = await getCurrentUser();

	if (!userHasPermission(user, PermissionType.CREATE_SCANS)) {
		return notFound();
	}

	if (!params || !params.id || isNaN(parseInt(params.id))) {
		return (
			<FullScreenMessage
				title={"Invalid ID"}
				message={"The Event ID in the URL is invalid."}
			/>
		);
	}

	const event = await db.query.events.findFirst({
		where: eq(events.id, parseInt(params.id)),
	});

	if (!event) {
		return (
			<FullScreenMessage
				title={"Invalid ID"}
				message={"The Event ID in the URL is invalid."}
			/>
		);
	}

	if (!searchParams.user) {
		return (
			<div>
				<PassScanner
					event={event}
					hasScanned={false}
					scan={null}
					scanUser={null}
				/>
			</div>
		);
	}

	const scanUser = searchParams.user
		? await getHacker(searchParams.user)
		: null;

	const scan = !scanUser
		? null
		: await db.query.scans.findFirst({
				where: and(
					eq(scans.eventID, event.id),
					eq(scans.userID, scanUser.clerkID),
				),
			});

	return (
		<div>
			<PassScanner
				event={event}
				hasScanned={true}
				scan={scan ?? null}
				scanUser={scanUser ?? null}
			/>
		</div>
	);
}

export const dynamic = "force-dynamic";
