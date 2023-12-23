"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ToggleItemProps {
	name: string;
	path: string;
}

export default function SettingsSection({ name, path }: ToggleItemProps) {
	const currPath = usePathname();
	return (
		<Link href={path}>
			<div
				className={`rounded py-3 px-2 hover:bg-accent hover:text-accent-foreground w-full transition-all duration-100 ${
					(currPath.startsWith(path) &&
						path !== "/settings" &&
						path !== "/dash" &&
						path !== "/admin/toggles") ||
					currPath === path
						? "text-primary"
						: "text-muted-foreground"
				}`}
			>
				<p className="text-sm">{name}</p>
			</div>
		</Link>
	);
}
