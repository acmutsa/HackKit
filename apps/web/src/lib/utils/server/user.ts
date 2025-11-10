import { auth } from "@clerk/nextjs/server";
import { getUser } from "db/functions";
import { UserWithRole } from "db/types";
import { redirect } from "next/navigation";
import { cache } from "react";
export async function clientLogOut() {
	"use server";
	redirect("/");
}

export const getCurrentUser = cache(async (): Promise<UserWithRole> => {
	"use server";
	const { userId } = await auth();
	if (!userId) {
		return redirect("/login");
	}
	const user = await getUser(userId);
	if (!user) {
		return redirect("/login");
	}

	return user;
});
