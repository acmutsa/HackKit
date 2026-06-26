import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/shadcn/ui/dropdown-menu";
import Link from "next/link";
import { navBarLinks } from "./NavBarLinksGrouper";
export default async function MobileNavBarLinks() {
	const navLinks = navBarLinks;

	return (
		<div className="cursor-pointer md:hidden">
			{navLinks.map((item) => {
				return (
					<div key={item.name}>
						<Link href={item.url}>
							<DropdownMenuItem>{item.name}</DropdownMenuItem>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export const revalidate = 30;
