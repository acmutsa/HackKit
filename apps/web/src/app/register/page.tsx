import c from "@/hackkit.config";
import RegisterForm from "@/components/registration/RegisterForm";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page() {
	const user = await currentUser();

	if (!user) return <div>Not logged in</div>;

	const registration = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (registration) {
		return redirect("/dash");
	}

	return (
		<main className="dark:bg-zinc-950">
			<div className="mx-auto min-h-screen max-w-5xl pb-10 pt-[20vh] font-sans dark:text-white">
				<h1 className="text-8xl font-black">Register</h1>
				<p className="mb-10 mt-5 font-medium">
					<span className="font-bold">Welcome Hacker!</span> Please fill out the form below to
					complete your registration for {c.hackathonName}.
				</p>
				<RegisterForm defaultEmail={user.emailAddresses[0]?.emailAddress || ""} />
			</div>
		</main>
	);
}

export const runtime = "edge";
