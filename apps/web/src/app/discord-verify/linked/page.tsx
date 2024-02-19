import c from "config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { CheckCircleIcon } from "lucide-react";

export default function Page() {
	return (
		<main className="min-h-screen w-screen flex items-center justify-center">
			<div className="aspect-square border border-muted w-full px-5 max-w-[500px] rounded-xl flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold mb-4">Discord Verification</h1>
				<p className="text-center mb-8">
					<Balancer>
						<h1 className="flex items-center gap-x-2 font-bold text-2xl text-green-500">
							<CheckCircleIcon />
							Your Discord account is Linked!
						</h1>
						<br />
						To unlink, go to your {c.hackathonName} account settings to unlink before linking a new
						one.
					</Balancer>
				</p>
				<Link href="/settings">
					<Button>Account Settings</Button>
				</Link>
			</div>
		</main>
	);
}

export const runtime = "edge";
