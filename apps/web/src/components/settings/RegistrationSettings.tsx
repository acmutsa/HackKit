"use client";

import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function RegistrationSettings() {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-5">
				<div className={"mb-5"}>
					Registration data is only editable in the form.{" "}
					<i>
						Note: Some hackathons may not accept edited information
						as it is already in their database
					</i>
				</div>
				<Button
					variant={"secondary"}
					asChild
					disabled={isLoading}
					onClick={() => setIsLoading(true)}
				>
					{isLoading ? (
						<div className={"flex"}>
							<Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
							<div>Please wait...</div>
						</div>
					) : (
						<Link href={"/settings/registration"}>
							Click here to go back to registration form
						</Link>
					)}
				</Button>
			</div>
		</main>
	);
}
