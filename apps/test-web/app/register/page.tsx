import { UserDataForm, toUserDataFormDefaultValues } from "@hackkit/ui";
import { getCurrentUser, getHackkit } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
	const currentUser = await getCurrentUser();
	const hackkit = await getHackkit();
	const existingUserData = await hackkit.userData.getUserData(
		currentUser.authId,
	);

	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto flex max-w-3xl flex-col gap-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">HackKit UI test app</p>
					<h1 className="text-3xl font-bold tracking-tight">Register</h1>
					<p className="text-muted-foreground">
						Complete your required User Data for this HackKit-managed hackathon.
					</p>
				</div>

				<UserDataForm
					currentUser={currentUser}
					userDataOptions={hackkit.userData.options}
					defaultValues={
						existingUserData
							? toUserDataFormDefaultValues(existingUserData)
							: undefined
					}
				/>
			</div>
		</main>
	);
}
