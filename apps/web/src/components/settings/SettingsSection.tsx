"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ToggleItemProps {
	name: string;
	path: string;
}

export default function SettingsSection({ name, path }: ToggleItemProps) {
	const currPath = usePathname();
	// NOTE: usepathname hook does not include the fragment part such as #registration or #account so we will need to use the window to access this later 
	return (
		<Link href={path}>
			<div
				className={`w-full rounded px-2 py-3 transition-all duration-100 hover:bg-accent hover:text-accent-foreground ${
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
