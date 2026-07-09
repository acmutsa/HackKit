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

				className={`text-sm hover:underline sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl  ${
					(currPath.startsWith(path) &&
						path !== "/admin" &&
						path !== "/dash") 
				}`}
			>
				{name}
			</button>
		</Link>
	);
}
