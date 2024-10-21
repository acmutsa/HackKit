import { Card } from "@/components/shadcn/ui/card";
import Image from "next/image";
import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

type TeamCardProps = {
	person: Person;
};

export default function TeamCard({ person }: TeamCardProps) {
	let borderColor, mainColor, glowColor, textColor;

	switch (person.team) {
		case "Director":
		case "Co-Director":
			borderColor =
				"linear-gradient(to bottom right, #EA580C, #FDE047, #EA580C)";
			mainColor = "#1E40AF";
			glowColor = "#4664D7";
			textColor = "white";
			break;
		case "Logistics / PR":
		case "Logistics":
			borderColor =
				"linear-gradient(to bottom right, #629584, #243642, #629584)";
			mainColor = "#387478";
			glowColor = "#CBD9D0";
			textColor = "white";
			break;
		case "Hacker Experience":
			borderColor =
				"linear-gradient(to bottom right, #7E60BF, #E4B1F0, #7E60BF)";
			mainColor = "#433878";
			glowColor = "#FFE1FF";
			textColor = "white";
			break;
		case "Tech / Logistics":
		case "Tech":
			borderColor =
				"linear-gradient(to bottom right, #A0153E, #5D0E41, #A0153E)";
			mainColor = "#00224D";
			glowColor = "#FF204E";
			textColor = "white";
			break;
		case "Media":
			borderColor =
				"linear-gradient(to bottom right, #B17457, #D8D2C2, #B17457)";
			mainColor = "#4A4947";
			glowColor = "#FAF7F0";
			textColor = "white";
			break;
		case "Public Relations":
			borderColor =
				"linear-gradient(to bottom right, #D3EE98, #A0D683, #D3EE98)";
			mainColor = "#72BF78";
			glowColor = "#F3C623";
			textColor = "white";
			break;
		case "Design":
			borderColor =
				"linear-gradient(to bottom right, #FFB0B0, #FFD09B, #FFB0B0)";
			mainColor = "#CB80AB";
			glowColor = "#FFECC8";
			textColor = "white";
			break;
		case "Outreach":
			borderColor =
				"linear-gradient(to bottom right, #161D6F, #0B2F9F, #161D6F)";
			mainColor = "#98DED9";
			glowColor = "#C7FFD8";
			textColor = "white";
			break;
	}

	return (
		<>
			<div className={"group [perspective:1000px]"}>
				<div
					className={
						"relative transform-gpu transition-all duration-500 [backface-visibility:hidden] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
					}
				>
					<div className={"absolute inset-0"}>
						<Card
							className={
								"relative mx-auto flex min-h-[400px] w-64 flex-col justify-center drop-shadow-md"
							}
							style={{ backgroundImage: borderColor }}
						>
							<div
								className={
									"relative] mx-4 flex h-[365px] flex-col content-end overflow-hidden rounded-md border-4 border-transparent"
								}
								style={{ backgroundColor: mainColor }}
							>
								<div
									className={
										"z-10 flex max-h-[36px] min-h-[36px] flex-none flex-row-reverse content-center justify-between gap-2"
									}
								>
									<Image
										src={"/img/logo/rhbttf.svg"}
										alt={"logo"}
										width={30}
										height={0}
										className={"mr-1"}
									/>
									<h4
										className={`text-${person.nameSize}xl font-oswald] text-left`}
										style={{
											textShadow: `3px 3px 3px ${glowColor}`,
											color: textColor,
										}}
									>
										{person.name}
									</h4>
								</div>
								<div
									className={
										"relative grow flex-col overflow-hidden border-4"
									}
								>
									<Image
										src={person.professionalPicture.link}
										alt={`${person.name} professional`}
										width={300}
										height={0}
										className={`absolute w-full rounded-md bg-center object-cover`}
										style={{
											scale: person.professionalPicture
												.zoom,
											translate: `${person.professionalPicture.x}px ${person.professionalPicture.y}px`,
										}}
									/>
								</div>
								<p
									className={
										"absolute bottom-4 right-4 z-10 flex-none text-right text-3xl"
									}
									style={{
										textShadow: `3px 3px 3px ${glowColor}`,
									}}
								>
									{person.team}
								</p>
							</div>
						</Card>
					</div>
					<div
						className={
							"absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
						}
					>
						<Card
							className={
								"relative mx-auto flex min-h-[400px] w-64 flex-col justify-center drop-shadow-md"
							}
							style={{ backgroundImage: borderColor }}
						>
							<div
								className={
									"relative mx-4 flex h-[365px] flex-col content-end overflow-hidden rounded-md border-4 border-transparent"
								}
								style={{ backgroundColor: mainColor }}
							>
								<div
									className={
										"z-10 flex max-h-[36px] min-h-[36px] flex-none flex-row-reverse content-center justify-between gap-2"
									}
								>
									<Image
										src={"/img/logo/rhbttf.svg"}
										alt={"logo"}
										width={30}
										height={0}
										className={"mr-1"}
									/>
									<h4
										className={`text-${person.nameSize}xl text-left font-oswald`}
										style={{
											textShadow: `3px 3px 3px ${glowColor}`,
										}}
									>
										{person.name}
									</h4>
								</div>
								<div
									className={
										"relative grow flex-col overflow-hidden border-4"
									}
								>
									<Image
										src={person.personalityPicture.link}
										alt={`${person.name} Personality`}
										width={300}
										height={0}
										className={`absolute w-full rounded-md bg-center object-cover`}
										style={{
											scale: person.personalityPicture
												.zoom,
											translate: `${person.personalityPicture.x}px ${person.personalityPicture.y}px`,
										}}
									/>
								</div>
								<div
									className={
										"absolute inset-x-0 bottom-4 z-10 flex flex-none flex-row justify-center gap-x-5 text-center text-3xl"
									}
								>
									{person.linkedin ? (
										<Link
											className={
												"rounded-md p-1 shadow-2xl shadow-black"
											}
											style={{
												backgroundColor: mainColor,
											}}
											href={person.linkedin}
										>
											<Linkedin />
										</Link>
									) : null}
									{person.github ? (
										<Link
											className={
												"rounded-md p-1 shadow-2xl shadow-black"
											}
											style={{
												backgroundColor: mainColor,
											}}
											href={person.github}
										>
											<Github />
										</Link>
									) : null}
									{person.personal ? (
										<Link
											className={
												"rounded-md p-1 shadow-2xl shadow-black"
											}
											style={{
												backgroundColor: mainColor,
											}}
											href={person.personal}
										>
											<Instagram />
										</Link>
									) : null}
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
