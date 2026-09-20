import { type EventType as Event } from "@/lib/types/events";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import c from "config";
import { ReactNode } from "react";

const daysOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function splitByDay(schedule: Event[]) {
	const days: Map<string, Event[]> = new Map();
	schedule.forEach((event) => {
		const day = daysOfWeek[event.startTime.getDay()];
		const existing = days.get(day);
		if (existing) existing.push(event);
		else days.set(day, [event]);
	});
	return days;
}

type DayHeaderProps = { dayName: string };
const DefaultDayHeader = ({ dayName }: DayHeaderProps) => (
	<tr key={dayName + " title"} className="border-b py-8">
		<td>
			<h2 className="w-full px-4 py-4 text-5xl font-black">{dayName}</h2>
		</td>
	</tr>
);

type RowProps = { event: Event; userTimeZone: string };

export default function ScheduleTimelineBare({
	schedule,
	timezone,
	DayHeader = DefaultDayHeader,
	RenderEventRow,
}: {
	schedule: Event[];
	timezone?: string;
	DayHeader?: React.ComponentType<DayHeaderProps>;
	RenderEventRow: React.ComponentType<RowProps>;
}) {
	const userTimeZone = timezone ?? getClientTimeZone(c.hackathonTimezone);
	const days = Array.from(splitByDay(schedule).entries());

	return (
		<div className="mx-auto mt-5 w-[99vw] lg:w-3/4">
			<table className="w-full">
				<tbody>
					{days.map(
						([dayName, arr]): ReactNode => (
							<>
								<DayHeader dayName={dayName} />
								{arr.map((event) => (
									<RenderEventRow
										key={event.id}
										event={event}
										userTimeZone={userTimeZone}
									/>
								))}
							</>
						),
					)}
				</tbody>
			</table>
		</div>
	);
}
