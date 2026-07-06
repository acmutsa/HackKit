import { notFound } from "next/navigation";
import { ScheduleDetail } from "@hackkit/ui";
import { getHackkit } from "@/lib/runtime";

export const dynamic = "force-dynamic";

type ScheduleEventPageProps = {
	params: {
		eventId: string;
	};
};

export default async function ScheduleEventPage({
	params,
}: ScheduleEventPageProps) {
	const hackkit = await getHackkit();
	const event = await hackkit.events.getEvent({ eventId: params.eventId });

	if (!event) notFound();

	const eventType = hackkit.events.options.find(
		(option) => option.value === event.type,
	);

	return (
		<ScheduleDetail
			event={event}
			typeLabel={eventType?.label ?? event.type}
			typeColor={eventType?.color ?? "#795548"}
			backHref="/schedule"
			actions={[
				{ label: "Open dashboard", href: "/dashboard" },
				{ label: "Get help", href: "/help" },
			]}
		/>
	);
}
