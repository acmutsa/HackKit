import CheckinScanner from "@/components/admin/scanner/CheckinScanner";
import { db } from "db";
import { eq } from "db/drizzle";
import { userCommonData } from "db/schema";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	// Returns only if search params exist
	if (searchParams.user) {
		const [isChecked, scanUser, hasRSVPed] = await db.transaction(
			async (tx) => {
				const scanUser = await tx.query.userCommonData.findFirst({
					where: eq(userCommonData.clerkID, searchParams.user ?? "unknown"),
				});
				if (!scanUser) {
					return [null, null, null];
				}
				const scan = await tx
					.select({
						checkinTimestamp: userCommonData.checkinTimestamp,
						hasRSVPed: userCommonData.isRSVPed,
					})
					.from(userCommonData)
					.where(eq(userCommonData.clerkID, searchParams.user!));
				if (scan) {
					return [scan[0].checkinTimestamp != null, scanUser, scan[0].hasRSVPed];
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
