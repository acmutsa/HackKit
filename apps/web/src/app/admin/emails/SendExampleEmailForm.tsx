"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
} from "@/components/shadcn/ui/select";
import { Label } from "@/components/shadcn/ui/label";
import { Button } from "@/components/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { sendExampleEmailAction } from "@/actions/email";
import { toast } from "sonner";

export default function SendExampleEmailForm() {
	const { executeAsync } = useAction(sendExampleEmailAction);
	async function handleSend() {
		const res = await executeAsync({ sendTo: "all" });
		if (res?.data?.success) {
			toast.success("Emails sent successfully", {
				position: "bottom-right",
			});
		} else {
			toast.error(res?.data?.error ?? "Emails failed to send.", {
				position: "bottom-right",
			});
		}
	}
	return (
		<div className="flex w-full items-end justify-between">
			<h3 className="text-xl font-bold">
				Send Example Email (Don't use in production)
			</h3>
			<div className="flex items-end gap-2">
				<div>
					<Label className="text-nowrap">Send to</Label>
					<Select defaultValue="all">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="rsvpedOnly">
									RSVP'd Users Only
								</SelectItem>
								<SelectItem value="notRsvpedOnly">
									un-RSVP'd Users Only
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<Button onClick={handleSend}>Send</Button>
			</div>
		</div>
	);
}
