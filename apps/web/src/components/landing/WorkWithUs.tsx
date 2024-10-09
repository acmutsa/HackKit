import Balancer from "react-wrap-balancer";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default function WorkWithUs() {
	return (
		<section className="lg:my-32 my-2 w-full">
			<div className="md:grid-cols-2 container mx-auto grid grid-cols-1 gap-x-10 gap-y-16">
				<div className="md:hover:scale-105 flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300">
					<h1 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-oswald text-3xl font-bold italic text-[#ea580c]">
						Volunteers/Mentors
					</h1>
					<div className="md:text-center text-center font-mono text-lg font-bold text-[#ea580c]">
						<Balancer>
							We are always looking for volunteers and mentors to
							help us make RowdyHacks the best hackathon around!
							If you are interested in becoming a volunteer or
							mentor, click below to signup!
						</Balancer>
						<div className={"mt-2 flex justify-center gap-x-3"}>
							<Button
								className={
									"min-h-16 lg:min-h-0 rounded-md border-2 border-[#ea580c] bg-orange-300"
								}
							>
								<Link href={"https://tally.so/r/wodDNN"}>
									Become a Volunteer
								</Link>
							</Button>
							<Button
								className={
									"min-h-16 lg:min-h-0 rounded-md border-2 border-[#ea580c] bg-orange-300"
								}
							>
								<Link href={"https://tally.so/r/nPY0ae"}>
									Become a Mentor
								</Link>
							</Button>
						</div>
					</div>
				</div>

				<div className="md:hover:scale-105 flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300">
					<h1 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-oswald text-3xl font-bold italic text-[#ea580c]">
						Partners
					</h1>
					<div className="md:text-center text-center font-mono text-lg font-bold text-[#ea580c]">
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
