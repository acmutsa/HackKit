"use client";

import type { User } from "@hackkit/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import * as React from "react";
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

export function CheckInScanner({ className, onDone }: CheckInScannerProps) {
	const { actions, navigation } = useHackKitUI();
	const [loading, setLoading] = React.useState(false);
	const [rawQr, setRawQr] = React.useState<string | null>(null);
	const [targetUser, setTargetUser] = React.useState<User | null>(null);

	async function handleScan(rawValue: string) {
		if (rawQr) return;

		setLoading(true);
		const result = await actions.previewEventPassQr({ rawQr: rawValue });
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		setRawQr(rawValue);
		setTargetUser(result.data.user);
	}

	async function handleCheckIn() {
		if (!rawQr) return;

		setLoading(true);
		const result = await actions.checkInUser({ rawQr });
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("Participant checked in.");
		setRawQr(null);
		setTargetUser(null);
		onDone?.();
		navigation.refresh();
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
		setRawQr(null);
		setTargetUser(null);
		onDone?.();
		navigation.refresh();
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
								if (rawQr || results.length === 0) return;
								void handleScan(results[0]!.rawValue);
							}}
						/>
					</div>
				</CardContent>
			</Card>

			{targetUser ? (
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
										setRawQr(null);
										setTargetUser(null);
										onDone?.();
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
