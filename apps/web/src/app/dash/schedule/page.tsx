import { Suspense } from "react";
import UserScheduleView from "@/components/schedule/UserScheduleView";
import Loading from "@/components/shared/Loading";
export default function Page() {
	return (
		<Suspense fallback={<Loading />}>
			<UserScheduleView />
		</Suspense>
	);
}

export const runtime = "edge";
export const revalidate = 60;
