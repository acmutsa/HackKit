import { RsvpConfirmation } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
	const runtime = await getRuntime();
	const authId = await runtime.getAuthId();
	const [rsvp, summary] = await Promise.all([
		runtime.hackkit.rsvp.getRsvp(authId),
		runtime.hackkit.rsvp.getSummary(),
	]);

	return (
		<main className="min-h-screen px-6 py-10">
			<RsvpConfirmation rsvp={rsvp} summary={summary} />
		</main>
	);
}
