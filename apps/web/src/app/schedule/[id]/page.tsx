import { db } from "db";
import { eq } from "db/drizzle";
import { events } from "db/schema";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import EventFull from "@/components/schedule/EventFull";
import Navbar from "@/components/shared/Navbar";

export default async function Page({ params }: { params: { id: string } }) {
	if (!params || !params.id || isNaN(parseInt(params.id))) {
		return (
			<FullScreenMessage
				title={"Invalid ID"}
				message={"The Event ID in the URL is invalid."}
			/>
		);
	}

	const event = await db.query.events.findFirst({
		where: eq(events.id, parseInt(params.id)),
	});

	if (!event) {
		return (
			<FullScreenMessage
				title={"Invalid ID"}
				message={
					"The Event ID in the URL is invalid or does not exist."
				}
			/>
		);
	}

	return (
		<>
			<Navbar />
			<EventFull event={event} />
		</>
	);
}

export const runtime = "edge";
