import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return <SignIn afterSignUpUrl={"/dash/register"} afterSignInUrl={"/dash/"} />;
}
