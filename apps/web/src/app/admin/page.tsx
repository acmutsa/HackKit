import { Overview } from "@/components/admin/landing/Overview";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/shadcn/ui/card";
import { Users, UserCheck, User2, TimerReset, MailCheck } from "lucide-react";
import type { User } from "db/types";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getAllUsers, getUser } from "db/functions";
import Link from "next/link";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { formatInTimeZone } from "date-fns-tz";
import { getClientTimeZone } from "@/lib/utils/client/shared";

export default async function Page() {
	const { userId } = await auth();
	if (!userId) return notFound();

	const adminUser = await getUser(userId);
	if (
		!adminUser ||
		(adminUser.role !== "admin" &&
			adminUser.role !== "super_admin" &&
			adminUser.role !== "volunteer")
	) {
		return notFound();
	}

	const allUsers = (await getAllUsers()) ?? [];

	const {
		rsvpCount,
		checkinCount,
		recentSignupCount,
		recentRegisteredUsers,
	} = getRecentRegistrationData(allUsers);
	const { cf } = getRequestContext();

	const timezone = getClientTimeZone(cf.timezone);

	return (
		<div className="mx-auto h-16 w-full max-w-7xl pt-44">
			<div className="w-full px-2">
				<h2 className="text-xl font-bold">Welcome,</h2>
				<h1 className="text-5xl font-black text-hackathon">
					{adminUser.firstName}
				</h1>
			</div>
			<div className="grid grid-cols-4 gap-x-2 pt-10">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Registrations
						</CardTitle>
						<User2 />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{allUsers.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Teams
						</CardTitle>
						<Users />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							RSVPs
						</CardTitle>
						<MailCheck />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{rsvpCount}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Check-ins
						</CardTitle>
						<UserCheck />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{checkinCount}</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-3 gap-x-2 py-2">
				<Card className="col-span-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<div>
							<CardTitle className="text-md font-bold">
								Registrations
							</CardTitle>{" "}
							<CardDescription>
								{Object.values(recentSignupCount).reduce(
									(a, b) => a + b,
									0,
								)}{" "}
								new registrations have occurred in the past 7
								days.
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
							<CardTitle className="text-md font-bold">
								Recent Registrations
							</CardTitle>{" "}
						</div>
						<TimerReset />
					</CardHeader>
					<CardContent>
						<div className="flex flex-col space-y-2">
							{recentRegisteredUsers.map((user) => (
								<div
									key={user.clerkID}
									className="flex items-center justify-between"
								>
									<Link
										href={`/admin/users/${user.clerkID}`}
										className="hover:underline"
									>
										{user.firstName} {user.lastName}
									</Link>
									<span className="text-sm text-gray-500">
										{formatInTimeZone(
											user.signupTime,
											timezone,
											"MMMM dd h:mm a",
										)}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function getRecentRegistrationData(users: User[]) {
	type DateNumberMap = { [key: string]: number };

	let rsvpCount = 0;
	let checkinCount = 0;

	const recentRegisteredUsers: User[] = [];
	let recentRegisteredUsersCount = 0;
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
		if (user.isRSVPed) rsvpCount++;
		if (user.checkinTimestamp) checkinCount++;

		const stamp = user.signupTime.toISOString().split("T")[0];

		if (recentSignupCount[stamp] != undefined) {
			if (recentRegisteredUsersCount < 10) {
				recentRegisteredUsers.push(user);
				recentRegisteredUsersCount++;
			}
			recentSignupCount[stamp]++;
		}
	}

	return {
		rsvpCount,
		checkinCount,
		recentSignupCount,
		recentRegisteredUsers,
	};
}

export const runtime = "edge";
