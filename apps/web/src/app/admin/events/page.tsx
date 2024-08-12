import { EventDataTable } from "@/components/admin/events/EventDataTable";
import { columns } from "@/components/admin/events/EventColumns";
import { Button } from "@/components/shadcn/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAllEvents } from "@/lib/queries/events";
export default async function Page() {
	const events = await getAllEvents(true);
	const currentDate = new Date();
	return (
		<div className="mx-auto max-w-7xl px-5 pt-44">
			<div className="mb-5 grid w-full grid-cols-2">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							Events
						</h2>
						<p className="text-sm text-muted-foreground">
							{events.length} Event{events.length != 1 && "s"}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Link href="/admin/events/new">
						<Button className="flex gap-x-1">
							<PlusCircle />
							New Event
						</Button>
					</Link>
				</div>
			</div>
			<EventDataTable columns={columns} data={events} />
		</div>
	);
}
