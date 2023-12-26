import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import SettingsSection from "@/components/settings/SettingsSection";
import Navbar from "@/components/shared/Navbar";
import { FaGear } from "react-icons/fa6";

export default async function ({ children }: { children: ReactNode }) {
	const { userId } = await auth();

	if (!userId) return redirect("/sign-in");

	return (
		<>
			<Navbar />
			<div className="max-w-5xl mx-auto grid grid-cols-5 gap-x-3 pt-44">
				<div className="col-span-5 flex items-center">
					<div className="flex items-center pb-24">
						<div>
							<h2 className="text-3xl font-bold tracking-tight flex items-center gap-x-2">
								<FaGear />
								Settings
							</h2>
						</div>
					</div>
				</div>
				<div>
					<SettingsSection name="Settings" path="/settings" />
					<SettingsSection name="Account" path="/settings/account" />
					<SettingsSection name="Profile" path="/settings/profile" />
				</div>
				<div className="col-span-4">{children}</div>
			</div>
		</>
	);
}
