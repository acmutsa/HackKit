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
import { Manuale, Shadows_Into_Light } from "next/font/google";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});
const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});


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
		<div className="z-50 flex w-screen justify-center pt-2">
			<div
				className={cn(
					`relative top-0 z-50 h-16 w-[92%] sm:w-[95%] max-w-7xl overflow-visible bg-nav ${shadow.className}`,
					className,
				)}
				style={{
					backgroundImage: "url('/img/assets/menu-bar.svg')",
					backgroundPosition: "center",


				}}
			>
				<div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-6 lg:max-w-full lg:px-8">
					<div className="col-span-2 flex items-center justify-start gap-x-5">
						<Link
							href={"/"}
							className="mr-5 flex items-center gap-x-2"
						>
							{/* TODO: add rh logo */}
							<img
								src={"/img/assets/pin1.png"}
								alt={c.hackathonName + " Logo"}
								className="absolute -top-2 left-2 z-10 w-8 h-12 pointer-events-none sm:-top-3 sm:left-4 sm:w-10 sm:h-14 md:-top-4 md:w-14 md:h-20 lg:-top-2 lg:w-16 lg:h-24 lg:left-[1%]"
							/>

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
											variant={"link"}
											className="bg-nav text-sm sm:text-sm md:text-md lg:text-xl"
										>
											Sign In
										</Button>
									</Link>
									<Link href={"/register"}>
										<Button variant={"link"}
											className="text-sm sm:text-sm md:text-md lg:text-xl">Register</Button>
									</Link>
								</>
							)}
						</div>
						<ProfileButton />
						<img
							src={"/img/assets/pin1.png"}
							alt={"right side pin"}
							className="absolute pl-[1cqw] -top-2 right-2 z-10 w-8 h-12 pointer-events-none sm:-top-3 sm:right-4 sm:w-10 sm:h-14 md:-top-4 md:w-14 md:h-20 lg:-top-2 lg:w-16 lg:h-24 lg:right-[0%]"
						/>
					</div>
				</div>
			</div>
		</div >
	);
}
