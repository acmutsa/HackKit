"use client";

import Link from "next/link";
import type { HackKitLinkProps } from "../navigation";

/** Default Next.js App Router link used by the built-in navigation adapter. */
export function DefaultHackKitLink({
	href,
	className,
	children,
}: HackKitLinkProps) {
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}
