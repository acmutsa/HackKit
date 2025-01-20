"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { modifyAccountSettings } from "@/actions/user-profile-mod";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Loader2 } from "lucide-react";
import { isProfane } from "no-profanity";
import { modifyAccountSettingsSchema } from "@/validators/settings";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "../shadcn/ui/form";

type UserProps = z.infer<typeof modifyAccountSettingsSchema>;

export default function AccountSettings({
	user,
	email,
}: {
	user: UserProps;
	email: string;
}) {
	const form = useForm<UserProps>({
		resolver: zodResolver(modifyAccountSettingsSchema),
		defaultValues: {
			...user,
		},
	});

	const { execute: runModifyAccountSettings, status: loadingState } =
		useAction(modifyAccountSettings, {
			onSuccess: ({ data }) => {
				toast.dismiss();
				if (!data?.success) {
					if (data?.message == "hackertag_not_unique") {
						toast.error(
							`Hackertag '${form.getValues("hackerTag")}' already exists`,
						);
						form.setError("hackerTag", {
							message: "Hackertag already exists",
						});
						form.setValue("hackerTag", user.hackerTag);
					}
				} else {
					toast.success("Account updated successfully!", {
						duration: 1500,
					});
					form.reset({
						...form.getValues(),
					});
				}
			},
			onError: () => {
				toast.dismiss();
				toast.error(
					"An error occurred while updating your account settings!",
				);
			},
		});

	function handleSubmit(data: UserProps) {
		toast.dismiss();
		console.log("form is dirty", form.formState.dirtyFields);
		console.log(form.formState.isDirty);
		if (!form.formState.isDirty) {
			toast.error("Please change something before updating");
			return;
		}
		runModifyAccountSettings(data);
	}

	return (
		<main>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="rounded-lg border-2 border-muted px-5 py-10">
						<h2 className="pb-5 text-3xl font-semibold">
							Personal Information
						</h2>
						<div className="grid max-w-[600px] gap-x-2 gap-y-5 md:grid-cols-2">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormItem className="flex flex-col md:col-span-2">
								<FormLabel>Email</FormLabel>
								<Input value={email} disabled />
								<FormDescription>
									This field cannot be changed.
								</FormDescription>
							</FormItem>
						</div>
						<h2 className="pb-5 pt-7 text-3xl font-semibold">
							Public Information
						</h2>
						<div className="grid max-w-[500px] grid-cols-1 gap-x-2 gap-y-4">
							<FormField
								control={form.control}
								name="hackerTag"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Hacker Tag</FormLabel>
										<FormControl>
											<div className="mt-2 flex">
												<div className="flex h-10 w-10 items-center justify-center rounded-l bg-accent text-lg font-light text-primary">
													@
												</div>
												<Input
													placeholder="shadcn"
													className="rounded-l-none"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isSearchable"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Make my profile searchable by
												other hackers
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>
						</div>
						<Button
							className="mt-5"
							type="submit"
							disabled={loadingState === "executing"}
						>
							{loadingState === "executing" ? (
								<>
									<Loader2
										className={"mr-2 h-4 w-4 animate-spin"}
									/>
									<div>Updating</div>
								</>
							) : (
								"Update"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</main>
	);
}
