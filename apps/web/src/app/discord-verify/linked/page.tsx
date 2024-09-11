import c from "config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";

export default function Page() {
	return (
		<main className="flex min-h-screen w-screen items-center justify-center">
			<div className="flex aspect-square w-full max-w-[500px] flex-col items-center justify-center rounded-xl border border-muted px-5">
				<h1 className="mb-4 text-3xl font-bold">
					Discord Verification
				</h1>
				<h1 className="flex items-center gap-x-2 text-center text-2xl font-bold text-green-500">
					<CheckCircleIcon />
					Your Discord account is Linked!
				</h1>
				<br />
				<p className="mb-8 text-center">
					To unlink, go to your {c.hackathonName} account settings to
					unlink before linking a new one.
				</p>
				<Link href="/settings/account">
					<Button>Account Settings</Button>
				</Link>
			</div>
		</main>
	);
}

export const runtime = "edge";
