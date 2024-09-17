import QRCode from "react-qr-code";
import { currentUser } from "@clerk/nextjs";
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

interface EventPassProps {
	user: Hacker;
	clerk: NonNullable<Awaited<ReturnType<typeof currentUser>>>;
	qrPayload: string;
	guild: string;
}

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userDbRecord = await getHacker(user.id, false);
	if (!userDbRecord) return null;

	const qrPayload = createQRpayload({
		userID: user.id,
		createdAt: new Date(),
	});
	const guild = Object.keys(c.groups)[userDbRecord.hackerData.group];

	return (
		<div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-nav">
			<TiltWrapper>
				<EventPass
					user={userDbRecord}
					qrPayload={qrPayload}
					clerk={user}
					guild={guild}
				/>
			</TiltWrapper>
		</div>
	);
}

function EventPass({ qrPayload, user, clerk, guild }: EventPassProps) {
	return (
		<div className="relative my-20 h-max">
			<div className="absolute left-1/2 top-0 z-10 h-[75px] w-[75px] -translate-x-1/2 -translate-y-[50%] rotate-45 rounded-full border-2 border-background border-b-muted border-r-muted bg-background dark:border" />
			<div className="flex aspect-[9/17] !max-h-[calc(100vh-7rem)] w-full min-w-[min(100vw-5rem,350px)] max-w-[500px] flex-col overflow-hidden rounded-3xl border-2 border-muted bg-background py-[37.5px] dark:border">
				<div className="relative flex min-h-fit w-full flex-col items-center pt-2">
					<Image
						src={clerk.imageUrl}
						alt={`${user.firstName}'s Profile Picture`}
						width={100}
						height={100}
						className="mx-auto rounded-full"
					/>
					<h1 className="mt-2 text-center text-4xl font-bold">
						{user.firstName}
					</h1>
					<div className="flex w-full items-center justify-center space-x-5">
						<h3 className="text-center font-mono text-sm">
							@{user.hackerTag}
						</h3>
						<h3 className="text-center font-mono text-sm">
							{guild}
						</h3>
					</div>
				</div>
				<div className="event-pass-img relative flex h-full w-full flex-col items-center justify-evenly">
					<div className="absolute left-1/2 top-1/2 aspect-square w-[200px] -translate-x-1/2 -translate-y-[65%] bg-slate-400 opacity-60 blur-[50px] will-change-transform"></div>
					<div className="relative flex w-full items-center justify-center h-[65%]">
						<Image
							src={c.eventPassBgImage}
							alt={""}
							fill
							className="no-select z-50 scale-[0.8] object-contain"
						/>
					</div>
					<div className="mx-6 grid min-h-fit w-full grid-cols-2 gap-2">
						<div className="flex h-full w-full items-start justify-center">
							<h1 className="text-md ml-1 font-bold leading-tight">
								{c.hackathonName}{" "}
								<span className="text-orange-400">
									{c.itteration}
								</span>
							</h1>
						</div>
						<div className="flex h-full w-full flex-col items-end justify-center gap-y-1 pr-3">
							<p className="font-mono text-xs">{`${format(
								c.startDate,
								"h:mma, MMM d, yyyy",
							)}`}</p>
							<p className="font-mono text-xs">
								{c.prettyLocation}
							</p>
						</div>
					</div>
				</div>
				<div className="flex h-36 w-full items-center justify-center border-dashed border-muted">
					<Drawer>
						<DrawerTrigger asChild>
							<div className="flex aspect-square h-[90%] items-center justify-center overflow-x-hidden rounded-xl border-2 border-muted p-2">
								<QRCode
									className="h-full"
									bgColor="hsl(var(--background))"
									fgColor="hsl(var(--primary))"
									value={qrPayload}
								/>
							</div>
						</DrawerTrigger>
						<DrawerContent className="flex h-[90%] w-full items-center justify-center focus-visible:outline-none">
							<QRCode
								className="h-full"
								bgColor="hsl(var(--background))"
								fgColor="hsl(var(--primary))"
								value={qrPayload}
							/>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
			<div className="absolute bottom-0 left-1/2 z-10 h-[75px] w-[75px] -translate-x-1/2 translate-y-[50%] rotate-45 rounded-full border-2 border-background border-l-muted border-t-muted bg-background dark:border" />
		</div>
	);
}

export const runtime = "edge";
