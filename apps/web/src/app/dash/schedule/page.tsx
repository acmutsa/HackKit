import c from "config";
import Day from "@/components/schedule/Day";
import { db } from "db";
import { format, compareAsc } from "date-fns";
import { type ReactNode } from "react";
import { formatInTimeZone } from "date-fns-tz";

export default async function Page() {
	const events = await db.query.events.findMany();
	let days: Record<string, typeof events> = {};
	let toRender: ReactNode[] = [];
	events.forEach((event) => {
		const key = format(event.startTime, "MM/dd");
		if (!days[key]) {
			days[key] = [event];
		} else {
			days[key].push(event);
		}
	});
	const entries = Object.entries(days);
	entries.sort((a, b) => {
		const dateA = a[1][0].startTime;
		const dateB = b[1][0].startTime;
		return compareAsc(dateA, dateB);
	});

	return (
		<main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
				Schedule
			</h1>
			{/* <div className="grid grid-cols-2 gap-x-2 aspect-[40/9] w-full px-10">
				<div className="border-white border-2 rounded-xl"></div>
				<div className="border-white border-2 rounded-xl"></div>
			</div> */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 w-full p-2 gap-y-2">
				{/* <Day title="Saturday" />
				<Day title="Sunday" /> */}
				{entries.map(([key, value]) => (
					<Day
						key={key}
						title={formatInTimeZone(value[0].startTime, c.hackathonTimezone, "EEEE")}
						subtitle={formatInTimeZone(value[0].startTime, c.hackathonTimezone, "MM/dd/yyyy")}
						events={value}
					/>
				))}
			</div>
		</main>
	);
}

export const runtime = "edge";
export const revalidate = 60;
