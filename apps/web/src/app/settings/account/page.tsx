import AccountSettings from "@/components/settings/AccountSettings";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getHacker } from "db/functions";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");

	const user = await getHacker(userId, false);
	if (!user) return redirect("/sign-in");
	return <AccountSettings user={user} />;
}

export const runtime = "edge";
