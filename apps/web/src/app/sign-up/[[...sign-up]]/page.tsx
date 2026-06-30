import { SignUp } from "@clerk/nextjs";
import c from "config";
import RegisterClosed from "@/components/registration/RegistretionClosed";;

export default async function Page() {
	const registrationEnabled = c.registrationAvailable;

	if (registrationEnabled) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<SignUp fallbackRedirectUrl={"/register"} />
			</main>
		);
	}

	return ( <RegisterClosed />	);
}
