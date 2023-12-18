import { db } from "@/db";
import { DataTable } from "@/components/dash/admin/events/EventDataTable";
import { columns } from "@/components/dash/admin/events/EventColumns";
import { Button } from "@/components/shadcn/ui/button";
import { BiSolidFileExport } from "react-icons/bi";
import { type eventTableValidatorType } from "@/components/dash/admin/events/EventColumns";

export default async function Page() {
	const events = await db.query.events.findMany();

	return (
		<div className="max-w-7xl mx-auto px-5">
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
					{/* <a download href="/api/admin/export">
						<Button className="flex gap-x-1">
							<BiSolidFileExport />
							Export
						</Button>
					</a> */}
				</div>
			</div>
			{/* TODO: Would very much like to not have "as any" here in the future */}
			<DataTable columns={columns} data={events} />
		</div>
	);
}
