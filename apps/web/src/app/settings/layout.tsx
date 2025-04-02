import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import SettingsSection from "@/components/settings/SettingsSection";
import Navbar from "@/components/shared/Navbar";
import { Settings } from "lucide-react";
import ClientToast from "@/components/shared/ClientToast";
import { getUser } from "db/functions/user";

export default async function ({ children }: { children: ReactNode }) {
	const { userId } = await auth();
	const user = await currentUser();

	if (!user || !userId) {
		return redirect("/sign-in");
	}

	if ((await getUser(userId)) == undefined) {
		return redirect("/register");
	}

	return (
		<>
			<ClientToast />
			<Navbar />
			<div className="mx-auto grid max-w-5xl grid-cols-5 gap-x-3 pt-44">
				<div className="col-span-5 flex items-center">
					<div className="flex items-center pb-24">
						<div>
							<h2 className="flex items-center gap-x-2 text-3xl font-bold tracking-tight">
								<Settings />
								Settings
							</h2>
						</div>
					</div>
				</div>
				<aside className="sticky top-20 hidden h-screen md:block">
					<SettingsSection name="Account" path="/settings#account" />
					<SettingsSection name="Profile" path="/settings#profile" />
					<SettingsSection
						name="Registration"
						path="/settings#registration"
					/>
				</aside>
				<div className="col-span-4 mb-20 ml-5">{children}</div>
			</div>
		</>
	);
}
