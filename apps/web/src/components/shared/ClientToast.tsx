"use client";
import { Toaster } from "sonner";

interface clientToastOptions {
	richColors?: boolean;
	duration?: number;
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function ClientToast({
	richColors = true,
	duration,
	position,
}: clientToastOptions) {
	return (
		<Toaster
			richColors={richColors}
			duration={duration}
			position={position}
		/>
	);
}
