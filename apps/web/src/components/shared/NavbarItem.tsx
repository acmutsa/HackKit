import Link from "next/link";

interface NavbarItemProps {
	link: string;
	children: React.ReactNode;
}

export default function NavbarItem({ children, link }: NavbarItemProps) {
	return (
		<Link
			href={link}
			className="text-sm hover:text-primary hover:underline sm:text-sm md:text-lg lg:text-2xl xl:text-[1.75rem] 2xl:text-3xl"
		>
			{children}
		</Link>
	);
}
