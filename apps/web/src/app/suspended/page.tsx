import { getCurrentUser } from "@/lib/utils/server/user";
import { auth } from "@clerk/nextjs/server";
import { db, eq } from "db";
import { getUser } from "db/functions";
import { bannedUsers } from "db/schema";

export default async function Page() {
	const user = await getCurrentUser();

	const banInstance = await db.query.bannedUsers.findFirst({
		where: eq(bannedUsers.userID, user.clerkID),
	});
	if (!banInstance) return null;

	return (
		<div className="flex h-screen w-screen justify-center pt-16">
			<div className="h-fit max-w-md border-2 border-accent p-6">
				<h1 className="text-center text-2xl font-bold text-destructive">
					Account Suspended
				</h1>
				<h1 className="pt-2 text-center text-lg font-medium">
					Dear {user.firstName} {user.lastName},
				</h1>
				<h3 className="w-full text-center opacity-90">
					{" "}
					Your account was suspended
				</h3>
				<p className="w-full py-3 opacity-85">
					<strong>Reason: </strong>
					{banInstance.reason}
				</p>
				<footer className="border-t-2 border-accent pt-1 opacity-75">
					Contact administration for further assistance.
				</footer>
			</div>
		</div>
	);
}

export const runtime = "edge";
