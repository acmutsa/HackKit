"use client";

import {
	createEventPassQrPayload,
	DEFAULT_EVENT_PASS_QR_TTL_MS,
} from "@hackkit/ui";
import type { User } from "@hackkit/core";
import { EventPass } from "@hackkit/ui";
import * as React from "react";

export function EventPassShell({ user }: { user: User }) {
	const [issuedAt, setIssuedAt] = React.useState(() => new Date());
	const qrPayload = React.useMemo(
		() => createEventPassQrPayload(user.authId, issuedAt),
		[user.authId, issuedAt],
	);

	React.useEffect(() => {
		const expiresAt = issuedAt.getTime() + DEFAULT_EVENT_PASS_QR_TTL_MS;
		const msUntilExpiry = expiresAt - Date.now();
		const refresh = () => setIssuedAt(new Date());

		if (msUntilExpiry <= 0) {
			refresh();
			return;
		}

		const timeoutId = window.setTimeout(refresh, msUntilExpiry);
		return () => window.clearTimeout(timeoutId);
	}, [issuedAt]);

	return (
		<EventPass
			user={user}
			qrPayload={qrPayload}
			onRefreshQr={() => setIssuedAt(new Date())}
		/>
	);
}
