import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { auth, currentUser } from "@clerk/nextjs/server";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils/client/cn";
import { getUser } from "db/functions";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

interface NavbarProps {
	className?: string;
}

export default async function Navbar({ className }: NavbarProps) {
	const user = await currentUser();
	const registrationIsComplete =
		user != null && (await getUser(user.id)) != undefined;
	return (
		<div className="z-50 w-screen">
			<div
				className={cn(
					`relative top-0 z-50 h-16 w-screen border-b border-b-border bg-nav ${oswald.variable}`,
					className,
				)}
			>
				<div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-6 lg:max-w-full lg:px-8">
					<div className="col-span-2 flex items-center justify-start gap-x-5">
						<Link
							href={"/"}
							className="mr-5 flex items-center gap-x-2"
						>
							<Image
								src={c.icon.svg}
								alt={c.hackathonName + " Logo"}
								width={32}
								height={32}
							/>
							{/* <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" /> */}
							<h2 className="font-oswald text-lg font-bold text-[#A7866A] dark:text-[#FEF2E6]">
								{c.hackathonName}
							</h2>
						</Link>
						<div className="col-span-2 hidden items-center justify-start gap-x-5 md:flex">
							<NavBarLinksGrouper />
						</div>
					</div>

					<div className="flex items-center justify-between space-x-2 md:justify-center">
						<div className="hidden gap-x-4 md:flex">
							{user ? (
								<>
									<Link
										href={
											registrationIsComplete
												? "/dash"
												: "/register"
										}
									>
										<Button
											variant={"outline"}
											className="bg-nav hover:bg-background"
										>
											{registrationIsComplete
												? "Dashboard"
												: "Complete Registration"}
										</Button>
									</Link>
								</>
							) : (
								<>
									<Link href={"/sign-in"}>
										<Button
											variant={"outline"}
											className="bg-nav hover:bg-background"
										>
											Sign In
										</Button>
									</Link>
									<Link href={"/register"}>
										<Button>Register</Button>
									</Link>
								</>
							)}
						</div>
						<ProfileButton />
					</div>
				</div>
			</div>
		</div>
	);
}

export const runtime = "edge";
