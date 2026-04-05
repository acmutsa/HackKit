import AnalyticsTabs from "@/components/admin/analytics/participants/shared/AnalyticsTabs";
import { PermissionType } from "@/lib/constants/permission";
import { userHasPermission } from "@/lib/utils/server/admin";
import { getCurrentUser } from "@/lib/utils/server/user";
import { notFound } from "next/navigation";

export default async function Page() {
	const user = await getCurrentUser();

	//TODO: check permissions

	return (
		<div className="mx-auto w-full max-w-7xl px-5 py-2">
			<div className="mb-6 space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">
					Participants Analytics
				</h1>
			</div>
			//TODO: load sections only when on the screen
			<AnalyticsTabs />
		</div>
	);
}
