import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AuthForm } from "../sign-in/auth-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
	const session = await getAuthSession();
	if (session) redirect("/onboarding/hacktag");

	return (
		<main className="min-h-screen bg-muted/30 px-6 py-10">
			<div className="mx-auto max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<p className="text-sm font-medium text-primary">HackKit UI test app</p>
					<h1 className="text-3xl font-bold tracking-tight">Sign up</h1>
					<p className="text-muted-foreground">
						Create an account, then complete registration.
					</p>
				</div>
				<AuthForm mode="sign-up" />
			</div>
		</main>
	);
}
