import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { getHackerByTag } from "db/functions";

function ProfileField({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="border-b border-black">
			<span className="font-bold">{label}:</span> <span>{value}</span>
		</div>
	);
}

export default async function ({ params }: { params: { tag: string } }) {
	if (!params.tag || params.tag.length <= 1) return notFound();

	const user = await getHackerByTag(params.tag);
	if (!user) return notFound();

	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-[800px]">
				<div className="flex w-full items-center justify-center py-[12vw] sm:py-[3vw] md:py-[5vw] [container-type:inline-size]">
					<div className="bg-[#E2DDD4] p-[5%] text-black w-[90%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]">

						<div className="w-full h-auto flex flex-col gap-6">

							<div className="relative w-[10%]">
								<Image
									width={64}
									height={64}
									src="/img/assets/profile/agency.png"
									alt="Central Intelligence Agency"
									className="contain"
								/>
							</div>

							<h1 className="break-all text-xl font-bold sm:text-lg">
								#hdbiwefh-0390128r9uedhfc923839r823h
							</h1>

							<div className="w-full h-auto grid grid-cols-1 md:grid-cols-5 gap-2">
								<div className="col-span-2 relativ w-[60%] md:w-[100%]  h-auto flex justify-center item-center">
									<img
										src="/img/assets/profile/profile-picture.png"
										alt={`@${user.hackerTag}'s Profile Photo`}
										className="h-auto w-full"
									/>
								</div>

								<div className="col-span-3 flex flex-col gap-2">
									<ProfileField
										label="Name"
										value={`${user.firstName} ${user.lastName}`}
									/>
									<ProfileField
										label="Pronouns"
										value={user.pronouns}
									/>
									<ProfileField label="Email" value={user.email} />
									<ProfileField
										label="Phone"
										value={user.phoneNumber}
									/>
									<ProfileField
										label="Country of residence"
										value={user.countryOfResidence}
									/>
									<ProfileField
										label="Age"
										value={user.age}
									/>
									<ProfileField
										label="Hack Tag"
										value={`@${user.hackerTag}`}
									/>

								</div>
							</div>

							<div className="w-full h-auto flex flex-col gap-4">
								<h3 className="w-full text-xl text-start font-bold uppercase">
									Finger Prints:
								</h3>
								<div className="relative w-[80%]">
									<img
										src="/img/assets/profile/finger-prints.png"
										alt="Fingerprints"
										className="h-auto w-full"
									/>
								</div>
							</div>

						</div>

					</div>

				</div>
			</main>
		</>
	);
}
