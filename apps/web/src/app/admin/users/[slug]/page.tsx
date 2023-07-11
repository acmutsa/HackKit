import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Button } from "@/components/shadcn/ui/button";
import { titleCase } from "title-case";
import c from "@/hackkit.config";

export default async function Page({ params }: { params: { slug: string } }) {
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, params.slug),
		with: {
			profileData: true,
			registrationData: true,
		},
	});

	if (!user) {
		return <p className="text-center font-bold">User Not Found</p>;
	}

	return (
		<div className="mx-auto w-full max-w-7xl overflow-x-hidden">
			<div className="grid grid-cols-2 rounded-lg border border-muted p-2">
				<div className="rounded-xl flex items-center">
					<Image
						src={user.profileData.profilePhoto}
						alt={`${user.firstName} ${user.lastName}'s Profile Photo`}
						height={50}
						width={50}
						className="rounded-full"
					/>
					<div className="col-span-2 flex flex-col justify-center px-2 border-r-muted-foreground border-r">
						<h1 className="text-2xl font-semibold leading-none">
							{user.firstName} {user.lastName}
						</h1>
						<h2 className="text-muted-foreground">@{user.hackerTag}</h2>
					</div>
					<div className="text-sm pl-2">
						<p>
							<span className="font-bold">Account ID:</span> {user.clerkID}
						</p>
						<p>
							<span className="font-bold">{c.localUniversityShortIDName}:</span>{" "}
							{user.registrationData.shortID}
						</p>
					</div>
				</div>
				<div className="flex justify-end items-center w-full gap-x-2">
					<Button>Copy Email</Button>
					<Button>Copy Discord</Button>
					<Button>Check-in</Button>
				</div>
			</div>

			<div className="border-muted border rounded-lg mt-2 grid grid-cols-5 gap-x-2 gap-y-4 p-5">
				{Object.entries(user.registrationData).map(([key, value]) => {
					if (key === "clerkID" || key === "accommodationNote" || key === "dietRestrictions")
						return null;

					let valToRender = "";

					if (key === "university") {
						valToRender = titleCase(value as string);
					} else {
						valToRender = typeof value === "string" ? value : JSON.stringify(value);
						valToRender = valToRender.length > 0 ? valToRender : "None";
					}

					return (
						<div className="text-sm" key={key}>
							<h3 className="font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
							<p>{valToRender}</p>
						</div>
					);
				})}
			</div>
			<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
				<div className="border-red-900 rounded-lg border p-5">
					<p className="font-bold">Dietary Restriction:</p>
					<p>
						{(user.registrationData.dietRestrictions as string[]).join(", ").length > 0
							? (user.registrationData.dietRestrictions as string[]).join(", ")
							: "None"}
					</p>
					<p className="font-bold mt-4">Accomodation Note:</p>
					<p>
						{user.registrationData.accommodationNote &&
						user.registrationData.accommodationNote.length > 0
							? user.registrationData.accommodationNote
							: "None"}
					</p>
				</div>
			</div>
		</div>
	);
}

export const runtime = "edge";
