"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../lib/cn";
export const Textarea = React.forwardRef(({ className, ...props }, ref) =>
	_jsx("textarea", {
		className: cn(
			"flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
			className,
		),
		ref: ref,
		...props,
	}),
);
Textarea.displayName = "Textarea";
//# sourceMappingURL=textarea.js.map
