import { auth, currentUser } from "@clerk/nextjs";
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
				<div>
					{/* <SettingsSection name="Settings" path="/settings" /> */}
					<SettingsSection name="Account" path="/settings/account" />
					<SettingsSection name="Profile" path="/settings/profile" />
				</div>
				<div className="col-span-4">{children}</div>
			</div>
		</>
	);
}
