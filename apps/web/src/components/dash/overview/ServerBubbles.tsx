import Link from "next/link";
import Image from "next/image";
import c from "config";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import { Mail } from "lucide-react";
import Pin from "@/components/landing/Pin";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});

const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});

export function Questions() {
	function DossierPins() {
		return (
			<>
			    <Pin className="absolute z-40 hidden md:block md:left-[3%] md:top-[53%] lg:hidden" />
				<Pin className="absolute z-40 hidden md:block md:left-[37%] md:top-[100%] lg:left-[23%] lg:top-[2%]" />
				<Pin className="absolute left-[50%] top-[4%] z-40 min-[500px]:left-[52%] min-[500px]:top-[4%] md:left-[89%] md:top-[84%] lg:hidden" />
			</>
		);
	}
	return (
		<div className={`relative flex h-full w-full flex-col justify-center gap-y-4 pr-[5%] pl-[10%] py-[10%] ${manuale.className}`}>
			<DossierPins />
			<img
				src="/img/assets/dash/have-questions-background.webp"
				alt=""
				aria-hidden
				className="absolute inset-0 -z-10 h-full w-full object-cover object-center drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>
			<div>
				<h1 className="text-2xl font-bold">Have a question?</h1>
				<p className="text-sm text-muted-foreground">
					We're here to help! Feel free to reach out to us via email
					or on Discord.
				</p>
			</div>
			<div className="flex items-center justify-center w-full gap-4 text-foreground">
				<Link href={c.links.discord} aria-label="Discord">
					<Image
						className="select-none invert"
						src="/img/assets/footer/discord_icon.svg"
						alt="Discord logo"
						width={28}
						height={28}
					/>
				</Link>
				<Link href={`mailto:${c.issueEmail}`} aria-label="Email">
					<Mail className="h-[27px] w-[27px]" />
				</Link>
			</div>
		</div>
	);
}

function QR({ qrPayload}: { qrPayload: string; qrSize?: string }) {
	return (
		<>
			<p className="text-xl font-bold">Quick QR</p>
			<div className={`flex w-[35%] min-[500px]:w-[55%] md:w-full items-center justify-center border-2 border-dashed border-[#AC1903] p-2`}>
				<QRCode
					className="h-full w-full"
					bgColor="transparent"
					fgColor="hsl(var(--primary))"
					value={qrPayload}
				/>
			</div>
			<p className="text-center text-xs text-foreground">
				Click / Tap To Open Event Pass
			</p>
		</>
	);
}

function TicketInfo({ className, firstName }: { className?: string; firstName: string }) {
	return (
		<div className={className}>
			<div>
				<h1 className="pb-[1%] font-bold leading-tight text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
					{c.hackathonName}
				</h1>
				<p className="font-light leading-tight text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl">
					24 hours, one mission: the perfect hack
				</p>
			</div>
			<div className="border-t border-foreground" />
			<div className="grid grid-cols-2 gap-3">
				<div>
					<p className="font-light leading-tight uppercase text-sm text-foreground">Event</p>
					<p className="text-md font-bold">{c.hackathonName}</p>
				</div>
				<div>
					<p className="font-light leading-tight uppercase text-sm text-foreground">Date</p>
					<p className="text-md font-black">{format(c.startDate, "MM-dd-yy")}</p>
				</div>
				<div>
					<p className="font-light leading-tight uppercase text-sm text-foreground">Location</p>
					<p className="text-md font-bold">Downtown campus | SP1 | SP2</p>
				</div>
				<div>
					<p className="font-light leading-tight uppercase text-sm text-foreground">Pass No.</p>
					<p className="text-md font-bold">RH-10-2026</p>
				</div>
			</div>

			<div className="border-t border-foreground" />

			<div>
				<p className="font-light leading-tight text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-foreground">Welcome to the crew, <span className="font-bold">{firstName}</span></p>
			</div>
		</div>
	);
}

