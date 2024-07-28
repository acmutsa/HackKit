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
				className={`h-full whitespace-nowrap border-b-2 px-3 text-sm transition-colors duration-150 ${
					(currPath.startsWith(path) &&
						path !== "/admin" &&
						path !== "/dash") ||
					currPath === path
						? "border-b-muted text-primary dark:border-b-primary"
						: "border-b-transparent text-muted-foreground hover:border-b-muted"
				}`}
			>
				{name}
			</button>
		</Link>
	);
}
