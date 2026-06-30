import c from "config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { Manuale, Shadows_Into_Light } from "next/font/google";

const manuale = Manuale({
    subsets: ["latin"],
    display: "swap",
});
const shadow = Shadows_Into_Light({
    subsets: ["latin"],
    weight: "400",
});

export default function RegistrationClosed() {
	return (
		<main className="flex min-h-screen my-10 items-center justify-center px-4">
			<div
				className={`relative flex max-w-xl flex-col items-center justify-center gap-y-5 ${manuale.className} bg-card px-16 py-20 rounded-[3px] shadow-[-2px_10px_8px_rgba(0,0,0,0.28)] drop-shadow-[10px_14px_7px_rgba(0,0,0,0.45)]`}
			>
				<p className={` text-end pb-[10%] text-md text-[#AC1903] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl rotate-[8deg]  text-hackathon ${shadow.className} w-full`}>
					Case File · {c.hackathonName} 
				</p>

				<h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-black leading-tight">
					Registration Is <br/> Currently Closed
				</h1>

				<p className="max-w-md text-center font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl ">
					This operation is currently closed to new team members. If you believe
					this was an error, or you've got intel for us —
					reach the handlers at{" "}
					<a className="text-hackathon underline" href={`mailto:${c.issueEmail}`}>
						{c.issueEmail}
					</a>
					.
				</p>

				<div className="mt-2 flex items-center gap-x-4 ">
					<Link href={"/"}>
						<Button>Return to Home</Button>
					</Link>
				</div>

				<p className="text-center font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl">
					Already in the team?
					<Link className="pl-1 underline text-[#AC1903] " href={"/sign-in"}>
						Sign in.
					</Link>
				</p>
			</div>
		</main>
	);
}
