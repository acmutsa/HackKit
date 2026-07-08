import c from "config";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import { redirect } from "next/navigation";
import ProfileButton from "@/components/shared/ProfileButton";
import ClientToast from "@/components/shared/ClientToast";
import { getCurrentUser } from "@/lib/utils/server/user";
import { cn } from "@/lib/utils/client/cn";
import { Shadows_Into_Light } from "next/font/google";
import MobileNavbarMenu from "@/components/shared/MobileNavbarMenu";

const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});

interface DashLayoutProps {
	children: React.ReactNode;
}

export default async function DashLayout({ children }: DashLayoutProps) {
	const user = await getCurrentUser();
	if (!user) return redirect("/register");

	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		user.isApproved === false
	) {
		return redirect("/i/approval");
	}

	return (
		<>
			<ClientToast />
			<div className="min-h-screen bg-transparent text-foreground">

				<div className="z-50 flex w-full px-2 pt-2 sm:px-4 lg:px-6">
					<div
						className={cn(`relative top-0 z-50 h-16 w-full overflow-visible md:h-20 lg:h-24 xl:h-28 ${shadow.className} drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]`)}
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

							</Link>

							<div className="hidden items-center justify-start gap-x-5 md:flex lg:gap-x-7 xl:gap-x-9">
									{Object.entries(c.dashPaths.dash).map(([name, path]) => (
										<DashNavItem key={name} name={name} path={path} />
									))}
							</div>
						</div>

						<div className="flex shrink-0 items-center justify-end space-x-2">
							<MobileNavbarMenu isLoggedIn={Boolean(user)} />
							<div className="hidden items-center gap-x-4 md:flex lg:gap-x-6">
								
									<>
										<Link href={"/"}>
											<Button
												variant={"outline"}
												className="text-sm hover:text-primary hover:underline sm:text-sm md:text-lg lg:text-2xl xl:text-[1.75rem] 2xl:text-3xl"

											>
												Home
											</Button>
										</Link>
										<Link href={c.links.guide} target="_blank">
											<Button
												variant={"outline"}
												className="text-sm hover:text-primary hover:underline sm:text-sm md:text-lg lg:text-2xl xl:text-[1.75rem] 2xl:text-3xl"

											>
												Survival Guide
											</Button>
										</Link>
										<Link href={c.links.discord} target="_blank">
											<Button
												variant={"outline"}
												className="text-sm hover:text-primary hover:underline sm:text-sm md:text-lg lg:text-2xl xl:text-[1.75rem] 2xl:text-3xl"

											>
												Discord
											</Button>
										</Link>

									</>
			
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

			{children}
		</div>
		</>
	);
}
