import c from "@/hackkit.config";
import Image from "next/image";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { redirect } from "next/navigation";

interface DashLayoutProps {
	children: React.ReactNode;
}

export default async function AdminLayout({ children }: DashLayoutProps) {
	const user = await currentUser();

	if (!user || !user.publicMetadata.registrationComplete) {
		return redirect("/register");
	}

	return (
		<div className="max-w-screen">
			<div className="w-full h-16 px-5 grid grid-cols-2 bg-nav">
				<div className="flex items-center gap-x-4">
					<Image src={c.icon.svg} alt={c.hackathonName + " Logo"} width={32} height={32} />
					<div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" />
					<h2 className="font-bold tracking-tight">Dashboard</h2>
				</div>
				<div className="flex items-center justify-end gap-x-4">
					<Link href={"/"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Home
						</Button>
					</Link>
					<Link href={"/guide"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Survival Guide
						</Button>
					</Link>
					<Link href={"/guide"}>
						<Button variant={"outline"} className="bg-nav hover:bg-background">
							Discord
						</Button>
					</Link>
				</div>
			</div>
			<div className="w-full h-12 px-5 flex bg-nav border-b-border border-b">
				{Object.entries(c.dashPaths.dash).map(([name, path]) => (
					<DashNavItem key={name} name={name} path={path} />
				))}
			</div>
			{children}
		</div>
	);
}

export const runtime = "edge";
