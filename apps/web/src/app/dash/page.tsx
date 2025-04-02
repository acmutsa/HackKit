import { auth } from "@clerk/nextjs/server";
import c from "config";
import { createQRpayload } from "@/lib/utils/shared/qr";

// HackKit Bubbles

import { Countdown } from "@/components/dash/overview/ClientBubbles";
import {
	Questions,
	TitleBubble,
	QuickQR,
} from "@/components/dash/overview/ServerBubbles";
import { getUser } from "db/functions";

export default async function Page() {
	const { userId } = await auth();
	if (!userId) return null;
	const user = await getUser(userId);
	if (!user) return null;

	const qrPayload = createQRpayload({
		userID: userId,
		createdAt: new Date(),
	});

	return (
		<div className="mx-auto min-h-[calc(100%-7rem)] max-w-7xl py-10">
			<div className="w-full px-2">
				<h2 className="text-xl font-bold">Welcome,</h2>
				<h1 className="text-5xl font-black text-hackathon">
					{user.firstName}
				</h1>
			</div>
			<div className="rows-[] grid w-full grid-cols-1 gap-2 px-2 pt-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
				<QuickQR qrPayload={qrPayload} />
				<TitleBubble />
				<Countdown
					title={`${c.hackathonName} ${c.itteration}`}
					date={c.startDate}
				/>
				<Questions />
			</div>
		</div>
	);
}

export const runtime = "edge";
