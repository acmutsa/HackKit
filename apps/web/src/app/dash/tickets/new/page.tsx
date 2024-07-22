"use client";
import { useState } from "react";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { Button } from "@/components/shadcn/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function Page() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const createTicket = api.tickets.create.useMutation();

	async function runCreateTicket() {
		if (title.length > 3 && description.length > 10) {
			const result = await createTicket.mutateAsync({
				title,
				description,
			});
			if (result.success) {
				toast.success("Ticket created successfully!");
				console.log(
					"created ticket with ID " +
						result.ticketID +
						"  and chat with ID " +
						result.chatID,
				);
			}
		} else {
			toast.error(
				"Your title or description is too short! Please try again.",
			);
		}
	}

	return (
		<div className="h-full pt-20">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-3xl font-black">New Ticket</h1>
				<div className="flex flex-col items-start gap-y-5 pt-10">
					<div className="w-full">
						<Label className="pb-2">Title</Label>
						<Input onChange={(e) => setTitle(e.target.value)} />
					</div>
					<div className="w-full">
						<Label className="mb-1">Description</Label>
						<Textarea
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<Button onClick={() => runCreateTicket()}>
						Create Ticket
					</Button>
				</div>
			</div>
		</div>
	);
}
