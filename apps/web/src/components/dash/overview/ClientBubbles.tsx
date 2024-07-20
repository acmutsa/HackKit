"use client";

import { useState } from "react";
import { useTimer } from "react-timer-hook";
import { Badge } from "@/components/shadcn/ui/badge";

interface CountdownProps {
	title: string;
	date: Date;
}

export function Countdown({ title, date }: CountdownProps) {
	const { seconds, minutes, hours, days } = useTimer({
		expiryTimestamp: date,
	});
	return (
		<div className="min-h-[150px] rounded-xl border border-muted p-5">
			<div className="flex justify-between">
				<div className="flex flex-col items-center">
					<h2
						className="text-3xl font-black"
						suppressHydrationWarning
					>
						{days}
					</h2>
					<h3 className="font-bold">Days</h3>
				</div>
				<div className="flex flex-col items-center">
					<h2
						className="text-3xl font-black"
						suppressHydrationWarning
					>
						{hours}
					</h2>
					<h3 className="font-bold">Hours</h3>
				</div>
				<div className="flex flex-col items-center">
					<h2
						className="text-3xl font-black"
						suppressHydrationWarning
					>
						{minutes}
					</h2>
					<h3 className="font-bold">Minutes</h3>
				</div>
				<div className="flex flex-col items-center">
					<h2
						className="text-3xl font-black"
						suppressHydrationWarning
					>
						{seconds}
					</h2>
					<h3 className="font-bold">Seconds</h3>
				</div>
			</div>
			<div className="pt-5">
				<Badge variant={"outline"} className="border-hackathon">
					Time To {title}
				</Badge>
			</div>
		</div>
	);
}
