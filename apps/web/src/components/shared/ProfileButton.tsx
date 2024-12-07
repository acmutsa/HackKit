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
import DefaultDropdownTrigger from "../dash/shared/DefaultDropDownTrigger";
import MobileNavBarLinks from "./MobileNavBarLinks";
import { getUser } from "db/functions";
import { clientLogOut } from "@/lib/utils/client/shared";

export default async function ProfileButton() {
	const clerkUser = await auth();
	const { userId } = clerkUser;

	// This is our default component if there is no user data
	if (!userId) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					className="border-transparent bg-transparent hover:border-transparent hover:bg-transparent"
				>
					<Button className="relative rounded-full border-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent">
						<DefaultDropdownTrigger />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="mt-2 w-32 bg-[rgb(247,240,232)] dark:bg-black sm:w-40 lg:w-52"
					align="end"
					forceMount
				>
					<DropdownMenuGroup>
						<Link href={`/sign-in`}>
							<DropdownMenuItem className="cursor-pointer">
								Sign In
							</DropdownMenuItem>
						</Link>
						<Link href={`/register`}>
							<DropdownMenuItem className="cursor-pointer">
								Register
							</DropdownMenuItem>
						</Link>
						<MobileNavBarLinks />
						<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
						<DropdownSwitcher />
						<Link href={`/bug-report`}>
							<DropdownMenuItem className="cursor-pointer">
								Report a Bug
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Make request with the clerk data that we may or may not have
	const user = await getUser(userId);

	// If we do not have a fully fledged user, encourage them to complete registration
	if (!user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					className="border-transparent bg-transparent hover:border-transparent hover:bg-transparent"
				>
					<Button className="relative rounded-full border-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent">
						<DefaultDropdownTrigger />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="mt-2 w-32 bg-[rgb(247,240,232)] dark:bg-black sm:w-40 lg:w-52"
					align="end"
					forceMount
				>
					<DropdownMenuGroup>
						<Link href={`/register`}>
							<DropdownMenuItem className="cursor-pointer">
								Complete Registration
							</DropdownMenuItem>
						</Link>
						<MobileNavBarLinks />
						<Link href={`/bug-report`}>
							<DropdownMenuItem className="cursor-pointer">
								Report a Bug
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
					<DropdownSwitcher />
					<SignOutButton signOutCallback={clientLogOut}>
						<DropdownMenuItem className="cursor-pointer hover:!bg-destructive">
							Sign out
						</DropdownMenuItem>
					</SignOutButton>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
	// Returns only if there is a full user
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
			<DropdownMenuContent
				className="mt-2 w-32 sm:w-40 lg:w-52"
				align="end"
				forceMount
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
						<p className="text-xs leading-none text-muted-foreground">
							@{user.hackerTag}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
				<DropdownMenuGroup>
					<Link href={`/@${user.hackerTag}`}>
						<DropdownMenuItem className="cursor-pointer">
							Profile
						</DropdownMenuItem>
					</Link>
					<Link href={`/dash/pass`}>
						<DropdownMenuItem className="cursor-pointer">
							Event Pass
						</DropdownMenuItem>
					</Link>
					{["admin", "super_admin", "volunteer"].includes(
						user.role,
					) && (
						<Link href={`/admin`}>
							<DropdownMenuItem className="cursor-pointer text-hackathon">
								Admin
							</DropdownMenuItem>
						</Link>
					)}
					<MobileNavBarLinks />
					<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
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
				<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
				<DropdownSwitcher />
				<SignOutButton signOutCallback={clientLogOut}>
					<DropdownMenuItem className="cursor-pointer text-red-500 hover:!bg-destructive hover:text-muted">
						Sign out
					</DropdownMenuItem>
				</SignOutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const runtime = "edge";
