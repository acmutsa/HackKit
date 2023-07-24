import Link from "next/link";
import Image from "next/image";
import c from "@/hackkit.config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "../dash/shared/ProfileButton";
import { auth } from "@clerk/nextjs";

export default async function Navbar() {
	const { userId } = await auth();
	return (
		<div className="fixed top-0 w-screen h-16 bg-nav z-50 border-b-border border-b">
			<div className="w-full h-full mx-auto max-w-7xl px-5 grid grid-cols-3">
				<Link href={"/"} className="flex items-center gap-x-2 w-min">
					<Image src={c.icon.svg} alt={c.hackathonName + " Logo"} width={32} height={32} />
					{/* <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" /> */}
					<h2 className="font-bold tracking-tight">{c.hackathonName}</h2>
				</Link>
				<div>{/* Your About Links Go Here! */}</div>
				<div className="items-center justify-end gap-x-4 md:flex hidden">
					{userId ? (
						<ProfileButton />
					) : (
						<>
							<Link href={"/sign-in"}>
								<Button variant={"outline"} className="bg-nav hover:bg-background">
									Sign In
								</Button>
							</Link>
							<Link href={"/register"}>
								<Button>Register</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export const runtime = "edge";
