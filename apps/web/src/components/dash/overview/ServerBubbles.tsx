import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import c from "config";
import { format } from "date-fns";
import GradientHero from "./GradientHero";
import QRCode from "react-qr-code";

export function Questions() {
	return (
		<div className="flex h-full min-h-[150px] w-full flex-col justify-between rounded-xl border border-border p-5">
			<div>
				<h1 className="font-bold">Have a question?</h1>
				<p className="text-xs text-muted-foreground">
					We're here to help! Feel free to reach out to us via email
					or on Discord.
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
		<div className="relative col-span-1 !col-start-1 !row-start-1 aspect-video h-full w-full overflow-hidden rounded-xl border border-hackathon p-5 sm:col-span-2 sm:row-span-2 lg:!col-start-auto lg:!row-start-auto lg:aspect-auto">
			<GradientHero />
			<div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-xl">
				<h1 className="text-7xl font-black text-white">
					{c.hackathonName}
				</h1>
				<h2 className="text-center font-mono text-xs text-white sm:text-sm">
					{`${format(c.startDate, "h:mma, MMM d, yyyy")}`} @{" "}
					{c.prettyLocation}
				</h2>
			</div>
		</div>
	);
}

export function QuickQR({ qrPayload }: { qrPayload: string }) {
	return (
		<Link
			href={"/dash/pass"}
			className="row-span-2 flex flex-col items-center justify-center gap-y-2 rounded-xl border border-border"
		>
			<p className="font-bold">Quick QR</p>
			<div className="flex aspect-square h-[50%] items-center justify-center overflow-x-hidden rounded-xl border-2 border-dashed border-muted p-2">
				<QRCode
					className="h-full"
					bgColor="hsl(var(--background))"
					fgColor="hsl(var(--primary))"
					value={qrPayload}
				/>
			</div>
			<p className="text-xs text-muted-foreground">
				Click / Tap To Open Event Pass
			</p>
		</Link>
	);
}
