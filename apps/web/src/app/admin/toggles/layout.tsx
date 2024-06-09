import ToggleItem from "@/components/admin/toggles/ToggleItem";

interface ToggleLayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: ToggleLayoutProps) {
	return (
		<div className="max-w-5xl mx-auto grid grid-cols-5 gap-x-3 pt-44">
			<div className="min-h-screen">
				<ToggleItem name="Toggles" path="/admin/toggles" />
				<ToggleItem name="Landing Page" path="/admin/toggles/landing" />
				<ToggleItem name="Tickets" path="/admin/toggles/tickets" />
				<ToggleItem name="Registration & RSVP" path="/admin/toggles/registration" />
				<ToggleItem name="User Dashboard" path="/admin/toggles/dashboard" />
			</div>
			<div className="col-span-4">{children}</div>
		</div>
	);
}
