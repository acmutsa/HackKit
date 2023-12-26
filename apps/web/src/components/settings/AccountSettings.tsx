"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";

export default function AccountSettings() {
	return (
		<main>
			<div className="border-2 border-muted rounded-lg py-10 px-5">
				<h2 className="font-semibold text-3xl pb-5">Personal Information</h2>
				<div className="max-w-[500px] space-y-4">
					<div>
						<Label htmlFor="firstname">First Name</Label>
						<Input className="mt-2" name="firstname" />
					</div>
					<div>
						<Label htmlFor="lastname">Last Name</Label>
						<Input className="mt-2" name="lastname" />
					</div>
					<Button className="mt-5">Update</Button>
				</div>
			</div>
		</main>
	);
}
