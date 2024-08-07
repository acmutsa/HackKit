import PassScanner from "@/components/admin/scanner/PassScanner";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { events, userCommonData, scans } from "db/schema";

export default async function Page({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}) {
	// TODO: maybe move event existant check into a layout so it holds state?

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

	if (searchParams.user) {
		const [scan, scanUser] = await db.transaction(async (tx) => {
			const scanUser = await tx.query.userCommonData.findFirst({
				where: eq(userCommonData.clerkID, searchParams.user!),
                with: {
                    hackerData: {
                        with: {
                            team: true
                        }
                    }
                }
			});
			if (!scanUser) {
				return [null, null];
			}
			const scan = await tx.query.scans.findFirst({
				where: and(
					eq(scans.eventID, event.id),
					eq(scans.userID, scanUser.clerkID),
				),
			});
			if (scan) {
				return [scan, scanUser];
			} else {
				return [null, scanUser];
			}
		});
		return (
			<div>
				<PassScanner
					event={event}
					hasScanned={true}
					scan={scan}
					scanUser={scanUser}
				/>
			</div>
		);
	}

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

export const runtime = "edge";
export const dynamic = "force-dynamic";
