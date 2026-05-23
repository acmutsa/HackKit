"use client";

import * as React from "react";
import { parseEventPassQrPayload } from "@hackkit/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import type { EventScannerProps } from "../types";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function EventScanner({
	event,
	targetUser,
	priorScans,
	qrIssuedAt,
	className,
	onDone,
}: EventScannerProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { actions } = useHackKitUI();
	const [loading, setLoading] = React.useState(false);
	const showDrawer = targetUser !== null;

	async function handleConfirmScan() {
		if (!targetUser || !qrIssuedAt) return;

		setLoading(true);
		const result = await actions.recordEventScan({
			eventId: event.id,
			targetAuthId: targetUser.authId,
			qrIssuedAt,
		});
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		if (result.data?.hadPriorScans) {
			toast.success("Additional scan recorded.");
		} else {
			toast.success("Scan recorded.");
		}

		onDone?.();
		router.refresh();
	}

	return (
		<div className={cn("mx-auto flex w-full max-w-lg flex-col gap-6", className)}>
			<Card>
				<CardHeader>
					<CardTitle>{event.title}</CardTitle>
					<CardDescription>
						Scan a participant&apos;s Event Pass QR code.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="aspect-square w-full overflow-hidden rounded-lg border">
						<Scanner
							onScan={(results) => {
								if (showDrawer || results.length === 0) return;
								try {
									const parsed = parseEventPassQrPayload(
										results[0]!.rawValue,
									);
									const params = new URLSearchParams({
										user: parsed.authId,
										qrIssuedAt: String(parsed.qrIssuedAt.getTime()),
									});
									router.replace(`?${params.toString()}`);
								} catch (error) {
									toast.error(
										error instanceof Error
											? error.message
											: "Invalid QR code.",
									);
								}
							}}
						/>
					</div>
				</CardContent>
			</Card>

			{showDrawer ? (
				<Card>
					<CardHeader>
						<CardTitle>
							{targetUser.firstName} {targetUser.lastName}
						</CardTitle>
						<CardDescription>{targetUser.email}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm">
							{targetUser.checkedInAt
								? "Checked in to the hackathon."
								: "Not checked in yet."}
						</p>
						{priorScans.length > 0 ? (
							<div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
								<p className="font-medium">
									Already scanned {priorScans.length}{" "}
									{priorScans.length === 1 ? "time" : "times"} for
									this event.
								</p>
								<p className="mt-1">
									You can still record another scan if needed.
								</p>
							</div>
						) : null}
						<div className="flex gap-2">
							<Button
								type="button"
								onClick={handleConfirmScan}
								disabled={loading}
							>
								{loading ? "Saving..." : "Confirm scan"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									onDone?.();
									router.replace(pathname);
								}}
							>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}
