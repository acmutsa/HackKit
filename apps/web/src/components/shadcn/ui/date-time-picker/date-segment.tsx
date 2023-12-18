"use client";

import { useRef } from "react";
import { useDateSegment } from "react-aria";
import { DateFieldState, DateSegment as IDateSegment } from "react-stately";
import { cn } from "@/lib/utils/client/cn";

interface DateSegmentProps {
	segment: IDateSegment;
	state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
	const ref = useRef(null);

	const {
		segmentProps: { ...segmentProps },
	} = useDateSegment(segment, state, ref);

	// Supressed hydration warning due to weirdness in date formatting.
	// TODO: Maybe find a better solution for this?

	return (
		<div
			suppressHydrationWarning={true}
			{...segmentProps}
			ref={ref}
			className={cn(
				"focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none",
				segment.type !== "literal" ? "px-[1px]" : "",
				segment.isPlaceholder ? "text-muted-foreground" : ""
			)}
		>
			{segment.text}
		</div>
	);
}

export { DateSegment };
