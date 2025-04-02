import Image from "next/image";
import { Button } from "@/components/shadcn/ui/button";
import { Badge } from "@/components/shadcn/ui/badge";
import { Info, CalendarCheck } from "lucide-react";
import Link from "next/link";
import UpdateRoleDialog from "@/components/admin/users/UpdateRoleDialog";
import {
	AccountInfo,
	PersonalInfo,
	ProfileInfo,
	TeamInfo,
} from "@/components/admin/users/ServerSections";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { isUserAdmin } from "@/lib/utils/server/admin";
import ApproveUserButton from "@/components/admin/users/ApproveUserButton";
import c from "config";
import { getHacker, getUser } from "db/functions";

export default async function Page({ params }: { params: { slug: string } }) {
	const { userId } = await auth();

	if (!userId) return notFound();

	const admin = await getUser(userId);
	if (!admin || !isUserAdmin(admin)) return notFound();

	const user = await getHacker(params.slug, true);

	if (!user) {
		return <p className="text-center font-bold">User Not Found</p>;
	}

	return (
		<main className="mx-auto max-w-5xl pt-44">
			<div className="mb-5 grid w-full grid-cols-3">
				<div className="flex items-center">
					<div>
						<h2 className="flex items-center gap-x-2 text-3xl font-bold tracking-tight">
							<Info />
							User Info
						</h2>
						{/* <p className="text-sm text-muted-foreground">{users.length} Total Users</p> */}
					</div>
				</div>
				<div className="col-span-2 flex items-center justify-end gap-2">
					<Link href={`/@${user.hackerTag}`} target="_blank">
						<Button variant={"outline"}>Hacker Profile</Button>
					</Link>

					<Link href={`mailto:${user.email}`}>
						<Button variant={"outline"}>Email Hacker</Button>
					</Link>

					<UpdateRoleDialog
						name={`${user.firstName} ${user.lastName}`}
						canMakeAdmins={admin.role === "super_admin"}
						currPermision={user.role}
						userID={user.clerkID}
					/>
					{(c.featureFlags.core.requireUsersApproval as boolean) && (
						<ApproveUserButton
							userIDToUpdate={user.clerkID}
							currentApproval={user.isApproved}
						/>
					)}
				</div>
			</div>
			<div className="mt-20 grid min-h-[500px] w-full grid-cols-3">
				<div className="flex h-full w-full max-w-[250px] flex-col items-center">
					<div className="relative aspect-square h-min w-full overflow-hidden rounded-full">
						<Image
							className="object-cover object-center"
							fill
							src={user.profilePhoto}
							alt={`Profile Photo for ${user.firstName} ${user.lastName}`}
						/>
					</div>
					<h1 className="mt-4 text-3xl font-semibold">
						{user.firstName} {user.lastName}
					</h1>
					<h2 className="font-mono text-muted-foreground">
						@{user.hackerTag}
					</h2>
					{/* <p className="mt-5 text-sm">{team.bio}</p> */}
					<div className="mt-5 flex gap-x-2">
						<Badge className="no-select">
							Joined{" "}
							{user.signupTime
								.toDateString()
								.split(" ")
								.slice(1)
								.join(" ")}
						</Badge>
						{user.isRSVPed && (
							<Badge className="no-select bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-padding text-center hover:from-teal-500 hover:to-blue-600">
								<CalendarCheck className="mr-1 h-3 w-3" />
								RSVP
							</Badge>
						)}
					</div>
				</div>
				<div className="col-span-2 overflow-x-hidden">
					<PersonalInfo user={user} />
					<ProfileInfo user={user} />
					<AccountInfo user={user} />
					<TeamInfo user={user} />
				</div>
			</div>
		</main>
	);
}

export const runtime = "edge";
