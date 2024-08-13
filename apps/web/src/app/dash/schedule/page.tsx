import c from "config";
import { format, compareAsc } from "date-fns";
import { Suspense } from "react";
import UserScheduleView from "@/components/schedule/UserScheduleView";
import Loading from "@/components/shared/Loading";
export default async function Page() {
	

	return (
		<Suspense fallback={<Loading />}>
			<UserScheduleView/>
		</Suspense>
	);
}

export const runtime = "edge";
export const revalidate = 60;
