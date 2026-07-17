import NavbarItem from "./NavbarItem";

export const navBarLinks = [
	{ name: "Home", url: "/" },
	{ name: "About", url: "/#About" },
	{ name: "Schedule", url: "/schedule" },
	{ name: "Location", url: "/#Map" },
	{ name: "Sponsors", url: "/#Sponsors" },
	{ name: "FAQ", url: "/#FAQ" },
];

export default async function NavBarLinksGrouper() {
	return navBarLinks.map((item) => (
		<NavbarItem key={item.name} link={item.url}>
			{item.name}
		</NavbarItem>
	));
}
