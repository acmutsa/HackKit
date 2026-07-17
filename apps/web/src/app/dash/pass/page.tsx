import QRCode from "react-qr-code";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import c from "config";
import { format } from "date-fns";
import TiltWrapper from "@/components/dash/shared/TiltWrapper";
import { createQRpayload } from "@/lib/utils/shared/qr";
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
} from "@/components/shadcn/ui/drawer";
import { getHacker } from "db/functions";
import { Hacker } from "db/types";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import Pin from "@/components/landing/Pin";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});

interface EventPassProps {
	user: Hacker;
	clerk: NonNullable<Awaited<ReturnType<typeof currentUser>>>;
	qrPayload: string;
	guild: string;
}

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userDbRecord = await getHacker(user.id);
	if (!userDbRecord) return null;

	const qrPayload = createQRpayload({
		userID: user.id,
		createdAt: new Date(),
	});
	const guild = Object.keys(c.groups)[userDbRecord.hackerData.group];

	return (
		<>
			<div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
				<TiltWrapper>
					<EventPass
						user={userDbRecord}
						qrPayload={qrPayload}
						clerk={user}
						guild={guild}
					/>
				</TiltWrapper>
			</div>
		</>
	);
}

function EventPass({ qrPayload, user, clerk, guild }: EventPassProps) {
	return (
		<div className="flex relative w-full max-w-[400px] py-[15%] px-[5%] sm:px-0 h-auto">
			<Pin className=" sm:hidden absolute left-[46%] top-[12%] z-40" name="/img/assets/map/pin5.webp" size={50} />


			<img
				src="/img/assets/pass/event-pass.webp"
				alt=""
				aria-hidden
				className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>

			<div className={`absolute inset-0 flex flex-col items-center justify-center gap-y-[10%] pt-[10%] ${manuale.className}`}>

				<div className="w-full h-auto flex item-center justify-center">
					<Image
						src={c.icon.svg}
						height={50}
						width={50}
						alt={``}
					/>
				</div>


				<div className="flex w-[70%] flex-col items-start gap-1 px-6">
					<div className="flex w-full flex-col items-start">
						<h1 className="pb-[1%] font-bold leading-tight text-lg sm:text-2xl md:text-2xl lg:text-4xl">
							{user.firstName}
						</h1>

						<h3 className="font-light leading-tight text-sm sm:text-base md:text-lg lg:text-lg">
							Tag: @{user.hackerTag}
						</h3>
						<h3 className="font-light leading-tight text-sm sm:text-base md:text-lg lg:text-lg">
							Group: {guild}
						</h3>
					</div>

					<div className="h-auto w-[90%]">
						<Drawer>
							<DrawerTrigger asChild>
								<div className="flex aspect-square h-full items-center justify-center">
									<QRCode
										className="h-full w-full"
										bgColor="transparent"
										fgColor="hsl(var(--primary))"
										value={qrPayload}
									/>
								</div>
							</DrawerTrigger>
							<DrawerContent className="flex h-[90%] w-full items-center justify-center focus-visible:outline-none">
								<QRCode
									className="h-full"
									bgColor="transparent"
									fgColor="hsl(var(--primary))"
									value={qrPayload}
								/>
							</DrawerContent>
						</Drawer>
					</div>
				</div>

				<p className="text-xs text-center">
					Keep this Pass
				</p>


			</div>

		</div>
	);
}
