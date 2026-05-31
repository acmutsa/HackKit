"use client";

import { createEventPassQrPayload } from "@hackkit/ui";
import type { User } from "@hackkit/core";
import { EventPass } from "@hackkit/ui";
import * as React from "react";

export function EventPassShell({ user, eventPassQrTtlMs }: { user: User; eventPassQrTtlMs: number }) {
	const [issuedAt, setIssuedAt] = React.useState(() => new Date());
	const qrPayload = React.useMemo(
		() => createEventPassQrPayload(user.authId, issuedAt),
		[user.authId, issuedAt],
	);

	React.useEffect(() => {
		const expiresAt = issuedAt.getTime() + eventPassQrTtlMs;
		const msUntilExpiry = expiresAt - Date.now();
		const refresh = () => setIssuedAt(new Date());

		if (msUntilExpiry <= 0) {
			refresh();
			return;
		}

		const timeoutId = window.setTimeout(refresh, msUntilExpiry);
		return () => window.clearTimeout(timeoutId);
	}, [issuedAt, eventPassQrTtlMs]);

	return (
		<EventPass
			user={user}
			qrPayload={qrPayload}
			onRefreshQr={() => setIssuedAt(new Date())}
		/>
	);
}
