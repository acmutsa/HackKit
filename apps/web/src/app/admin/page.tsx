import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

import FullScreenMessage from "@/components/shared/FullScreenMessage";

export default async function Page() {
	const { userId } = auth();
	if (!userId) {
		return (
			<FullScreenMessage message="No clue how this happened since you should have been redirected, but this page is only viewable by admins." />
		);
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
		return <FullScreenMessage title="Access Denied" message="You are not an admin." />;
	}

	return (
		<div>
			<h1>Admin Page</h1>
		</div>
	);
}

export const runtime = "edge";
