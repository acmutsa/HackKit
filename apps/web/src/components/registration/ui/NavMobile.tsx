"use client";

import clsx from "clsx";

export default function NavMobile({
	stepIndex,
	stepCount,
}: {
	stepIndex: number;
	stepCount: number;
}) {
	return (
		<div className="mb-3 flex items-center justify-between">
			<p className="text-sm text-muted-foreground">
				{stepIndex + 1}/{stepCount}
			</p>

			<div className="flex gap-1">
				{Array.from({ length: stepCount }).map((_, i) => (
					<span
						key={i}
						className={clsx(
							"h-2 w-2 rounded-full",
							i === stepIndex ? "bg-primary" : "bg-muted",
						)}
					/>
				))}
			</div>
		</div>
	);
}