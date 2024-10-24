import Balancer from "react-wrap-balancer";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default function WorkWithUs() {
	return (
		<section className="my-2 w-full lg:my-32">
			<div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
				<div className="flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300 md:hover:scale-105">
					<h1 className="text-center font-oswald text-3xl font-bold italic text-[#ea580c] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
						Volunteers/Mentors
					</h1>
					<div className="text-center font-mono text-lg font-bold text-[#ea580c] md:text-center">
						<Balancer>
							We are always looking for volunteers and mentors to
							help us make RowdyHacks the best hackathon around!
							If you are interested in becoming a volunteer or
							mentor, click below to signup!
						</Balancer>
						<div className={"mt-2 flex justify-center gap-x-3"}>
							<Button
								className={
									"min-h-16 rounded-md border-2 border-[#ea580c] bg-orange-300 lg:min-h-0"
								}
							>
								<Link href={"https://tally.so/r/wodDNN"}>
									Become a Volunteer
								</Link>
							</Button>
							<Button
								className={
									"min-h-16 rounded-md border-2 border-[#ea580c] bg-orange-300 lg:min-h-0"
								}
							>
								<Link href={"https://tally.so/r/nPY0ae"}>
									Become a Mentor
								</Link>
							</Button>
						</div>
					</div>
				</div>

				<div className="flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300 md:hover:scale-105">
					<h1 className="text-center font-oswald text-3xl font-bold italic text-[#ea580c] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
						Partners
					</h1>
					<div className="text-center font-mono text-lg font-bold text-[#ea580c] md:text-center">
						<Balancer>
							RowdyHacks would not be possible without our
							incredible partners! If you or a group you represent
							are interested in partnering, please click below to
							view our Partner Packet.
						</Balancer>
						<Button
							className={
								"mt-2 rounded-md border-2 border-[#ea580c] bg-orange-300"
							}
						>
							<Link
								href={
									"/docs/RowdyHacks%20X%20Partner%20Packet.pdf"
								}
							>
								Partner Packet
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
