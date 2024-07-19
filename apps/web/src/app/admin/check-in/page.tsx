import CheckinScanner from "@/components/admin/scanner/CheckinScanner";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { events, users, scans } from "db/schema";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	// TODO: maybe move event existant check into a layout so it holds state?

	// if (!params || !params.id || isNaN(parseInt(params.id))) {
	//   return (
	//     <FullScreenMessage
	//       title={"Invalid ID"}
	//       message={"The Event ID in the URL is invalid."}
	//     />
	//   );
	// }

	// const event = await db.query.events.findFirst({
	//   where: eq(events.id, parseInt(params.id)),
	// });

	// if (!event) {
	//   return (
	//     <FullScreenMessage
	//       title={"Invalid ID"}
	//       message={"The Event ID in the URL is invalid."}
	//     />
	//   );
	// }

	// Returns only if search params exist
	if (searchParams.user) {
		const [isChecked, scanUser, hasRSVPed] = await db.transaction(
			async (tx) => {
				const scanUser = await tx.query.users.findFirst({
					where: eq(users.clerkID, searchParams.user ?? "unknown"),
				});
				if (!scanUser) {
					return [null, null, null];
				}
				const scan = await tx
					.select({
						isChecked: users.checkedIn,
						hasRSVPed: users.rsvp,
					})
					.from(users)
					.where(eq(users.clerkID, searchParams.user!));
				if (scan) {
					return [scan[0].isChecked, scanUser, scan[0].hasRSVPed];
				} else {
					return [null, scanUser, null];
				}
			},
		);

		return (
			<div>
				<CheckinScanner
					checkedIn={isChecked}
					hasScanned={true}
					scanUser={scanUser}
					hasRSVP={hasRSVPed}
				/>
			</div>
		);
	}

	// Fall through case
	return (
		<div>
			<CheckinScanner
				hasScanned={false}
				checkedIn={null}
				scanUser={null}
				hasRSVP={null}
			/>
		</div>
	);
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
