import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RegistrationFormSettings from "@/components/settings/RegistrationForm/RegisterFormSettings";
import { getHackerData, getUser } from "db/functions";

export default async function Page() {
	const { userId } = await auth();
	if (!userId) return redirect("/sign-in");
	const user = await getUser(userId);
	if (!user) return redirect("/sign-in");
	const hackerData = await getHackerData(userId);
	if (!hackerData) return redirect("/sign-in");

	return <RegistrationFormSettings user={user} data={hackerData} />;
}
