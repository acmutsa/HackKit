import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import c from "config";
import { format } from "date-fns";
import GradientHero from "./GradientHero";
// import { users } from "db/schema";
import QRCode from "react-qr-code";

// interface MYInfoProps {
// 	user: typeof users.$inferSelect;
// }

export function Questions() {
	return (
		<div className="border border-muted rounded-xl p-5 h-full w-full min-h-[150px] flex flex-col justify-between">
			<div>
				<h1 className="font-bold">Have a question?</h1>
				<p className="text-muted-foreground text-xs">
					We're here to help! Feel free to reach out to us via email or on Discord.
				</p>
			</div>
			<div className="flex items-end gap-2">
				<Link href={c.links.discord}>
					<Button className="border-hackathon">Discord</Button>
				</Link>
				<Link href={`mailto:${c.issueEmail}`}>
					<Button className="border-hackathon">Email</Button>
				</Link>
			</div>
		</div>
	);
}

export function TitleBubble() {
	return (
		<div className="border relative border-hackathon overflow-hidden rounded-xl h-full p-5 w-full sm:col-span-2 sm:row-span-2 lg:!row-start-auto lg:!col-start-auto !row-start-1 !col-start-1 col-span-1 aspect-video lg:aspect-auto">
			<GradientHero />
			<div className="w-full rounded-xl h-full flex gap-y-2 flex-col items-center justify-center relative z-20">
				<h1 className="font-black text-7xl text-white">{c.hackathonName}</h1>
				<h2 className="font-mono text-xs sm:text-sm text-white text-center">
					{`${format(c.startDate, "h:mma, MMM d, yyyy")}`} @ {c.prettyLocation}
				</h2>
			</div>
		</div>
	);
}

export function QuickQR({ qrPayload }: { qrPayload: string }) {
	return (
		<Link
			href={"/dash/pass"}
			className="border border-muted rounded-xl row-span-2 flex flex-col items-center justify-center gap-y-2"
		>
			<p className="font-bold">Quick QR</p>
			<div className="h-[50%] aspect-square overflow-x-hidden flex items-center justify-center border-dashed border-muted border-2 p-2 rounded-xl">
				<QRCode
					className="h-full"
					bgColor="hsl(var(--background))"
					fgColor="hsl(var(--primary))"
					value={qrPayload}
				/>
			</div>
			<p className="text-xs text-muted-foreground">Click / Tap To Open Event Pass</p>
		</Link>
	);
}
