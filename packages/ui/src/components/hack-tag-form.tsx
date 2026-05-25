"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { claimHackTagSchema, type User } from "@hackkit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useHackKitUI } from "../provider";
import { cn } from "../lib/cn";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const hackTagFormSchema = claimHackTagSchema.omit({ authId: true });

export type HackTagFormValues = z.infer<typeof hackTagFormSchema>;

export type HackTagFormProps = {
	currentUser: User;
	defaultValues?: Partial<HackTagFormValues>;
	successRedirectTo?: string;
	className?: string;
};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-sm font-medium text-destructive">{message}</p>;
}

export function HackTagForm({
	currentUser,
	defaultValues,
	successRedirectTo = "/onboarding/user-data",
	className,
}: HackTagFormProps) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const form = useForm<HackTagFormValues>({
		resolver: zodResolver(hackTagFormSchema),
		defaultValues: {
			hackTag: defaultValues?.hackTag ?? currentUser.hackTag ?? "",
		},
	});

	async function onSubmit(values: HackTagFormValues) {
		const result = await actions.claimHackTag(values);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		toast.success("HackTag claimed.");
		router.push(successRedirectTo);
	}

	return (
		<Card className={cn("w-full max-w-xl", className)}>
			<CardHeader>
				<CardTitle>Claim your HackTag</CardTitle>
				<CardDescription>
					Choose a public handle for {currentUser.firstName}{" "}
					{currentUser.lastName}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="space-y-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="space-y-2">
						<Label htmlFor="hackTag">HackTag</Label>
						<Input
							id="hackTag"
							placeholder="your-handle"
							autoComplete="off"
							{...form.register("hackTag")}
						/>
						<FieldError
							message={form.formState.errors.hackTag?.message}
						/>
					</div>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting
							? "Saving..."
							: "Claim HackTag"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
