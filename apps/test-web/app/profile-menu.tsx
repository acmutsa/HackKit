"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ProfileMenu({
	name,
	email,
	image,
	isAdmin = false,
}: {
	name: string;
	email: string;
	image?: string | null;
	isAdmin?: boolean;
}) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const initials = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("") || "U";

	async function signOut() {
		setIsSigningOut(true);
		await authClient.signOut();
		router.push("/sign-in");
		router.refresh();
	}

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((value) => !value)}
				className="flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 text-sm font-medium shadow-sm transition hover:bg-muted"
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				{image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={image} alt="" className="h-8 w-8 rounded-full object-cover" />
				) : (
					<span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
						{initials}
					</span>
				)}
				<span className="hidden max-w-32 truncate sm:inline">{name}</span>
			</button>

			{isOpen ? (
				<div
					role="menu"
					className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border bg-background shadow-lg"
				>
					<div className="border-b px-4 py-3">
						<p className="truncate text-sm font-medium">{name}</p>
						<p className="truncate text-xs text-muted-foreground">{email}</p>
					</div>
					<div className="p-1">
						<Link
							href="/settings"
							role="menuitem"
							onClick={() => setIsOpen(false)}
							className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
						>
							Settings
						</Link>
						<Link
							href="/settings/registration"
							role="menuitem"
							onClick={() => setIsOpen(false)}
							className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
						>
							Registration
						</Link>
						{isAdmin ? (
							<Link
								href="/admin"
								role="menuitem"
								onClick={() => setIsOpen(false)}
								className="block rounded-md px-3 py-2 text-sm text-accent-foreground hover:bg-muted"
							>
								Admin
							</Link>
						) : null}
						<button
							type="button"
							role="menuitem"
							onClick={signOut}
							disabled={isSigningOut}
							className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted disabled:opacity-60"
						>
							{isSigningOut ? "Signing out..." : "Log out"}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
