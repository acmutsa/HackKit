"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "../../lib/cn";
export const Checkbox = React.forwardRef(({ className, ...props }, ref) =>
	_jsx(CheckboxPrimitive.Root, {
		ref: ref,
		className: cn(
			"peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
			className,
		),
		...props,
		children: _jsx(CheckboxPrimitive.Indicator, {
			className: "flex items-center justify-center text-current",
			children: _jsx("span", {
				className: "text-xs leading-none",
				children: "\u2713",
			}),
		}),
	}),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
//# sourceMappingURL=checkbox.js.map
