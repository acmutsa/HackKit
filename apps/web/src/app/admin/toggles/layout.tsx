import ToggleItem from "@/components/admin/toggles/ToggleItem";

interface ToggleLayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: ToggleLayoutProps) {
	return (
		<div className="mx-auto grid max-w-5xl grid-cols-5 gap-x-3 pt-44">
			<div className="min-h-screen">
				<ToggleItem name="Toggles" path="/admin/toggles" />
				<ToggleItem name="Landing Page" path="/admin/toggles/landing" />

				<ToggleItem
					name="Registration & RSVP"
					path="/admin/toggles/registration"
				/>
			</div>
			<div className="col-span-4">{children}</div>
		</div>
	);
}
