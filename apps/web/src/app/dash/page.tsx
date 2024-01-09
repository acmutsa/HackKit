// import { SignOutButton } from "@clerk/nextjs";
// import { Button } from "@/components/shadcn/ui/button";
// import { Suspense } from "react";
// import Loading from "@/components/shared/Loading";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import c from "@/hackkit.config";
import superjson from "superjson";
import { createQRpayload } from "@/lib/utils/shared/qr";

// HackKit Bubbles

import { Countdown } from "@/components/dash/overview/ClientBubbles";
import { Questions, TitleBubble, QuickQR } from "@/components/dash/overview/ServerBubbles";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return null;
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});
	if (!user) return null;

	const qrPayload = createQRpayload({ userID: userId, createdAt: new Date() });

	return (
		<div className="max-w-7xl mx-auto py-10 min-h-[calc(100%-7rem)]">
			<div className="w-full px-2">
				<h2 className="font-bold text-xl">Welcome,</h2>
				<h1 className="font-black text-5xl text-hackathon">{user.firstName}</h1>
			</div>
			<div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-2 grid-cols-1 w-full pt-10 gap-2 rows-[] px-2">
				<QuickQR qrPayload={qrPayload} />
				<TitleBubble />
				<Countdown title={`${c.hackathonName} ${c.itteration}`} date={c.startDate} />
				<Questions />
			</div>
		</div>
	);
}

export const runtime = "edge";
