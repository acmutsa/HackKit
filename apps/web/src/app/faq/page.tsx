import c from "config";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/shared/Navbar";
import FAQItem from "@/components/faq/FAQItem";
import Link from "next/link";
import { Accordion } from "@/components/shadcn/ui/accordion";
import Image from "next/image";

export default function Page() {
	return (
		<>
			<Navbar />
			<div className="flex flex-col justify-center min-h-96 lg:gap-6 gap-4 bg-[#1A3A9E] md:px-10 px-2 py-4 font-oswald">
				<div className="flex md:gap-6 gap-3 justify-center items-center border-[#ea580c] border-4 py-4 rounded-lg bg-white">
					<Image
						src="/img/logo/rhbttf.svg"
						alt="RowdyHacks Logo"
						className="md:w-32 w-20"
						width={100}
						height={50}
					/>
					<h1 className="md:text-7xl sm:text-5xl text-4xl text-[#ea580c] font-extrabold text-center">
						Hackathon FAQ
					</h1>
				</div>
				<Accordion
					type="single"
					collapsible
					className="lg:grid-cols-2 grid-cols-1 grid self-center lg:gap-6 gap-4 font-bold"
				>
					<FAQItem title="What is a hackathon?">
						A hackathon is a weekend-long event where students form teams and
						collaborate on a software or hardware project to learn new skills,
						create social impact, participate in Partners challenges, and
						innovate new solutions! There’s also plenty of time for networking
						with partners, meeting other hackers, and attending workshops and
						mini events! In short, it’s a weekend dedicated to collaboration,
						technology, and community :)
					</FAQItem>
					<FAQItem title="What will I need?">
						RowdyHacks is a weekend-long event, and we want to make sure you’re
						prepared!
						<br />
						<br /> We encourage you to bring a change of clothes and any hygiene
						items you might need. With COVID still ongoing, we also encourage
						our hackers to mask up during the event.
						<br />
						<br /> Any hardware you plan on using for the project -- your
						laptop, charger, portable mouse, phone, Raspberry Pi, VR headset,
						robots, etc. <br />
						<br />
						While we cannot designate a sleeping area (per university rules), we
						also can’t stop you from napping! Since our event is overnight, feel
						free to bring a pillow and blanket and get comfy. <br />
						<br />
						While we will be providing meals, drinks, and snacks, you’re more
						than welcome to bring any snacks or drinks you’d like to enjoy.
						There will also be water bottle fill-up stations, so feel free to
						bring a reusable water bottle!
					</FAQItem>
					<FAQItem title="How much does it cost to operate?">
						RowdyHacks is completely FREE to attend, thanks to our awesome
						partners. You don't have to worry about a thing -- we'll provide
						meals, snacks, t-shirts, swag, prizes, and more all weekend long!
					</FAQItem>
					<FAQItem title="What if I don't know how to code?">
						No worries! RowdyHacks is for everyone from all coding and
						non-coding backgrounds! We will have plenty of mentors, resources,
						and workshops to help you learn throughout the event.
					</FAQItem>
					<FAQItem title="How big can my teams be?">
						Teams can consist of up to 4 students! We encourage hackers to
						participate as part of a team. Don't have a team? No worries, we
						will have an opportunity before the event for you to meet other
						hackers and form teams!
					</FAQItem>
					<FAQItem title="How long is this hackathon?">
						This year RowdyHacks will be a 36-hour event, 24 hours of which will
						be dedicated to hacking.
					</FAQItem>
					<FAQItem title="Who can attend?">
						Any university, college, or vocational student 18 or older can
						attend!
					</FAQItem>
					<FAQItem title="What can my project be?">
						Anything! You can make a new social media website, a simple weather
						app, a sentimental analysis tool for tweets, a game... anything you
						can imagine, you can create. <br />
						<br />
						Your team can come prepared with an idea or come up with one on the
						spot. We’ll have workshops, resources, and mentors to help you out
						with your project as well!
					</FAQItem>
					<FAQItem title="Can I work on previous projects?">
						If you plan to submit your project to any of our competition tracks,
						your project must be started from scratch when hacking begins the
						weekend of the event. However, you can start brainstorming your
						ideas or learning new skills you might need for your project prior
						to the event.
						<br />
						<br />
						If you would like to use the RowdyHacks weekend to work on previous
						projects and attend workshops or network with our partners, you’re
						free to do so as long as you do not submit that project to any of
						our competition tracks.
						<br />
						<br />
						Any team found submitting previous projects will be automatically
						disqualified.
					</FAQItem>
					<FAQItem title="What if I'm not a UTSA student?">
						Not a UTSA student? No problem! RowdyHacks is open to ANY college,
						university, or vocational student over 18 years old. We're so
						excited to see students from all over collaborating and innovating
						together at this year's event!!
					</FAQItem>
					<FAQItem title="What competition tracks will be offered this year?">
						Hackers can submit their projects to either the Learners Track
						(geared towards those who are in intro CS classes or those who
						haven't coded before) or the General Track (for those with moderate
						to advanced skills). In addition to submitting projects to a
						competition track, hackers can also submit their project for Best
						Retro Hack, Best Hardware Hack, Cybersecurity, or Partners.
					</FAQItem>
					<FAQItem title="What if this FAQ didn't answer my question?">
						Please e-mail{" "}
						<Link href="mailto:team@rowdyhacks.org">team@rowdyhacks.org. </Link>{" "}
						We’ll be happy to answer any questions you have.
					</FAQItem>
				</Accordion>
			</div>
			<Footer />
		</>
	);
}
