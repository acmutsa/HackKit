import { users, registrationData, profileData, userRelations } from "@/db/schema";
import { db } from "@/db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { DataTable } from "@/components/dash/admin/users/UserDataTable";
import { columns, userValidatorType } from "@/components/dash/admin/users/UserColumns";

export default async function Page() {
	const users = await db.query.users.findMany({
		with: {
			registrationData: true,
			profileData: true,
		},
	});

	return (
		<div className="max-w-7xl mx-auto px-5">
			{/* TODO: Would very much like to not have "as any" here in the future */}
			<DataTable columns={columns} data={users as any} />
		</div>
	);
}
