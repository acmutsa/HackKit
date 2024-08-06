import UserInfoSection from "@/components/admin/users/UserInfoSection";
import type { UserWithAllData } from "@/lib/utils/server/types";
import { titleCase } from "title-case";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { clerkClient } from "@clerk/nextjs";

export function PersonalInfo({ user }: { user: UserWithAllData }) {
	return (
		<UserInfoSection title="Personal Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="First Name" value={user.firstName} />
				<Cell title="Last Name" value={user.lastName} />
				<Cell
					title="Gender"
					value={titleCase(
						user.gender.toLowerCase(),
					)}
				/>
				<Cell title="Pronouns" value={user.pronouns} />
				<Cell title="Race" value={user.race} />
				<Cell
					title="Ethnicity"
					value={user.ethnicity}
				/>
				<Cell title="Age" value={user.age} />
			</div>
		</UserInfoSection>
	);
}

export function ProfileInfo({ user }: { user: UserWithAllData }) {
	return (
		<UserInfoSection title="Profile Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="Hacker Tag" value={`@${user.hackerTag}`} />
				<Cell title="Team" value={user.hackerData.team ? "Yes" : "No"} />
				<Cell
					title="Discord"
					value={user.discord}
				/>
				<Cell
					title="Linkedin"
					value={user.hackerData.LinkedIn || "N/A"}
				/>
				<Cell
					title="Github"
					value={user.hackerData.GitHub || "N/A"}
				/>
				<Cell
					title="Website"
					value={user.hackerData.PersonalWebsite || "N/A"}
				/>
				<Cell
					title="Profile is Searchable"
					value={user.isSearchable ? "Yes" : "No"}
				/>
			</div>
			<div className="flex flex-col gap-y-5 pt-5">
				<Cell title="Skills" value={"Coming soon..."} />
				<Cell title="Bio" value={user.bio} />
			</div>
		</UserInfoSection>
	);
}

export async function AccountInfo({ user }: { user: UserWithAllData }) {
	const clerkUser = await clerkClient.users.getUser(user.clerkID);
	if (!clerkUser) return null;

	// const signInMethods = clerkUser.externalAccounts.map((account) =>
	// 	titleCase(account.provider.split("_").slice(-1)[0])
	// );

	// if (clerkUser.passwordEnabled) {
	// 	signInMethods.push("Password");
	// }

	return (
		<UserInfoSection title="Account Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="Email" value={user.email} />
				<Cell title="Clerk ID" value={user.clerkID} />
				{/* <Cell
					title={`Sign-in Method${signInMethods.length > 1 ? "s" : ""}`}
					value={signInMethods.join(", ")}
				/> */}
			</div>
		</UserInfoSection>
	);
}

export function TeamInfo({ user }: { user: UserWithAllData }) {
	return (
		<UserInfoSection title="Team Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5 pb-5">
				<Cell title="Is in Team" value={user.hackerData.team ? "Yes" : "No"} />
				{user.hackerData.team ? (
					<>
						<Cell title="Team Name" value={user.hackerData.team.name} />
						<Cell title="Team Tag" value={`~${user.hackerData.team.tag}`} />
						<Cell
							title="Is owner"
							value={
								user.hackerData.team.ownerID === user.clerkID
									? "Yes"
									: "No"
							}
						/>
					</>
				) : null}
			</div>
			{user.hackerData.team ? (
				<Link href={`/~${user.hackerData.team.tag}`}>
					<Button>View Team</Button>
				</Link>
			) : null}
		</UserInfoSection>
	);
}

function Cell({
	title,
	value,
}: {
	title: string;
	value: string | number | boolean;
}) {
	return (
		<div>
			<p className="whitespace-nowrap font-bold">{title}</p>
			<p className="whitespace-nowrap">{value.toString()}</p>
		</div>
	);
}

export const runtime = "edge";
