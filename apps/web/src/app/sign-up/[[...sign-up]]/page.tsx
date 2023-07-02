import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return <SignUp afterSignUpUrl={"/dash/register"} afterSignInUrl={"/dash/"} />;
}
