import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { auth, currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils/client/cn";
import { getUser } from "db/functions";

const openSans = Open_Sans({
	variable: "--font-open-sans",
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
					`relative top-0 z-50 h-16 w-screen border-b border-b-border bg-nav bg-white dark:bg-black ${openSans.variable}`,
					className,
				)}
			>
				<div className="sm:px-6 lg:max-w-full lg:px-8 mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2">
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
							<h2
								className={`text-lg font-bold text-[#A7866A] dark:text-[#FEF2E6] ${openSans.variable}`}
							>
								{c.hackathonName}
							</h2>
						</Link>
						<div className="md:flex col-span-2 hidden items-center justify-start gap-x-5">
							<NavBarLinksGrouper />
						</div>
					</div>

					<div className="md:justify-center flex items-center justify-between space-x-2">
						<div className="md:flex hidden gap-x-4">
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
