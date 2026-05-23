"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import type { User } from "@hackkit/core";
import { cn } from "../lib/cn";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export type EventPassProps = {
	user: User;
	qrPayload: string;
	onRefreshQr: () => void;
	className?: string;
};

export function EventPass({
	user,
	qrPayload,
	onRefreshQr,
	className,
}: EventPassProps) {
	return (
		<Card className={cn("mx-auto w-full max-w-md", className)}>
			<CardHeader>
				<CardTitle>Event Pass</CardTitle>
				<CardDescription>
					Show this code to volunteers at events and check-in.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-1 text-center">
					<p className="text-lg font-semibold">
						{user.firstName} {user.lastName}
					</p>
					<p className="text-sm text-muted-foreground">{user.email}</p>
					{user.checkedInAt ? (
						<p className="text-sm font-medium text-emerald-600">
							Checked in
						</p>
					) : (
						<p className="text-sm text-muted-foreground">
							Not checked in
						</p>
					)}
				</div>
				<div className="flex justify-center rounded-lg border bg-white p-4">
					<QRCodeSVG value={qrPayload} size={220} />
				</div>
				<Button type="button" className="w-full" onClick={onRefreshQr}>
					Refresh QR code
				</Button>
			</CardContent>
		</Card>
	);
}
