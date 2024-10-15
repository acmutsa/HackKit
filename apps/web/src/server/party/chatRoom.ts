import type * as Party from "partykit/server";
import { clerkClient } from "@clerk/nextjs/server";
import type { onConnectResponse } from "./types";
import superjson from "superjson";
import { db } from "db";
import { getUser } from "db/functions";

export default class ChatServer implements Party.Server {
	messages?: string[];
	constructor(public party: Party.Room) {}

	static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
		try {
			const token = new URL(request.url).searchParams.get("token") ?? "";
			const session = await clerkClient.authenticateRequest({
				request: request as any,
			});

			const userID = session.toAuth()?.userId;

			if (!userID || typeof userID != "string" || userID.length == 0) {
				throw new Error("Could not validate session");
			}

			request.headers.set("X-User-ID", userID);

			return request;
		} catch (e) {
			return new Response("Unauthorized", { status: 401 });
		}
	}

	async onConnect(
		connection: Party.Connection,
		{ request }: Party.ConnectionContext,
	) {
		const userId = request.headers.get("X-User-ID");

		if (!userId) {
			connection.send(
				superjson.stringify({
					type: "connected",
					success: false,
				}),
			);

			return connection.close();
		}

		const user = getUser(userId);

		connection.send(
			superjson.stringify({
				type: "connected",
				success: true,
			}),
		);
	}
}
