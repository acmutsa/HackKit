import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCurrentUser, getHackkit } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getAuthSession();
	if (!session) redirect("/sign-in");

	const user = await getCurrentUser();
	const hackkit = await getHackkit();
	const userData = await hackkit.userData.getUserData(user.authId);
	redirect(userData ? "/dashboard" : "/register");
}
