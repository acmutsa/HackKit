import RegisterFormSettings from "@/components/settings/RegistrationForm/RegisterFormSettings";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import { redirect } from "next/navigation";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");
	const user = await db.query.users.findFirst({
		with: {
			registrationData: true,
			profileData: true,
		},
		where: eq(users.clerkID, userId!),
	});
	if (!user) return redirect("/sign-in");

	return <RegisterFormSettings data={user.registrationData} />;
}
