"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { useState } from "react";
import { zpostSafe } from "@/lib/utils/client/zfetch";
import { newInviteValidator } from "@/validators/shared/team";
import { BasicServerValidator } from "@/validators/shared/basic";
import c from "config";
import { toast } from "sonner";

export default function TeamInvite() {
	const [hackerTag, setHackerTag] = useState<string | null>(null);

	async function createInvite() {
		if (!hackerTag || hackerTag.length <= 1) return alert("Please enter a valid HackerTag.");
		const tagToPost = hackerTag.startsWith("@") ? hackerTag.slice(1) : hackerTag;
		const res = await zpostSafe({
			url: "/api/team/invite/create",
			vReq: newInviteValidator,
			vRes: BasicServerValidator,
			body: {
				inviteeTag: tagToPost,
			},
		});
		if (!res.success) {
			return alert(
				`An unknown error occured. Please try again later. If this issue persists, please contact ${c.issueEmail}.`
			);
		}
		if (!res.data.success) return alert(res.data.message);
		toast.success("Invite sent successfully!");
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-1" />
					Invite Members
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Invite Members</DialogTitle>
					<DialogDescription>Invite members to your team using their HackerTag.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							HackerTag
						</Label>
						<Input
							onChange={(e) => setHackerTag(e.target.value)}
							id="name"
							placeholder="@HackerTag"
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => createInvite()} type="submit">
						Invite
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
