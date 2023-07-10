"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashNavItemProps {
	name: string;
	path: string;
}

export default function DashNavItem({ name, path }: DashNavItemProps) {
	const currPath = usePathname();
	return (
		<Link href={path}>
			<button
				className={`h-full px-3 border-b-2 text-sm ${
					(currPath.startsWith(path) && path !== "/admin") || currPath === path
						? "border-b-primary text-primary"
						: "border-b-transparent text-muted-foreground"
				}`}
			>
				{name}
			</button>
		</Link>
	);
}
