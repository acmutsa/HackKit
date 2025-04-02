import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<SignIn fallbackRedirectUrl={"/dash/"} />
		</div>
	);
}

export const runtime = "edge";
