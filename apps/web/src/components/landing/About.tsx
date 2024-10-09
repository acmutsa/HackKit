"use client"; // Add this at the top

import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";

export default function About() {
	const [isExpanded, setIsExpanded] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const firstLoad = useRef(false);

	const toggleExpand = () => {
		if (!firstLoad.current) firstLoad.current = true;
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		if (!isExpanded && buttonRef.current && firstLoad.current) {
			buttonRef.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [isExpanded]);

	return (
		<section
			className="relative z-10 min-h-screen w-full bg-cover bg-no-repeat"
			id="About"
		>
			<div className="md:grid-cols-2 container mx-auto grid grid-cols-1 gap-x-10 gap-y-16 py-4">
				{/* ABOUT US Section */}
				<div className="md:hover:scale-105 flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300">
					<h1 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-oswald text-3xl font-bold italic text-[#ea580c]">
						ABOUT US
					</h1>
					<p className="md:text-center text-center font-mono text-lg font-bold text-[#ea580c]">
						<Balancer>
							RowdyHacks is a free, weekend-long, overnight
							hackathon hosted at UTSA! Students can join us to
							network, code, collaborate, and compete. Whether
							it's your first hackathon or your seventh, we offer
							something for everyone!
						</Balancer>
					</p>
				</div>

				{/* WHO CAN ATTEND Section */}
				<div className="md:hover:scale-105 flex transform flex-col justify-center gap-y-6 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300">
					<h1 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-oswald text-3xl font-bold italic text-[#ea580c]">
						WHO CAN ATTEND?
					</h1>
					<p className="md:text-center text-center font-mono text-lg font-bold text-[#ea580c]">
						<Balancer>
							We're excited to welcome hackers from all
							disciplines, backgrounds, & technical levels!
							Whether you're a seasoned coder or new to tech,
							RowdyHacks has something for everyone!
						</Balancer>
					</p>
				</div>
			</div>

			{/* Celebrating 10 Years Section */}
			<div className="md:grid-cols-1 container mx-auto mt-16 grid grid-cols-1 gap-y-16">
				<div className="md:hover:scale-105 flex transform flex-col justify-center gap-y-10 rounded-xl border-4 border-[#ea580c] bg-white p-8 transition-transform duration-300">
					<h1 className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-oswald text-3xl font-bold italic text-[#ea580c]">
						CELEBRATING 10 YEARS
						<br />
						OF ROWDYHACKS
					</h1>
					{/* Mobile: Truncated content with read more */}
					<div className="md:hidden block text-center font-mono text-lg font-bold text-[#ea580c]">
						{/* Animation for scrolling. Has to have exact heights so it knows where to animate to and from*/}
						<Balancer>
							<>
								{isExpanded
									? "This year marks a significant milestone for RowdyHacks, as we celebrate 10 years of fostering creativity, collaboration, and mentorship right here at UTSA! Since our inception, RowdyHacks has brought together students, developers, and tech enthusiasts from all walks of life to engage in healthy competition, collaborate on innovative projects, and learn new skills they might not encounter in a traditional classroom setting. Over the past decade, we've witnessed incredible growth. We take pride in our inclusive community-building and empowering the next generation of tech leaders. Together, we've created an ecosystem where innovation thrives, friendships are formed, and the future is built, one hack at a time. As we celebrate this remarkable journey, we look forward to what the next 10 years hold for RowdyHacks. Whether you've been with us from the start or are joining us for the first time, let's make this milestone year one to remember. Let's hack, create, and shape the future—together!"
									: "This year marks a significant milestone for RowdyHacks, as we celebrate 10 years of fostering creativity, collaboration, and mentorship right here at UTSA! ..."}
							</>
						</Balancer>
						<button
							ref={buttonRef}
							onClick={toggleExpand}
							className="mt-4 font-mono text-sm font-bold text-[#ea580c] underline"
						>
							{isExpanded ? "read less" : "read more"}
						</button>
					</div>

					{/* Desktop: Full content displayed */}
					<div className="md:block hidden text-center font-mono text-lg font-bold text-[#ea580c]">
						<Balancer>
							This year marks a significant milestone for
							RowdyHacks, as we celebrate 10 years of fostering
							creativity, collaboration, and mentorship right here
							at UTSA! Since our inception, RowdyHacks has brought
							together students, developers, and tech enthusiasts
							from all walks of life to engage in healthy
							competition, collaborate on innovative projects, and
							learn new skills they might not encounter in a
							traditional classroom setting. Over the past decade,
							we've witnessed incredible growth. We take pride in
							our inclusive community-building and empowering the
							next generation of tech leaders. Together, we've
							created an ecosystem where innovation thrives,
							friendships are formed, and the future is built, one
							hack at a time. As we celebrate this remarkable
							journey, we look forward to what the next 10 years
							hold for RowdyHacks. Whether you've been with us
							from the start or are joining us for the first time,
							let's make this milestone year one to remember.
							Let's hack, create, and shape the future—together!
						</Balancer>
					</div>

					<h2 className="text-center font-mono font-bold text-[#ea580c]">
						🧡 The RowdyHacks Team
					</h2>
				</div>
			</div>
		</section>
	);
}
