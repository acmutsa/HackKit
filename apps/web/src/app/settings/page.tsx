import AccountSettings from "@/components/settings/AccountSettings";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/settings/ProfileSettings";
import RegistrationSettings from "@/components/settings/RegistrationSettings";
import { getUser } from "db/functions";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");
	const user = await getUser(userId);
	if (!user) return redirect("/sign-in");

	function Header({ tag }: { tag: string }) {
		return (
			<h1
				id={tag.toLowerCase()}
				className="mt-10 pb-5 text-4xl font-bold"
			>
				{tag}
			</h1>
		);
	}

	return (
		<div>
			<Header tag="Account" />
			<AccountSettings user={user} />
			<Header tag="Profile" />
			<ProfileSettings profile={user} />
			<Header tag={"Registration"} />
			<RegistrationSettings />
		</div>
	);
}
