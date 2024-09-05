"use client";

import { Button } from "@/components/shadcn/ui/button";

export default function RegistrationSettings() {

	return (
		<main>
			<div className="rounded-lg border-2 border-muted px-5 py-5">
				<div className={"mb-5"}>
					Registration data is only editable in the form. <i>Note: Some hackathons may not accept edited information as it is already in their database</i>
				</div>
				<Button variant={"secondary"}>Click here to go back to registration form</Button>
			</div>
		</main>
	);
}
