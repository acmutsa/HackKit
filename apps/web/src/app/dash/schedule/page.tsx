import c from "config";
import Day from "@/components/schedule/Day";
import { db } from "db";
import { format, compareAsc } from "date-fns";
import { type ReactNode } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { redirect } from "next/navigation";

export default async function Page() {
	const events = await db.query.events.findMany();

	return (
		<main className="mx-auto mt-16 flex min-h-[70%] w-full max-w-5xl flex-col items-center">
			<h1 className="text-center text-4xl font-black">
				Bug with Scheduling was found. Fix Coming soon!
			</h1>
			<h3 className="text-xl font-bold">- Christian</h3>
		</main>
	);
}

export const runtime = "edge";
export const revalidate = 60;
