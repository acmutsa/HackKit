import { auth } from "@clerk/nextjs/server";
import c from "config";
import { createQRpayload } from "@/lib/utils/shared/qr";

// HackKit Bubbles

import { Countdown } from "@/components/dash/overview/ClientBubbles";
import {
	Questions,
	TitleTicket,
	QuickQR,
	QRTiteleHorizintalTicket,
	QRTiteleVerticalTicket
} from "@/components/dash/overview/ServerBubbles";
import { getCurrentUser } from "@/lib/utils/server/user";
import LandingThread from "@/components/landing/LandingThread";
import Pin from "@/components/landing/Pin";


export default async function Page() {
	const user = await getCurrentUser();

	const qrPayload = createQRpayload({
		userID: user.clerkID,
		createdAt: new Date(),
	});

	return (
		<>
			<LandingThread />
			<section className="relative w-full">
				<Pin className="absolute left-[0%] top-[5%] z-40 min-[500px]:left-[0%] min-[500px]:top-[4%] md:left-[100%] md:top-[6%] lg:left-[0%] lg:top-[5%]" no_img size={1}/>
				
				<div className="mx-auto min-h-[calc(100%-7rem)] max-w-7xl py-10">
					
					<div className="rows-[] grid w-full grid-cols-1 gap-5 px-2 pt-10 sm:grid-cols-2 md:grid-cols-2  min-[500px]:grid-cols-2 lg:grid-cols-4">
						<QRTiteleHorizintalTicket qrPayload={qrPayload} firstName={user.firstName} />
						<QRTiteleVerticalTicket qrPayload={qrPayload} firstName={user.firstName} />
						<TitleTicket firstName={user.firstName} />
						<QuickQR qrPayload={qrPayload} />
						
						<Countdown
							title={`${c.hackathonName} ${c.itteration}`}
							date={c.startDate}
						/>
						<Questions />
						
					</div>
				</div>
				<Pin className="absolute left-[99%] top-[84%] z-40 min-[500px]:left-[99%] min-[500px]:top-[76%] md:left-[100%] md:top-[95%] lg:left-[100%] lg:top-[51%]" no_img size={1}/>
			</section>
		</>
	);
}
