import { db } from "@/db";
import { DataTable } from "@/components/dash/admin/users/UserDataTable";
import { columns } from "@/components/dash/admin/users/UserColumns";
import { Button } from "@/components/shadcn/ui/button";
import { BiSolidFileExport } from "react-icons/bi";

export default async function Page() {
	const users = await db.query.users.findMany({
		with: {
			registrationData: true,
			profileData: true,
		},
	});

	return (
		<div className="max-w-7xl mx-auto px-5 pt-44">
			<div className="w-full grid grid-cols-2 mb-5">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Users</h2>
						<p className="text-sm text-muted-foreground">{users.length} Total Users</p>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<a download href="/api/admin/export">
						<Button className="flex gap-x-1">
							<BiSolidFileExport />
							Export
						</Button>
					</a>
				</div>
			</div>
			{/* TODO: Would very much like to not have "as any" here in the future */}
			<DataTable columns={columns} data={users as any} />
		</div>
	);
}
