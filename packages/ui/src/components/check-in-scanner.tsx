"use client";

import * as React from "react";
import { parseEventPassQrPayload } from "@hackkit/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import type { CheckInScannerProps } from "../types";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function CheckInScanner({
	targetUser,
	qrIssuedAt,
	className,
	onDone,
}: CheckInScannerProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { actions } = useHackKitUI();
	const [loading, setLoading] = React.useState(false);
	const showDrawer = targetUser !== null;

	async function handleCheckIn() {
		if (!targetUser || !qrIssuedAt) return;

		setLoading(true);
		const result = await actions.checkInUser({
			targetAuthId: targetUser.authId,
			qrIssuedAt,
		});
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("Participant checked in.");
		onDone?.();
		router.refresh();
	}

	async function handleClearCheckIn() {
		if (!targetUser) return;

		setLoading(true);
		const result = await actions.clearCheckIn(targetUser.authId);
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("Check-in cleared.");
		onDone?.();
		router.refresh();
	}

	return (
		<div className={cn("mx-auto flex w-full max-w-lg flex-col gap-6", className)}>
			<Card>
				<CardHeader>
					<CardTitle>Hackathon Check-in</CardTitle>
					<CardDescription>
						Scan a participant&apos;s Event Pass QR code once at arrival.
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
						{targetUser.checkedInAt ? (
							<div className="space-y-3">
								<p className="text-sm font-medium text-emerald-700">
									Already checked in.
								</p>
								<Button
									type="button"
									variant="outline"
									onClick={handleClearCheckIn}
									disabled={loading}
								>
									Clear check-in
								</Button>
							</div>
						) : (
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={handleCheckIn}
									disabled={loading}
								>
									{loading ? "Saving..." : "Check in"}
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
						)}
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}
