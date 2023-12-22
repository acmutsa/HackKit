import { getAllNavItems } from "@/lib/utils/server/redis";
import NavbarItem from "./NavbarItem";

export default async function NavBarLinksGrouper() {
	const nav = await getAllNavItems();
	const toRender: React.ReactNode[] = [];
	for (const item of nav.items) {
		if (item.enabled) {
			toRender.push(
				<NavbarItem key={item.name} link={item.url}>
					{item.name}
				</NavbarItem>
			);
		}
	}
	return <>{toRender}</>;
}

export const runtime = "edge";
export const revalidate = 30;
