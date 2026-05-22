import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getAuthSession();
	if (!session) redirect("/sign-in");

	const userData = await hackkit.userData.getUserData(session.user.id);
	redirect(userData ? "/dashboard" : "/register");
}
