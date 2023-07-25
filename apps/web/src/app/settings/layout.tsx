import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ({ children }: { children: ReactNode }) {
	const { userId } = await auth();

	if (!userId) return redirect("/sign-in");

	return (
		<div className="w-screen h-screen bg-nav flex flex-col items-center justify-center">
			<div className="bg-card max-w-5xl w-full min-h-[70vh] grid grid-cols-3 rounded-xl">
				<div></div>
				<div className="col-span-2">{children}</div>
			</div>
		</div>
	);
}
