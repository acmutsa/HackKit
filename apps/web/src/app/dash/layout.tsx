import c from "config";
import Image from "next/image";

import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import { redirect } from "next/navigation";
import ProfileButton from "@/components/shared/ProfileButton";
import ClientToast from "@/components/shared/ClientToast";

import { TRPCReactProvider } from "@/trpc/react";
import { getUser } from "db/functions";

interface DashLayoutProps {
	children: React.ReactNode;
}

export default async function DashLayout({ children }: DashLayoutProps) {
	const clerkUser = await currentUser();

	if (!clerkUser || (await getUser(clerkUser.id)) == undefined) {
		return redirect("/register");
	}

	const user = await getUser(clerkUser.id);
	if (!user) return redirect("/register");

	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		user.isApproved === false &&
		user.role === "hacker"
	) {
		return redirect("/i/approval");
	}

	return (
		<>
			<TRPCReactProvider>
				<ClientToast />
				<div className="grid h-16 w-full grid-cols-2 bg-nav px-5">
					<div className="flex items-center gap-x-4">
						<Link href="/">
							<Image
								src={c.icon.svg}
								alt={c.hackathonName + " Logo"}
								width={32}
								height={32}
							/>
						</Link>

						<div className="h-[45%] w-[2px] rotate-[25deg] bg-muted-foreground" />
						<h2 className="font-bold tracking-tight">Dashboard</h2>
					</div>
					<div className="hidden items-center justify-end gap-x-4 md:flex">
						<Link href={"/"}>
							<Button
								variant={"outline"}
								className="bg-nav hover:bg-background"
							>
								Home
							</Button>
						</Link>
						<Link href={c.links.guide} target="_blank">
							<Button
								variant={"outline"}
								className="bg-nav hover:bg-background"
							>
								Survival Guide
							</Button>
						</Link>
						<Link href={c.links.discord} target="_blank">
							<Button
								variant={"outline"}
								className="bg-nav hover:bg-background"
							>
								Discord
							</Button>
						</Link>
						<ProfileButton />
					</div>
					<div className="flex items-center justify-end gap-x-4 md:hidden">
						<ProfileButton />
					</div>
				</div>
				<div className="flex h-12 w-full border-b border-b-border bg-nav px-5">
					{Object.entries(c.dashPaths.dash).map(([name, path]) => (
						<DashNavItem key={name} name={name} path={path} />
					))}
				</div>
				{children}
			</TRPCReactProvider>
		</>
	);
}

export const runtime = "edge";
