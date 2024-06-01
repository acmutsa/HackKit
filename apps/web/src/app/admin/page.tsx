import { Overview } from "@/components/dash/admin/landing/Overview";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/shadcn/ui/card";
import { db } from "db";
import { eq, desc } from "db/drizzle";
import { users } from "db/schema";
import { Users, UserCheck, User2, TimerReset,MailCheck } from "lucide-react";
import type { userType } from "@/lib/utils/shared/types";
import { unstable_cache } from "next/cache";
import { env } from "@/env.mjs";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

export default async function Page() {
	// const getCachedUsers = unstable_cache(getUsers, [`global_users_${env.INTERNAL_AUTH_KEY}`], {
	// 	revalidate: 30,
	// });

	const { userId } = auth();

	if (!userId) return notFound();

	const adminUser = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		orderBy: desc(users.createdAt),
	});

	if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "super_admin")) {
		return notFound();
	}

	const allUsers = await getUsers();

	const { rsvpCount, checkinCount, recentSignupCount } = getRecentRegistrationData(allUsers);

	return (
		<div className="w-full max-w-7xl mx-auto h-16 pt-44">
			<div className="w-full px-2">
				<h2 className="font-bold text-xl">Welcome,</h2>
				<h1 className="font-black text-5xl text-hackathon">{adminUser.firstName}</h1>
			</div>
			<div className="grid grid-cols-4 gap-x-2 pt-10">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Registrations</CardTitle>
						<User2 />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allUsers.length}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Teams</CardTitle>
						<Users />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{0}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">RSVPs</CardTitle>
						<MailCheck/>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{rsvpCount}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Check-ins</CardTitle>
						<UserCheck/>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{checkinCount}</div>
						{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-3 gap-x-2 py-2">
				<Card className="col-span-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<div>
							<CardTitle className="text-md font-bold">Registrations</CardTitle>{" "}
							<CardDescription>
								{Object.values(recentSignupCount).reduce((a, b) => a + b, 0)} new registrations have
								occurred in the past 7 days.
							</CardDescription>
						</div>

						<User2 />
					</CardHeader>
					<CardContent>
						<Overview rawData={recentSignupCount} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<div>
							<CardTitle className="text-md font-bold">Recent Registrations</CardTitle>{" "}
						</div>

						<TimerReset />
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			</div>
		</div>
	);
}

function getRecentRegistrationData(users: userType[]) {
	type DateNumberMap = { [key: string]: number };

	let rsvpCount = 0;
	let checkinCount = 0;
	let recentSignupCount: DateNumberMap = {};

	for (let i = 0; i < 7; i++) {
		// Create a new date object for each day
		const date = new Date();
		date.setDate(date.getDate() - i);

		// Format the date as YYYY-MM-DD
		const dateString = date.toISOString().split("T")[0];
		
		// Assign a default value, e.g., 0
		recentSignupCount[dateString] = 0;
	}

	for (const user of users) {
		

		if (user.rsvp) rsvpCount++;
		if (user.checkedIn) checkinCount++;

		const stamp = user.createdAt.toISOString().split("T")[0];

		if (recentSignupCount[stamp] != undefined) recentSignupCount[stamp]++;
	}

	return { rsvpCount, checkinCount, recentSignupCount };
}

async function getUsers() {
	const usersReq = await db.query.users.findMany();
	return usersReq;
}

export const runtime = "edge";
