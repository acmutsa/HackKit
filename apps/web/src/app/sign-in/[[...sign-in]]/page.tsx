import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<SignIn afterSignUpUrl={"/register"} afterSignInUrl={"/dash/"} />
		</div>
	);
}

export const runtime = "edge";