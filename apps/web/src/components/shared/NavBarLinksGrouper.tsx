import { getAllNavItems } from "@/lib/utils/server/redis";
import NavbarItem from "./NavbarItem";

export default async function NavBarLinksGrouper() {
	const nav = await getNavBarLinks();
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

export async function getNavBarLinks(){
	const nav = await getAllNavItems();
  	return nav;
}

export const runtime = "edge";
export const revalidate = 30;
