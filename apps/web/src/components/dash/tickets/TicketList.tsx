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
		<div className="border-b border-b-muted h-16 px-5 py-4 flex flex-col justify-center">
			<h3 className="font-bold text-sm">Ticket Name</h3>
			<p className="text-xs text-muted-foreground">Last Message</p>
		</div>
	);
}
