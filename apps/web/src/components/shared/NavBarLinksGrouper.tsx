import NavbarItem from "./NavbarItem";

export const navBarLinks = [
	{ name: "Home", url: "/" },
	{ name: "About", url: "/#about" },
	{ name: "Schedule", url: "/schedule" },
	{ name: "Location", url: "/#location" },
	{ name: "Sponsors", url: "/#sponsors" },
	{ name: "FAQ", url: "/#faq" },
];

export default async function NavBarLinksGrouper() {
	return navBarLinks.map((item) => (
		<NavbarItem key={item.name} link={item.url}>
			{item.name}
		</NavbarItem>
	));
}
