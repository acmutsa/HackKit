import { UserDataForm, toUserDataFormDefaultValues } from "@hackkit/ui";

export const dynamic = "force-dynamic";
import { getCurrentUser, hackkit } from "@/lib/hackkit";

export default async function HomePage() {
	const currentUser = await getCurrentUser();
	const existingUserData = await hackkit.userData.getUserData(
		currentUser.authId,
	);

	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto flex max-w-3xl flex-col gap-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">
						HackKit UI test app
					</p>
					<h1 className="text-3xl font-bold tracking-tight">
						User Data form
					</h1>
					<p className="text-muted-foreground">
						This page creates a HackKit instance, resolves
						Core-owned User Data Options, and plugs them into
						@hackkit/ui.
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
