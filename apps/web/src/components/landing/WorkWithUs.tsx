import Balancer from "react-wrap-balancer";
import { Button } from "@/components/shadcn/ui/button"
import Link from "next/link";

export default function WorkWithUs() {
	return (
		<section className="flex min-h-screen w-full flex-col items-center justify-center border-y-2 border-muted-foreground bg-white">
			<div className="container mx-auto grid grid-cols-1 gap-y-8 gap-x-10 md:grid-cols-2 py-4">
				<div
					className="flex flex-col justify-center gap-y-6 bg-white border-[#ea580c] border-4 rounded-xl p-8 transform transition-transform duration-300 hover:scale-105">
					<h1 className="font-oswald text-center text-3xl font-bold italic text-[#ea580c] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
						Volunteers/Mentors
					</h1>
					<div className="text-center font-mono text-lg font-bold text-[#ea580c] md:text-center">
						<Balancer>
							We are always looking for volunteers and mentors to help us make RowdyHacks the best hackathon around! If you are interested in becoming a volunteer or mentor, click below to signup!
						</Balancer>
						<div className={"flex justify-center gap-x-3 mt-2"}>
							<Button className={"bg-orange-300 border-[#ea580c] border-2 rounded-md min-h-16 lg:min-h-0"}>
								<Link href={"https://tally.so/r/wodDNN"}>Become a Volunteer</Link>
							</Button>
							<Button className={"bg-orange-300 border-[#ea580c] border-2 rounded-md min-h-16 lg:min-h-0"}>
								<Link href={"https://tally.so/r/nPY0ae"}>Become a Mentor</Link>
							</Button>
						</div>
					</div>
				</div>

				<div
					className="flex flex-col justify-center gap-y-6 bg-white border-[#ea580c] border-4 rounded-xl p-8 transform transition-transform duration-300 hover:scale-105">
					<h1 className="font-oswald text-center text-3xl font-bold italic text-[#ea580c] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
						Partners
					</h1>
					<div className="text-center font-mono text-lg font-bold text-[#ea580c] md:text-center">
						<Balancer>
							RowdyHacks would not be possible without our incredible partners! If you or a group you represent are interested in partnering, please click below to view our Partner Packet.
						</Balancer>
						<Button className={"bg-orange-300 border-[#ea580c] border-2 rounded-md mt-2"}>
							<Link href={"/docs/RowdyHacks%20X%20Partner%20Packet.pdf"}>Partner Packet</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
