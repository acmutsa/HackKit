import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/shadcn/ui/button";
import { Suspense } from "react";
import Loading from "@/components/shared/Loading";
import { auth } from "@clerk/nextjs";

export default async function Page() {
	const { userId } = auth();

	return (
		<div className="w-full flex flex-col gap-y-2 items-center">
			<p>More here soon :)</p>
			<p>User ID: {userId}</p>
			<Suspense fallback={<Loading />}>
				<SignOutButton>
					<Button>Sign Out</Button>
				</SignOutButton>
			</Suspense>
		</div>
	);
}

export const runtime = "edge";
