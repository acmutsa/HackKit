import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/hackkit";
import { EventPassShell } from "./event-pass-shell";

export const dynamic = "force-dynamic";

export default async function PassPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");

	return (
		<main className="min-h-screen px-6 py-10">
			<EventPassShell user={user} />
		</main>
	);
}
