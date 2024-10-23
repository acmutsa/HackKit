import { Suspense } from "react";
import Loading from "@/components/shared/Loading";
import UserScheduleView from "@/components/schedule/UserScheduleView";
import Navbar from "@/components/shared/Navbar";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
export default function EventsPage() {
	return (
		<>
			<Suspense fallback={<Skeleton className="h-16 w-screen" />}>
				<Navbar />
			</Suspense>
			<Suspense fallback={<Loading />}>
				<UserScheduleView />
			</Suspense>
		</>
	);
}
