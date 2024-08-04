import c from "config";
import Day from "@/components/schedule/Day";
import { db } from "db";
import { format, compareAsc } from "date-fns";
import { type ReactNode } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { redirect } from 'next/navigation';

export default async function Page() {
	
	const events = await db.query.events.findMany();
	

	return (
    <main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
      <h1 className="text-4xl  text-center font-black">
        Schedule to be posted soon!
      </h1>
      <h3 className="text-xl font-bold">- sunhacks team</h3>
    </main>
  );
}

export const runtime = "edge";
export const revalidate = 60;
