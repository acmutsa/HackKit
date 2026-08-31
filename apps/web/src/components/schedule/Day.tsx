import { EventType } from "@/lib/types/events";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import EventItem from "./EventItem";
import c from "config";
interface DayProps {
	title: string;
	subtitle: string;
	events: EventType[];
}

export default function Day({ title, subtitle, events }: DayProps) {
	const userTimeZone = getClientTimeZone(c.hackathonTimezone);

	return (
		<div className="flex min-h-[60vh] w-[92%] flex-col items-center rounded-xl bg-white px-2 pb-4 backdrop-blur transition dark:bg-white/[0.08] lg:w-full">
			<h1 className="mt-5 text-4xl font-extrabold text-hackathon dark:text-primary">
				{title}
			</h1>
			<h2 className="mb-5 text-lg text-muted-foreground">{subtitle}</h2>
			<div className="flex w-full flex-col items-center space-y-4 px-2">
				{events.length > 0 ? (
					events.map((event) => (
						<EventItem
							key={event.id}
							event={event}
							userTimeZone={userTimeZone}
						/>
					))
				) : (
					<div className="flex h-[30vh] w-full items-center justify-center">
						<h1 className="text-center text-3xl">
							No events scheduled at this time.
						</h1>
					</div>
				)}
			</div>
		</div>
	);
}
