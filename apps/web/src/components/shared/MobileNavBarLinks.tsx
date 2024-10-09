import { getAllNavItems } from "@/lib/utils/server/redis";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/shadcn/ui/dropdown-menu";
import Link from "next/link";
export default async function MobileNavBarLinks() {
	const navLinks = await getAllNavItems();

	return (
		<div className="md:hidden cursor-pointer">
			{navLinks.items.map((nav, key) => {
				return (
					<div key={nav.name}>
						{nav.enabled ? (
							<Link href={nav.url}>
								<DropdownMenuItem>{nav.name}</DropdownMenuItem>
							</Link>
						) : null}
					</div>
				);
			})}
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 30;
