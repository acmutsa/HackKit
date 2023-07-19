import c from "@/hackkit.config";
import Day from "@/components/schedule/Day";
import { db } from "@/db";
import { format, compareAsc } from "date-fns";
import { type ReactNode } from "react";

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
		<main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center relative mt-16">
			<div className="absolute left-1/2 top-1/2 h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px]"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-8xl mb-10 font-extrabold text-transparent bg-gradient-to-t from-hackathon/80 to-white bg-clip-text">
				Schedule
			</h1>
			{/* <div className="grid grid-cols-2 gap-x-2 aspect-[40/9] w-full px-10">
				<div className="border-white border-2 rounded-xl"></div>
				<div className="border-white border-2 rounded-xl"></div>
			</div> */}
			<div className="grid grid-cols-2 gap-x-4 w-full">
				{/* <Day title="Saturday" />
				<Day title="Sunday" /> */}
				{entries.map(([key, value]) => (
					<Day
						key={key}
						title={format(value[0].startTime, "EEEE")}
						subtitle={format(value[0].startTime, "MM/dd/yyyy")}
						events={value}
					/>
				))}
			</div>
		</main>
	);
}

export const runtime = "edge";
export const revalidate = 60;
