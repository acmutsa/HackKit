import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/shadcn/ui/button";

export default async function Page() {
	return (
		<div className="h-screen w-full flex flex-col gap-y-2 items-center justify-center">
			<p>More here soon :)</p>
			<SignOutButton>
				<Button>Sign Out</Button>
			</SignOutButton>
		</div>
	);
}

export const runtime = "edge";
