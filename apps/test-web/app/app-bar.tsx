import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { ProfileMenu } from "./profile-menu";

export async function AppBar() {
	const session = await getAuthSession();

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
				<Link href="/" className="text-sm font-semibold tracking-tight">
					HackKit Test
				</Link>
				{session ? (
					<ProfileMenu
						name={session.user.name}
						email={session.user.email}
						image={session.user.image}
					/>
				) : (
					<div className="flex items-center gap-3 text-sm">
						<Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
							Sign in
						</Link>
						<Link
							href="/sign-up"
							className="rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground"
						>
							Sign up
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
