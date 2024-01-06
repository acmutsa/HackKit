import { db } from "@/db";
import { DataTable } from "@/components/dash/admin/events/EventDataTable";
import { columns } from "@/components/dash/admin/events/EventColumns";
import { Button } from "@/components/shadcn/ui/button";
import { AiFillPlusCircle } from "react-icons/ai";
import Link from "next/link";

export default async function Page() {
	const events = await db.query.events.findMany();

	return (
		<div className="max-w-7xl mx-auto px-5 pt-44">
			<div className="w-full grid grid-cols-2 mb-5">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Events</h2>
						<p className="text-sm text-muted-foreground">
							{events.length} Event{events.length != 1 ? "s" : ""}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Link href="/admin/events/new">
						<Button className="flex gap-x-1">
							<AiFillPlusCircle />
							New Event
						</Button>
					</Link>
				</div>
			</div>
			<DataTable columns={columns} data={events} />
		</div>
	);
}
