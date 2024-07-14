import TicketList from "@/components/dash/tickets/TicketList";

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-screen mx-auto grid grid-cols-5 gap-x-3 h-[calc(100vh-7rem)]">
			<TicketList />
			<div className="col-span-4 h-full">{children}</div>
		</div>
	);
}
