import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { redirect } from "next/navigation";
import RegistrationFormSettings from "@/components/settings/RegistrationForm/RegisterFormSettings";
import {getHackerData, getUser} from "db/functions";
import {Hacker} from "db/types";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");
	const user = await getUser(userId);
	if (!user) return redirect("/sign-in");
	const hackerData = await getHackerData(userId);
	if (!hackerData) return redirect("/sign-in");

	return <RegistrationFormSettings user={user} data={hackerData} />;
}
