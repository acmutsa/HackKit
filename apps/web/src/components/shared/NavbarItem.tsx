import Link from "next/link";

interface NavbarItemProps {
	link: string;
	children: React.ReactNode;
}

export default function NavbarItem({ children, link }: NavbarItemProps) {
	return (
		<Link href={link} className="hover:underline text-muted-foreground hover:text-primary text-sm">
			{children}
		</Link>
	);
}
