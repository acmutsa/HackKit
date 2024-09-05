import AccountSettings from "@/components/settings/AccountSettings";
import { registrationData, users } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/settings/ProfileSettings";
import RegistrationSettings from "@/components/settings/RegistrationSettings";

export default async function Page() {
	const { userId } = auth();
	if (!userId) throw new Error("User not found");
	const user = await db.query.users.findFirst({
		with: {
			registrationData: true,
			profileData: true,
		},
		where: eq(users.clerkID, userId!),
	});
	if (!user) return redirect("/sign-in");

	function Header({ tag }: { tag: string }) {
		return (
			<h1 id={tag} className="mt-10 pb-5 text-4xl font-bold">
				{tag}
			</h1>
		);
	}

	return (
		<div>
			<Header tag="Account" />
			<AccountSettings user={user} />

			<Header tag="Profile" />
			<ProfileSettings profile={user.profileData}/>
			<Header tag={"Registration"} />
			<RegistrationSettings data={user.registrationData}/>
		</div>
	);
}
