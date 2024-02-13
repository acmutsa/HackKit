import Link from "next/link";

export default function WorkWithUs() {
	return (
		<section className="bg-gradient-to-b from-[#6c3c26] to-[#724001] p-5">
			<div className="bg-[#F9F0E7] h-full w-full min-h-[700px] rounded-xl grid grid-cols-1 md:grid-cols-2 gap-x-5 p-5 pt-10">
				<div className="leading-[0.8] md:hidden md:text-[14rem] py-20 text-6xl font-bebas flex flex-col justify-center text-white">
					<h1 className="block md:hidden text-center text-[#AB8167] font-oswald font-semibold">
						Work With Us
					</h1>
				</div>
				<div className="flex flex-col justify-center gap-3 gap-y-7 px-2">
					<div className="bg-white md:aspect-[16/10] aspect-[16/14] w-full rounded-tl-2xl rounded-br-2xl border-[#AB8167] border-2 px-5 shadow-2xl">
						<h2 className="bg-white font-mono border-[#AB8167] border-2 rounded-full py-2 px-3 w-min text-[#AB8167] font-bold -translate-y-[50%]">
							Students
						</h2>
						<h1 className="font-oswald text-4xl font-bold italic text-[#A5836B]">
							INTERESTED IN HELPING?
						</h1>
						<p className="font-sans font-bold my-5 text-[#A5836B]">
							We are always looking for volunteers and mentors to help us make RowdyHacks the best
							hackathon around! If you are interested in becoming a volunteer or mentor, click below
							to signup!
						</p>
						<div className="flex md:flex-row flex-col gap-5 pb-5">
							<Link href={"https://form.rowdyhacks.org/volunteer"}>
								<button className="bg-[#A5836B] rounded px-3 text-white font-bold py-3 transition-colors duration-150">
									Volunteer Form
								</button>
							</Link>
							<Link href={"https://form.rowdyhacks.org/mentor"}>
								<button className="bg-[#A5836B] rounded px-3 text-white font-bold py-3 transition-colors duration-150">
									Mentor Form
								</button>
							</Link>
						</div>
					</div>
					<div className="bg-white md:aspect-[16/10] aspect-[16/14] w-full rounded-tl-2xl rounded-br-2xl border-[#AB8167] border-2 px-5 shadow-2xl">
						<h2 className="bg-white border-[#AB8167] border-2 rounded-full py-2 px-3 w-min text-[#AB8167] font-mono font-bold -translate-y-[50%]">
							Companies
						</h2>
						<h1 className="font-oswald text-4xl font-bold italic text-[#A5836B]">
							INTERESTED IN PARTNERING?
						</h1>
						<p className="font-sans font-bold my-5 text-[#A5836B]">
							RowdyHacks would not be possible without our incredible partners! If you or a group
							you represent are interested in partnering, please click below to view our Partner
							Packet.
						</p>
						<div className="pb-5">
							<Link href="https://static.rowdyhacks.org/docs%2FRowdyHacks%202024%20Partner%20Packet.pdf">
								<button className="bg-[#A5836B] rounded px-3 text-white font-bold py-3 transition-colors duration-150">
									Partner Packet
								</button>
							</Link>
						</div>
					</div>
				</div>
				<div className="hidden md:text-[14rem] text-5xl text-[#AB8167] font-oswald font-semibold md:flex flex-col justify-center">
					<h1>Work</h1>
					<h1>With</h1>
					<h1>Us</h1>
				</div>
			</div>
		</section>
	);
}
