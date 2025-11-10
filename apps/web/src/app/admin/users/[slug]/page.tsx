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
} from "@/components/admin/users/ServerSections";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/shadcn/ui/dropdown-menu";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { userHasPermission } from "@/lib/utils/server/admin";
import ApproveUserButton from "@/components/admin/users/ApproveUserButton";
import c from "config";
import { getHacker, getUser } from "db/functions";
import BanUserDialog from "@/components/admin/users/BanUserDialog";
import { db, eq } from "db";
import { bannedUsers } from "db/schema";
import RemoveUserBanDialog from "@/components/admin/users/RemoveUserBanDialog";
import { PermissionType } from "@/lib/constants/permission";
import Restricted from "@/components/Restricted";
import { getCurrentUser } from "@/lib/utils/server/user";

export default async function Page({ params }: { params: { slug: string } }) {
	const admin = await getCurrentUser();
	if (!userHasPermission(admin, PermissionType.VIEW_USERS)) return notFound();

	const subject = await getHacker(params.slug);

	if (!subject) {
		return <p className="text-center font-bold">User Not Found</p>;
	}

	const banInstance = await db.query.bannedUsers.findFirst({
		where: eq(bannedUsers.userID, subject.clerkID),
	});

	return (
		<main className="mx-auto max-w-5xl pt-44">
			{!!banInstance && (
				<div className="absolute left-0 top-28 w-screen bg-destructive p-2 text-center">
					<strong>
						This user has been suspended, reason for suspension:{" "}
					</strong>
					{banInstance.reason}
				</div>
			)}
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
				<div className="col-span-2 hidden items-center justify-end gap-2 md:flex">
					<Link href={`/@${subject.hackerTag}`} target="_blank">
						<Button variant={"outline"}>Hacker Profile</Button>
					</Link>

					<Link href={`mailto:${subject.email}`}>
						<Button variant={"outline"}>Email Hacker</Button>
					</Link>

					<Restricted
						user={admin}
						permissions={PermissionType.CHANGE_USER_ROLES}
						targetRolePosition={subject.role.position}
						position="higher"
					>
						<UpdateRoleDialog
							name={`${subject.firstName} ${subject.lastName}`}
							currentRoleId={subject.role_id}
							userID={subject.clerkID}
						/>
					</Restricted>

					<Restricted
						user={admin}
						permissions={PermissionType.BAN_USERS}
						targetRolePosition={subject.role.position}
						position="higher"
					>
						{!!banInstance ? (
							<RemoveUserBanDialog
								name={`${subject.firstName} ${subject.lastName}`}
								reason={banInstance.reason!}
								userID={subject.clerkID}
							/>
						) : (
							<BanUserDialog
								name={`${subject.firstName} ${subject.lastName}`}
								userID={subject.clerkID}
							/>
						)}
					</Restricted>

					{(c.featureFlags.core.requireUsersApproval as boolean) && (
						<ApproveUserButton
							userIDToUpdate={subject.clerkID}
							currentApproval={subject.isApproved}
						/>
					)}
				</div>
				<div className="col-span-2 flex items-center justify-end pr-4 md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={"outline"}>Admin Actions</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="min-w-[160px]"
						>
							<DropdownMenuItem className="justify-center">
								<Link
									href={`/@${subject.hackerTag}`}
									target="_blank"
								>
									<Button variant={"outline"}>
										Hacker Profile
									</Button>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="justify-center">
								<Link href={`mailto:${subject.email}`}>
									<Button variant={"outline"}>
										Email Hacker
									</Button>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<div className="cursor-pointer rounded-sm px-2 py-1.5 text-center text-sm hover:bg-accent">
								<UpdateRoleDialog
									name={`${subject.firstName} ${subject.lastName}`}
									currentRoleId={subject.role_id}
									userID={subject.clerkID}
								/>
							</div>

							{(c.featureFlags.core
								.requireUsersApproval as boolean) && (
								<ApproveUserButton
									userIDToUpdate={subject.clerkID}
									currentApproval={subject.isApproved}
								/>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="mt-20 grid min-h-[500px] w-full grid-cols-3">
				<div className="flex h-full w-full max-w-[250px] flex-col items-center">
					<div className="relative aspect-square h-min w-full overflow-hidden rounded-full">
						<Image
							className="object-cover object-center"
							fill
							src={subject.profilePhoto}
							alt={`Profile Photo for ${subject.firstName} ${subject.lastName}`}
						/>
					</div>
					<h1 className="mt-4 text-3xl font-semibold">
						{subject.firstName} {subject.lastName}
					</h1>
					<h2 className="font-mono text-muted-foreground">
						@{subject.hackerTag}
					</h2>
					{/* <p className="mt-5 text-sm">{team.bio}</p> */}
					<div className="mt-5 flex gap-x-2">
						<Badge className="no-select">
							Joined{" "}
							{subject.signupTime
								.toDateString()
								.split(" ")
								.slice(1)
								.join(" ")}
						</Badge>
						{subject.isRSVPed && (
							<Badge className="no-select bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-padding text-center hover:from-teal-500 hover:to-blue-600">
								<CalendarCheck className="mr-1 h-3 w-3" />
								RSVP
							</Badge>
						)}
					</div>
				</div>
				<div className="col-span-2 overflow-x-hidden">
					<PersonalInfo user={subject} />
					<ProfileInfo user={subject} />
					<AccountInfo user={subject} />
				</div>
			</div>
		</main>
	);
}

export const runtime = "edge";
