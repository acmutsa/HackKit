"use client";

import * as React from "react";
import { createEventPassQrPayload, type User } from "@hackkit/core";
import { EventPass } from "@hackkit/ui";

export function EventPassShell({ user }: { user: User }) {
	const [issuedAt, setIssuedAt] = React.useState(() => new Date());
	const qrPayload = React.useMemo(
		() => createEventPassQrPayload(user.authId, issuedAt),
		[user.authId, issuedAt],
	);

	return (
		<EventPass
			user={user}
			qrPayload={qrPayload}
			onRefreshQr={() => setIssuedAt(new Date())}
		/>
	);
}
