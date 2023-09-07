"use client";
import { Toaster } from "sonner";

interface clientToastOptions {
	richColors?: boolean;
}

export default function ClientToast({ richColors = true }: clientToastOptions) {
	return <Toaster richColors={richColors} />;
}
