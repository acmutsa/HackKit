import { CoreSetting } from "@hackkit/core";
import { getCurrentUser, getRuntime } from "@/lib/runtime";
import { EventPassShell } from "./event-pass-shell";

export const dynamic = "force-dynamic";

export default async function PassPage() {
	const user = await getCurrentUser();
	const runtime = await getRuntime();
	const eventPassQrTtlMs = await runtime.getSettingValue(CoreSetting.EventPassQrTtlMs);

	return (
		<main className="min-h-screen px-6 py-10">
			<EventPassShell user={user} eventPassQrTtlMs={Number(eventPassQrTtlMs)} />
		</main>
	);
}
