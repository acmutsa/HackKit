import TicketList from "@/components/dash/tickets/TicketList";

export default function TicketsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto grid h-[calc(100vh-7rem)] w-screen grid-cols-5 gap-x-3">
			<TicketList />
			<div className="col-span-4 h-full">{children}</div>
		</div>
	);
}
