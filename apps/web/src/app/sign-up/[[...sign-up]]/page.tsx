import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<SignUp afterSignUpUrl={"/register"} afterSignInUrl={"/dash/"} />
		</div>
	);
}

export const runtime = "edge";
