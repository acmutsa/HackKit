import QRCode from "react-qr-code";
import { currentUser } from "@clerk/nextjs";
import superjson from "superjson";
import { db } from "@/db";
import { eq, InferModel } from "drizzle-orm";
import { users } from "@/db/schema";
import Image from "next/image";
import c from "@/hackkit.config";
import { format } from "date-fns";
import TiltWrapper from "@/components/dash/shared/TiltWrapper";

interface EventPassProps {
	user: InferModel<typeof users>;
	clerk: NonNullable<Awaited<ReturnType<typeof currentUser>>>;
	qrPayload: string;
}

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userDbRecord = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (!userDbRecord) return null;

	const qrPayload = superjson.stringify({ userId: user.id, createdAt: Date.now() });

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-7rem)] bg-nav">
			{/* <QRCode value={qrObject} /> */}
			<TiltWrapper>
				<EventPass user={userDbRecord} qrPayload={qrPayload} clerk={user} />
			</TiltWrapper>
		</div>
	);
}

function EventPass({ qrPayload, user, clerk }: EventPassProps) {
	return (
		<div className="relative h-max my-20">
			<div className="absolute z-10 -translate-y-[50%] top-0 left-1/2 border-nav dark:border border-2 border-b-muted border-r-muted rotate-45 -translate-x-1/2 w-[75px] h-[75px] bg-nav rounded-full" />
			<div className=" bg-background border-muted dark:border border-2 max-w-[400px] !max-h-[calc(100vh-7rem)] w-full aspect-[9/17] rounded-3xl flex flex-col overflow-hidden py-[37.5px]">
				<div className="w-full relative h-[30%] pt-2 flex flex-col items-center">
					<Image
						src={clerk.imageUrl}
						alt={`${user.firstName}'s Profile Picture`}
						width={100}
						height={100}
						className="rounded-full mx-auto"
					/>
					<h1 className="text-4xl font-bold text-center mt-2">{user.firstName}</h1>
					<h2 className="font-mono text-center">@{user.hackerTag}</h2>
				</div>
				<div className="event-pass-img h-[45%] w-full relative flex items-end">
					<div className="absolute will-change-transform left-1/2 top-1/2 w-[200px] aspect-square -translate-x-1/2 -translate-y-[65%] bg-hackathon opacity-60 blur-[50px]"></div>
					<Image
						src={c.eventPassBgImage}
						alt={""}
						fill
						className="object-contain -translate-y-[15%] scale-[0.8] no-select"
					/>
					<div className="w-full h-20 grid grid-cols-2">
						<div className="w-full h-full flex items-center justify-start pl-2">
							<Image src={c.icon.svg} height={60} width={60} alt={`${c.hackathonName} Logo`} />
							<h1 className="font-bold ml-1 text-lg leading-tight">
								{c.hackathonName} <span className="text-hackathon">{c.itteration}</span>
							</h1>
						</div>
						<div className="w-full h-full flex flex-col justify-center items-end pr-3 gap-y-1">
							<p className="font-mono text-xs">{`${format(c.startDate, "h:mma, MMM d, yyyy")}`}</p>
							<p className="font-mono text-xs">{c.prettyLocation}</p>
						</div>
					</div>
				</div>
				<div className="h-[25%] w-full flex items-center justify-center border-dashed border-muted">
					<div className="h-[90%] aspect-square overflow-x-hidden flex items-center justify-center border-dashed border-muted border-2 p-2 rounded-xl">
						<QRCode
							className="h-full"
							bgColor="hsl(var(--background))"
							fgColor="hsl(var(--primary))"
							value={qrPayload}
						/>
					</div>
				</div>
			</div>
			<div className="absolute z-10 translate-y-[50%] bottom-0 left-1/2 border-nav dark:border border-2 border-t-muted border-l-muted rotate-45 -translate-x-1/2  w-[75px] h-[75px] bg-nav rounded-full" />
		</div>
	);
}

export const runtime = "edge";
