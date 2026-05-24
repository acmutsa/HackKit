"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bootstrapOwner } from "@/app/hackkit-actions";

export function BootstrapOwnerButton() {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

	async function handleClick() {
		setLoading(true);
		const result = await bootstrapOwner();
		setLoading(false);

		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("Owner role assigned.");
		router.refresh();
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={loading}
			className="rounded-md border px-4 py-2 text-sm font-medium"
		>
			{loading ? "Working..." : "Bootstrap owner role"}
		</button>
	);
}
