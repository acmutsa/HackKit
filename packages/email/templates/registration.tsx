import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";
import c from "config";

interface VercelInviteUserEmailProps {
	firstName: string;
	lastName: string;
	hackertag: string;
	email: string;
}

const baseUrl = process.env.VERCEL_ENV != "development" ? c.siteUrl : "";

export const RegistrationSuccessEmail = ({
	firstName = "Hacker",
	lastName = "Person",
	hackertag = "thehacker",
	email = "name@example.com",
}: VercelInviteUserEmailProps) => {
	const previewText = `You're registered for ${c.hackathonName} ${c.itteration}! We look forward to seeing you there!`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Section className="mt-[32px]">
							<Img
								src={`${baseUrl}${c.icon.svg}`}
								width="80"
								height="80"
								alt="Vercel"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							You're Registered for{" "}
							{`${c.hackathonName} ${c.itteration}!`}
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Hey there {firstName}!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							<strong>
								You are now registered for{" "}
								{`${c.hackathonName} ${c.itteration}`}!
							</strong>{" "}
							We can't wait to see you at the event!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							A few quick notes:
						</Text>

						<ul>
							<li className="">
								<Text>
									Make sure your profile info is correct! If
									there are any issues, you can modify them in
									your profile settings or email us at{" "}
									{c.issueEmail}.
								</Text>
							</li>
							<li>
								<Text>
									Be on the lookout for RSVP emails! We'll
									send them out as we get closer to the event.
								</Text>
							</li>
							<li>
								<Text>
									<strong>
										Lastly, join us over on{" "}
										<Link
											href={c.links.discord}
											className="underline"
										>
											Discord
										</Link>
										!
									</strong>{" "}
									We'll be sharing more information there as
									we get closer to the event.
								</Text>
							</li>
						</ul>

						<Section>
							<Container className="border border-solid border-[#eaeaea] px-5">
								<Text>
									For your reference, here is your
									registration information:
								</Text>
								<Text>
									<strong>First Name:</strong> {firstName}
									<br />
									<strong>HackerTag:</strong> {hackertag}
									<br />
									<strong>Email:</strong> {email}
									<br />
									<strong>Registration Date:</strong>{" "}
									{new Date().toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</Text>
							</Container>
						</Section>
						<Section className="mb-[32px] mt-[32px] text-center">
							<Button
								className="mr-2 rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={c.siteUrl + "/dash"}
							>
								Visit the Dashboard
							</Button>
							<Button
								className="ml-2 rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={c.links.discord}
							>
								Join the Discord
							</Button>
						</Section>
						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
						<Text className="text-center text-[12px] leading-[24px] text-[#666666]">
							This email was intended for {firstName} {lastName}{" "}
							(@{hackertag}). If you did not expect to recieve
							this email please ignore it.
							<br />
							<br />
							This inbox is unmointored. If you have any questions
							or issues, please contact {c.issueEmail}.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default RegistrationSuccessEmail;
