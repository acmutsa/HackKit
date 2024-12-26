import {
	NavItemsManager,
	AddNavItemDialog,
} from "@/components/admin/toggles/NavItemsManager";
import { getAllNavItems } from "@/lib/utils/server/redis";

export default async function Page() {
	const nav = await getAllNavItems();
	return (
		<div>
			<div className="flex items-center justify-start">
				<h2 className="text-3xl font-bold tracking-tight">
					Navbar Items
				</h2>
				<div className="ml-auto">
					<AddNavItemDialog />
				</div>
			</div>
			<NavItemsManager
				navItems={nav.items.sort((a, b) =>
					a.name.localeCompare(b.name),
				)}
			/>
		</div>
	);
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
