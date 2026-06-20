import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";
import MobileNavBarLinks from "./MobileNavBarLinks";

export default function MobileNavbarMenu({
	isLoggedIn,
}: {
	isLoggedIn: boolean;
}) {
	return (
		<div className="md:hidden">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Open navigation"
						className="bg-transparent"
					>
						<Menu className="h-6 w-6" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="bg-[rgb(247,240,232)]"
				>
					<MobileNavBarLinks />
					{!isLoggedIn && (
						<>
							<DropdownMenuSeparator />
							<Link href="/sign-in">
								<DropdownMenuItem>Sign In</DropdownMenuItem>
							</Link>
							<Link href="/register">
								<DropdownMenuItem>Register</DropdownMenuItem>
							</Link>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
