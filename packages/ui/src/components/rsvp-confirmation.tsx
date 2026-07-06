"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import type { RsvpConfirmationProps } from "../types";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function RsvpConfirmation({
	rsvp,
	summary,
	className,
}: RsvpConfirmationProps) {
	const { actions } = useHackKitUI();
	const [currentRsvp, setCurrentRsvp] = React.useState(rsvp);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const isConfirmed = currentRsvp?.status === "confirmed";
	const isWaitlisted = currentRsvp?.status === "waitlisted";
	const hasCapacity =
		summary.availableSpots === null || summary.availableSpots > 0;
	const canSubmit =
		summary.isOpen &&
		!isConfirmed &&
		!isWaitlisted &&
		(hasCapacity || summary.waitlistEnabled);

	async function confirmRsvp() {
		setIsSubmitting(true);
		const result = await actions.confirmRsvp();
		setIsSubmitting(false);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		setCurrentRsvp(result.data);
		toast.success(
			result.data.status === "waitlisted"
				? "You were added to the RSVP waitlist."
				: "Your RSVP is confirmed.",
		);
	}

	return (
		<Card className={cn("max-w-2xl", className)}>
			<CardHeader>
				<CardTitle>RSVP</CardTitle>
				<CardDescription>
					Confirm that you plan to attend. RSVP is separate from organiser
					approval and event check-in.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="rounded-md border p-4">
					<p className="font-medium">{statusTitle(currentRsvp, summary)}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{statusDescription(currentRsvp, summary)}
					</p>
				</div>

				<div className="grid gap-3 text-sm sm:grid-cols-3">
					<Metric label="Confirmed" value={summary.confirmedCount} />
					<Metric label="Waitlisted" value={summary.waitlistedCount} />
					<Metric
						label="Available"
						value={
							summary.availableSpots === null
								? "Unlimited"
								: summary.availableSpots
						}
					/>
				</div>

				<Button
					type="button"
					disabled={!canSubmit || isSubmitting}
					onClick={confirmRsvp}
				>
					{isSubmitting
						? "Confirming..."
						: hasCapacity
							? "Confirm RSVP"
							: "Join Waitlist"}
				</Button>
			</CardContent>
		</Card>
	);
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="rounded-md border p-3">
			<div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
				{label}
			</div>
			<div className="mt-1 text-lg font-semibold">{value}</div>
		</div>
	);
}

function statusTitle(
	rsvp: RsvpConfirmationProps["rsvp"],
	summary: RsvpConfirmationProps["summary"],
): string {
	if (rsvp?.status === "confirmed") return "You are confirmed.";
	if (rsvp?.status === "waitlisted") {
		return rsvp.waitlistPosition
			? `You are #${rsvp.waitlistPosition} on the waitlist.`
			: "You are on the waitlist.";
	}
	if (!summary.isOpen) return "RSVPs are closed.";
	if (summary.availableSpots === 0 && !summary.waitlistEnabled) {
		return "RSVP capacity has been reached.";
	}
	return "RSVPs are open.";
}

function statusDescription(
	rsvp: RsvpConfirmationProps["rsvp"],
	summary: RsvpConfirmationProps["summary"],
): string {
	if (rsvp?.status === "confirmed") {
		return "We have saved your spot. Admins can correct or cancel RSVP state if needed.";
	}
	if (rsvp?.status === "waitlisted") {
		return "An admin can promote waitlisted hackers when capacity opens.";
	}
	if (!summary.isOpen) {
		return "Check back later or contact an organiser if you think this is a mistake.";
	}
	if (summary.availableSpots === 0 && summary.waitlistEnabled) {
		return "Confirmed spots are full, but you can join the ordered waitlist.";
	}
	if (summary.availableSpots === 0) {
		return "Confirmed spots are full and the waitlist is not enabled.";
	}
	return "Use this only when you are confident you can attend.";
}
