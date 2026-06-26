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
import MobileNavbarMenu from "./MobileNavbarMenu";

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
		<div className="z-50 flex w-full px-2 pt-2 sm:px-4 lg:px-6">
			<div
				className={cn(
					`relative top-0 z-50 h-16 w-full overflow-visible md:h-20 lg:h-24 xl:h-28 ${shadow.className} drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]`,
					className,
				)}
				style={{
					backgroundImage: "url('/img/assets/menu/menu.webp')",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% 100%",
				}}
			>
				<div className="flex h-full w-full items-center px-2 sm:px-6 lg:px-8">
					<div className="flex h-full shrink-0 items-center">
						<img
							src={"/img/assets/menu/pin1.webp"}
							alt={c.hackathonName + " Logo"}
							className="pointer-events-none h-12 w-auto sm:h-14 md:h-20 lg:h-24 xl:h-28"
						/>
					</div>

					<div className="flex min-w-0 flex-1 items-center justify-start gap-x-5">
						<Link
							href={"/"}
							className="mr-5 flex items-center gap-x-2"
						>
							{/* TODO: add rh logo */}
						</Link>

						<div className="hidden items-center justify-start gap-x-5 md:flex lg:gap-x-7 xl:gap-x-9">
							<NavBarLinksGrouper />
						</div>
					</div>

					<div className="flex shrink-0 items-center justify-end space-x-2">
						<MobileNavbarMenu isLoggedIn={Boolean(user)} />
						<div className="hidden items-center gap-x-4 md:flex lg:gap-x-6">
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
											variant={"link"}
											className="bg-transparent md:text-lg lg:h-12 lg:px-6 lg:text-2xl xl:h-14 xl:text-[1.75rem]"
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
											className="bg-transparent md:text-lg lg:h-12 lg:px-5 lg:text-2xl xl:h-14 xl:text-[1.75rem]"
										>
											Sign In
										</Button>
									</Link>
									<Link href={"/register"}>
										<Button
											variant={"link"}
											className="text-sm sm:text-sm md:text-lg lg:h-12 lg:px-5 lg:text-2xl xl:h-14 xl:text-[1.75rem]"
										>
											Register
										</Button>
									</Link>
								</>
							)}
						</div>
						{user && <ProfileButton />}
						<div className="flex h-full shrink-0 items-center">
							<img
								src={"/img/assets/menu/pin1.webp"}
								alt="right side pin"
								className="pointer-events-none h-12 w-auto sm:h-14 md:h-20 lg:h-24 xl:h-28"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
