import ToggleItem from "@/components/admin/toggles/ToggleItem";
import Restricted from "@/components/Restricted";
import { PermissionType } from "@/lib/constants/permission";
import { userHasPermission } from "@/lib/utils/server/admin";
import { getCurrentUser } from "@/lib/utils/server/user";
import { notFound } from "next/navigation";

interface ToggleLayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: ToggleLayoutProps) {
	const user = await getCurrentUser();

	if (!userHasPermission(user, PermissionType.MANAGE_NAVLINKS))
		return notFound();

	return (
		<div className="mx-auto grid max-w-5xl grid-cols-5 gap-x-3 pt-44">
			<div className="min-h-screen">
				<ToggleItem name="Toggles" path="/admin/toggles" />
				<ToggleItem name="Landing Page" path="/admin/toggles/landing" />

				<Restricted
					permissions={[PermissionType.MANAGE_REGISTRATION]}
					user={user}
				>
					<ToggleItem
						name="Registration & RSVP"
						path="/admin/toggles/registration"
					/>
				</Restricted>
			</div>
			<div className="col-span-4">{children}</div>
		</div>
	);
}
