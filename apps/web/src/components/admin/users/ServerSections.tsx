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
				<Cell title="Gender" value={titleCase(user.registrationData.gender.toLowerCase())} />
				<Cell title="Pronouns" value={user.profileData.pronouns} />
				<Cell title="Race" value={user.registrationData.race} />
				<Cell title="Ethnicity" value={user.registrationData.ethnicity} />
				<Cell title="Age" value={user.registrationData.age} />
			</div>
		</UserInfoSection>
	);
}

export function ProfileInfo({ user }: { user: UserWithAllData }) {
	return (
		<UserInfoSection title="Profile Info">
			<div className="flex flex-wrap gap-x-10 gap-y-5">
				<Cell title="Hacker Tag" value={`@${user.hackerTag}`} />
				<Cell title="Team" value={user.teamID ? "Yes" : "No"} />
				<Cell title="Discord" value={user.profileData.discordUsername} />
				<Cell title="Linkedin" value={user.registrationData.LinkedIn || "N/A"} />
				<Cell title="Github" value={user.registrationData.GitHub || "N/A"} />
				<Cell title="Website" value={user.registrationData.PersonalWebsite || "N/A"} />
				<Cell title="Profile is Searchable" value={user.hasSearchableProfile ? "Yes" : "No"} />
			</div>
			<div className="pt-5 flex flex-col gap-y-5">
				<Cell title="Skills" value={"Coming soon..."} />
				<Cell title="Bio" value={user.profileData.bio} />
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
				<Cell title="Is in Team" value={user.team ? "Yes" : "No"} />
				{user.team ? (
					<>
						<Cell title="Team Name" value={user.team.name} />
						<Cell title="Team Tag" value={`~${user.team.tag}`} />
						<Cell title="Is owner" value={user.team.ownerID === user.clerkID ? "Yes" : "No"} />
					</>
				) : null}
			</div>
			{user.team ? (
				<Link href={`/~${user.team.tag}`}>
					<Button>View Team</Button>
				</Link>
			) : null}
		</UserInfoSection>
	);
}

function Cell({ title, value }: { title: string; value: string | number | boolean }) {
	return (
		<div>
			<p className="font-bold whitespace-nowrap">{title}</p>
			<p className="whitespace-nowrap">{value.toString()}</p>
		</div>
	);
}

export const runtime = "edge";
