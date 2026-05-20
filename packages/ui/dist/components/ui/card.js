"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/cn";
export function Card({ className, ...props }) {
	return _jsx("div", {
		className: cn(
			"rounded-lg border bg-card text-card-foreground shadow-sm",
			className,
		),
		...props,
	});
}
export function CardHeader({ className, ...props }) {
	return _jsx("div", {
		className: cn("flex flex-col space-y-1.5 p-6", className),
		...props,
	});
}
export function CardTitle({ className, ...props }) {
	return _jsx("h3", {
		className: cn(
			"text-2xl font-semibold leading-none tracking-tight",
			className,
		),
		...props,
	});
}
export function CardDescription({ className, ...props }) {
	return _jsx("p", {
		className: cn("text-sm text-muted-foreground", className),
		...props,
	});
}
export function CardContent({ className, ...props }) {
	return _jsx("div", { className: cn("p-6 pt-0", className), ...props });
}
export function CardFooter({ className, ...props }) {
	return _jsx("div", {
		className: cn("flex items-center p-6 pt-0", className),
		...props,
	});
}
//# sourceMappingURL=card.js.map
