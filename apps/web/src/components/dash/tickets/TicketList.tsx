"use client";

import { title } from "process";

const dummyTickets = [
	{
		title: "Ticket 1",
		lastMessage: "howdy this is a message",
		lastMessageDate: "2023-05-01",
		lastMessageAuthor: "@user",
	},
	{
		title: "Ticket 2",
		lastMessage: "howdy this is a message 2",
		lastMessageDate: "2023-05-01",
		lastMessageAuthor: "@user",
	},
	{
		title: "Ticket 3",
		lastMessage: "howdy this is a message 3",
		lastMessageDate: "2023-05-01",
		lastMessageAuthor: "@user",
	},
];

export default function TicketList() {
	return (
		<div className="border-r border-r-muted">
			{dummyTickets.map((ticket) => (
				<TicketItem key={ticket.title} />
			))}
		</div>
	);
}

function TicketItem() {
	return (
		<div className="flex items-center justify-between gap-x-2 p-4 border-b border-b-muted">
			<div className="flex items-center gap-x-2">
				<div className="h-10 w-10 rounded-full b"></div>
				<h1 className="text-lg font-bold">Ticket Name</h1>
			</div>
			<div className="text-muted-foreground">$100</div>
		</div>
	);
}
