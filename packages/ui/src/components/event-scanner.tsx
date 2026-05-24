"use client";

import type { EventScan, User } from "@hackkit/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import * as React from "react";
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

export function EventScanner({ event, className, onDone }: EventScannerProps) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [loading, setLoading] = React.useState(false);
	const [rawQr, setRawQr] = React.useState<string | null>(null);
	const [targetUser, setTargetUser] = React.useState<User | null>(null);
	const [priorScans, setPriorScans] = React.useState<EventScan[]>([]);

	async function handleScan(rawValue: string) {
		if (rawQr) return;

		setLoading(true);
		const result = await actions.previewEventPassQr({
			rawQr: rawValue,
			eventId: event.id,
		});
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		setRawQr(rawValue);
		setTargetUser(result.data.user);
		setPriorScans(result.data.priorScans);
	}

	async function handleConfirmScan() {
		if (!rawQr) return;

		setLoading(true);
		const result = await actions.recordEventScan({
			eventId: event.id,
			rawQr,
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

		setRawQr(null);
		setTargetUser(null);
		setPriorScans([]);
		onDone?.();
		router.refresh();
	}

	return (
		<div className={cn("mx-auto flex w-full max-w-lg flex-col gap-6", className)}>
			<Card>
				<CardHeader>
					<CardTitle>{event.title}</CardTitle>
					<CardDescription>{event.location}</CardDescription>
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
						{priorScans.length > 0 ? (
							<p className="text-sm font-medium text-amber-700">
								This participant was already scanned {priorScans.length}{" "}
								time{priorScans.length === 1 ? "" : "s"} for this event.
							</p>
						) : null}
						<div className="flex gap-2">
							<Button
								type="button"
								onClick={handleConfirmScan}
								disabled={loading}
							>
								{loading ? "Saving..." : "Record scan"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setRawQr(null);
									setTargetUser(null);
									setPriorScans([]);
									onDone?.();
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
