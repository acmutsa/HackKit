import c from "config";
import RegisterForm from "@/components/registration/RegisterForm";
import RegisterClosed from "@/components/registration/RegistretionClosed";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { getUser } from "db/functions";
import { Manuale, Shadows_Into_Light } from "next/font/google";

const manuale = Manuale({
    subsets: ["latin"],
    display: "swap",
});
const shadow = Shadows_Into_Light({
    subsets: ["latin"],
    weight: "400",
});

export default async function Page() {

	const registrationEnabled = c.registrationAvailable;

	if (registrationEnabled) {

		const { userId } = await auth();
		if (!userId) return redirect("/sign-up");

		const user = await currentUser();
		if (!user) return redirect("/sign-up");

		const registration = await getUser(userId);
		if (registration) return redirect("/dash");

		return (
			<>
				<Navbar />
				<main className="overflow-x-hidden bg-transparent flex items-center justify-center px-4">
					<div className="h-auto max-w-5xl my-5 rounded-[3px] bg-card px-10 py-20 shadow-[-2px_10px_8px_rgba(0,0,0,0.28)] drop-shadow-[10px_14px_7px_rgba(0,0,0,0.45)]">
						<p className={` text-end pb-[5%] pr-[10%] text-md text-[#AC1903] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl rotate-[8deg]  text-hackathon ${shadow.className} w-full`}>
							Case File · {c.hackathonName} 
						</p>
						<h1 className={`font-black  text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl leading-tight ${manuale.className}`}>
							Register
						</h1>
						<p className={`mt-5 font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl  ${manuale.className}`} >
							<span className="font-bold">Welcome Hacker!</span>{" "}
							Please fill out the form below to complete your
							registration for {c.hackathonName}.
						</p>
						<p className={`pb-10 pt-5 font-light text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl  ${manuale.className}`}>
							Psttt... Running into a issue? Please let us know on{" "}
							<Link className="underline text-[#AC1903]" href={c.links.discord}>
								Discord
							</Link>
							!
						</p>
						<RegisterForm
							defaultEmail={
								user.emailAddresses[0]?.emailAddress || ""
							}
						/>
					</div>
				</main>
			</>
		);
	}

	return ( <RegisterClosed />	);
}
