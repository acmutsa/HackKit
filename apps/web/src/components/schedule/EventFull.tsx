import { events } from "@/db/schema";
import { InferModel } from "drizzle-orm";
import c from "@/hackkit.config";
import { Badge } from "@/components/shadcn/ui/badge";
import { format } from "date-fns";
import Balancer from "react-wrap-balancer";

export default function EventFull({ event }: { event: InferModel<typeof events> }) {
	return (
		<div className="w-screen relative">
			<div
				className="w-screen absolute top-0 h-[45vh] max-h-[400px] dark:opacity-50 opacity-10"
				style={{
					backgroundImage: `linear-gradient(180deg, ${
						(c.eventTypes as Record<string, string>)[event.type] || c.eventTypes.Other
					}, transparent)`,
				}}
			/>
			<div className="max-w-3xl mx-auto min-h-[calc(100vh-7rem)] pt-[15vh] w-full relative z-10 p-2">
				<div className="flex items-center gap-x-2 mb-2">
					<Badge
						className="text-md"
						variant={"outline"}
						style={{
							borderColor:
								(c.eventTypes as Record<string, string>)[event.type] || c.eventTypes.Other,
						}}
					>
						{event.type}
					</Badge>
					<p className="font-bold md:text-sm text-xs">{`${format(
						event.startTime,
						"EEEE MMMM do"
					)}, ${format(event.startTime, "h:mm a")} - ${format(event.endTime, "h:mm a")}`}</p>
				</div>

				<h1 className="font-black text-7xl mb-2">
					<Balancer>{event.title}</Balancer>
				</h1>
				<h2 className="font-bold text-lg mb-20">Hosted by {event.host}</h2>
				<h3 className="font-bold mb-2">Description:</h3>
				<p>
					<Balancer>{event.description}</Balancer>
				</p>
			</div>
		</div>
	);
}
