import AccountSettings from "@/components/settings/AccountSettings";
import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { redirect } from "next/navigation";

export default async function Page() {
	const { userId } = auth();
	const user = await db.query.userCommonData.findFirst({
		with: { hackerData: true },
		where: eq(userCommonData.clerkID, userId!),
	});
	if (!user) return redirect("/sign-in");

	return <RegisterFormSettings data={user.registrationData} />;
}
