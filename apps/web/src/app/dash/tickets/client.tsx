"use client";

import TicketList from "./ticket-list";
import Chat from "./ticket-room";
import usePartySocket from "partysocket/react";
import { env } from "@/env";

export default function View() {
	const partySocket = usePartySocket({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: "room-id",
		// attach the token to PartyKit in the query string
		query: async () => ({
			// get an auth token using your authentication client library
			token: await getToken(),
		}),
	});

	return (
		<main className="grid grid-cols-3">
			<TicketList />
			<Chat />
		</main>
	);
}
