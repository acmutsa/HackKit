import Link from "next/link";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/nextjs";

interface NavItem {
	name: string;
	path: string;
}

interface BaseNavProps {}

interface nonDashboardNavProps extends BaseNavProps {
	isDashboard: false;
}

interface DashboardNavProps extends BaseNavProps {
	isDashboard: true;
}

export default function Navbar() {
	return (
		<nav className="fixed top-0 grid h-[68px] w-screen grid-cols-5">
			<div></div>
			<div className="col-span-3 flex items-center justify-center gap-2">
				{}
			</div>
			<div>
				{" "}
				<SignedOut>
					{/* Signed out users get sign in button */}
					<SignInButton />
				</SignedOut>
			</div>
		</nav>
	);
}

function NavItem({ name, path }: NavItem) {
	return (
		<Link href={path}>
			<a className="hover:underline">{name}</a>
		</Link>
	);
}