export function QRTiteleHorizintalTicket({ qrPayload, firstName }: { qrPayload: string; firstName: string }) {
	function DossierPins() {
		return (
			<>
				<Pin className="absolute z-40 md:left-[92%] md:top-[17%] lg:left-[23%] lg:top-[7%]" />
				<Pin className="absolute z-40 md:left-[50%] md:top-[-3%] lg:left-[63%] lg:top-[0%]" />
				<Pin className="absolute z-40 md:left-[5%] md:top-[11%] lg:hidden" />
				
			</>
		);
	}
	return (
		<div className={`hidden relative w-full lg:flex lg:col-span-3 lg:row-span-2 md:flex md:col-span-3 md:row-span-2 ${manuale.className}`}>
			<DossierPins />
			<img
				src="/img/assets/dash/lable.webp"
				alt=""
				aria-hidden
				className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>

			<div className="absolute inset-0 flex">

				<Link href="/dash/pass" className="relative flex w-[27%] flex-shrink-0 flex-col items-center justify-center gap-3 pl-[6%] pr-[3%] py-[6%]">
					<QR qrPayload={qrPayload} />
				</Link>
				<TicketInfo className="relative flex flex-1 flex-col justify-center gap-4 pl-[6%] pr-[15%] py-[5%] text-foreground w-fit" firstName={firstName} />

			</div>
		</div>
	);
}


export function QRTiteleVerticalTicket({ qrPayload, firstName }: { qrPayload: string; firstName: string }) {
	function DossierPins() {
		return (
			<>
				<Pin className="absolute left-[12%] top-[9%] z-40" />
				<Pin className="absolute left-[64%] top-[4%] z-40" />
				<Pin className="absolute left-[88%] top-[16%] z-40" />
				<Pin className="absolute left-[79%] top-[68%] z-40" />
			</>
		);
	}
	return (
		<div className={`hidden max-[499px]:flex relative w-full col-span-1 row-span-3 px-[5%] ${manuale.className}`}>
			<DossierPins />
			<img
				src="/img/assets/dash/lable-vertical.webp"
				alt=""
				aria-hidden
				className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)] "
			/>

			<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-[10%] py-[5%] text-foreground">

				<TicketInfo className="relative flex flex-1 flex-col justify-center gap-4 px-[6%] py-[5%] text-foreground w-fit" firstName={firstName} />
				<Link href="/dash/pass" className="relative flex w-full flex-col items-center justify-center gap-2 px-[3%] pt-[7%] pb-[4%]">
					<QR qrPayload={qrPayload} />
				</Link>

			</div>
		</div>
	);
}

export function TitleTicket({ firstName }: { firstName: string }) {
	function DossierPins() {
		return (
			<>
				<Pin className="absolute z-40 min-[500px]:left-[74%] min-[500px]:top-[9%]" />
				<Pin className="absolute z-40 min-[500px]:left-[96%] min-[500px]:top-[38%]" />
				<Pin className="absolute z-40 min-[500px]:left-[83%] min-[500px]:top-[90%]" />
				<Pin className="absolute z-40 min-[500px]:left-[21%] min-[500px]:top-[92%]" />
			</>
		);
	}
	
	return (

		<div className={`relative hidden min-[500px]:block md:hidden col-span-1 !col-start-1 !row-start-1 min-[500px]:col-span-2 min-[500px]:row-span-2 w-full ${manuale.className}`}>
			<DossierPins />
			<img
				src="/img/assets/dash/lable1.webp"
				alt=""
				aria-hidden
				className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>
			<div className="absolute inset-0 flex">
				<TicketInfo className="relative flex flex-1 flex-col justify-center gap-4 pl-[6%] pr-[15%] py-[5%] text-foreground w-fit" firstName={firstName} />
			</div>

		</div>
	);
}

export function QuickQR({ qrPayload }: { qrPayload: string }) {
	function DossierPins() {
		return (
			<>
				<Pin className="absolute z-40 min-[500px]:left-[12%] min-[500px]:top-[10%]" />
				<Pin className="absolute z-40 min-[500px]:left-[89%] min-[500px]:top-[17%]" />
			</>
		);
	}
	return (
		<Link href={"/dash/pass"} className={`relative hidden min-[500px]:flex md:hidden row-span-2 flex-col items-center justify-center gap-y-4 w-[80%] ${manuale.className}`}>
			<DossierPins />
			<img
				src="/img/assets/dash/lable2.webp"
				alt=""
				aria-hidden
				className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4">
				<QR qrPayload={qrPayload} />
			</div>

		</Link>
	);
}
