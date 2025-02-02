import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { Button } from "@/components/shadcn/ui/button";
import { auth, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { DropdownSwitcher } from "@/components/shared/ThemeSwitcher";
import { getUser } from "db/functions";
import { clientLogOut } from "@/lib/utils/server/user";

export default async function ProfileButton() {
	const clerkUser = auth();
	const { userId } = clerkUser;
	if (!userId) return null;

	const user = await getUser(userId);
	if (!user && !userId) return null;

	if (!user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-8 w-8 rounded-full"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={clerkUser.user?.imageUrl}
								alt={""}
							/>
							<AvatarFallback>
								{clerkUser.user?.firstName &&
								clerkUser.user?.lastName
									? clerkUser.user?.firstName.charAt(0) +
										clerkUser.user?.lastName.charAt(0)
									: "NA"}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="mt-2 w-56"
					align="end"
					forceMount
				>
					<DropdownMenuGroup>
						<DropdownSwitcher />
						<Link href={`/register`}>
							<DropdownMenuItem className="cursor-pointer">
								Complete Registration
							</DropdownMenuItem>
						</Link>
						<Link href={`/bug-report`}>
							<DropdownMenuItem className="cursor-pointer">
								Report a Bug
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<SignOutButton signOutCallback={clientLogOut}>
						<DropdownMenuItem className="cursor-pointer hover:!bg-destructive">
							Sign out
						</DropdownMenuItem>
					</SignOutButton>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.profilePhoto} alt="@shadcn" />
						<AvatarFallback>
							{user.firstName.charAt(0) + user.lastName.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
						<p className="text-xs leading-none text-muted-foreground">
							@{user.hackerTag}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownSwitcher />
					<Link href={`/@${user.hackerTag}`}>
						<DropdownMenuItem className="cursor-pointer">
							Profile
						</DropdownMenuItem>
					</Link>
					<Link href={`/bug-report`}>
						<DropdownMenuItem className="cursor-pointer">
							Report a Bug
						</DropdownMenuItem>
					</Link>
					<Link href={"/settings"}>
						<DropdownMenuItem className="cursor-pointer">
							Settings
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<SignOutButton signOutCallback={clientLogOut}>
					<DropdownMenuItem className="cursor-pointer hover:!bg-destructive">
						Sign out
					</DropdownMenuItem>
				</SignOutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const runtime = "edge";
