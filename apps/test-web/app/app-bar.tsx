import Link from "next/link";
import { CorePermission } from "@hackkit/core";
import { getAuthSession } from "@/lib/auth";
import { getCurrentUser, getRuntime } from "@/lib/runtime";
import { publicSiteConfig } from "@/lib/public-site-config";
import { ProfileMenu } from "./profile-menu";

async function getIsAdmin(authId: string) {
	const runtime = await getRuntime();
	return runtime.hackkit.accessControl.hasPermission(
		authId,
		CorePermission.Admin,
	);
}

export async function AppBar() {
	const session = await getAuthSession();
	const currentUser = session ? await getCurrentUser() : null;
	const isAdmin = currentUser ? await getIsAdmin(currentUser.authId) : false;

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
				<Link href="/" className="text-sm font-semibold tracking-tight">
					{publicSiteConfig.brand.shortName}
				</Link>
				{session ? (
					<nav className="flex flex-wrap items-center justify-end gap-4 text-sm">
						{[
							...publicSiteConfig.nav.public,
							...publicSiteConfig.nav.participant,
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-muted-foreground hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
						<ProfileMenu
							name={session.user.name}
							email={session.user.email}
							image={currentUser?.profilePhotoUrl ?? session.user.image}
							isAdmin={isAdmin}
						/>
					</nav>
				) : (
					<div className="flex flex-wrap items-center justify-end gap-3 text-sm">
						{publicSiteConfig.nav.public.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-muted-foreground hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
						<Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
							Sign in
						</Link>
						<Link
							href={publicSiteConfig.landing.primaryAction.href}
							className="rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground"
						>
							{publicSiteConfig.landing.primaryAction.label}
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
