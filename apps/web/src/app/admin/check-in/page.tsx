import CheckinScanner from "@/components/admin/scanner/CheckinScanner";
import { getUser } from "db/functions";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	if (!searchParams.user)
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

	const scanUser = await getUser(searchParams.user);
	console.log(scanUser);
	if (!scanUser){
		console.log("no scan user found");
		return (
			<div>
				<CheckinScanner
					hasScanned={true}
					checkedIn={null}
					scanUser={null}
					hasRSVP={null}
				/>
			</div>
		);
	}
		
	console.log('using scanner case instead')
	return (
		<div>
			<CheckinScanner
				hasScanned={true}
				checkedIn={scanUser.checkinTimestamp != null}
				scanUser={scanUser}
				hasRSVP={scanUser.isRSVPed}
			/>
		</div>
	);
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
