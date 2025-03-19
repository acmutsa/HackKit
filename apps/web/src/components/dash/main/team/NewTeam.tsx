"use client";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { zpostSafe } from "@/lib/utils/client/zfetch";
import { BasicServerValidator } from "@/validators/shared/basic";
import { useState, useTransition } from "react";
import { Shell } from "lucide-react";
import { useRouter } from "next/navigation";
import { newTeamValidator } from "@/validators/shared/team";
import c from "config";
import { put } from "@/lib/utils/client/file-upload";

export default function NewTeamForm() {
	const formValidator = newTeamValidator.merge(
		z.object({ photo: z.instanceof(File) }),
	);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formValidator>>({
		resolver: zodResolver(formValidator),
		defaultValues: {
			name: "",
			bio: "",
			tag: "",
			photo: new File([], ""),
		},
	});

	async function onSubmit(values: z.infer<typeof formValidator>) {
		setLoading(true);

		let teamPhotoURL: string | null = null;
		const photo = values.photo;

		if (photo) {
			// TODO: verify this works with the create team
			const url = await put(photo.name, photo, {
				presignHandlerUrl: "/api/upload/pfp",
			});
			teamPhotoURL = url;
		} else {
			teamPhotoURL = `https://api.dicebear.com/6.x/shapes/svg?seed=${encodeURIComponent(
				values.tag.toLowerCase(),
			)}`;
		}

		const res = await zpostSafe({
			url: "/api/team/create",
			vReq: newTeamValidator,
			vRes: BasicServerValidator,
			body: {
				bio: values.bio,
				name: values.name,
				tag: values.tag,
				photo: teamPhotoURL,
			},
		});

		if (!res.success) {
			return alert(
				`An unknown error occurred. Please try again later. If this is a continuous issue, please contact us at ${c.issueEmail}.`,
			);
		}
		if (!res.data.success) {
			console.log("error: ", res.data.message);
			return alert(res.data.message);
		}

		alert("Team Created Successfully! Redirecting to team page...");

		// Due to weirdness with next router we have to use a react transition here.

		startTransition(() => router.push("/dash/team"));
		startTransition(() => router.refresh());
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col justify-center gap-y-4"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Team Name</FormLabel>
							<FormControl>
								<Input
									className="dark:border-primary dark:bg-transparent dark:ring-offset-primary"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This will be the public display name of your
								team.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tag"
					render={({ field }) => (
						<FormItem>
							<FormLabel>TeamTag</FormLabel>
							<FormControl>
								<div className="flex">
									<div className="flex h-10 w-10 items-center justify-center rounded-l bg-primary text-lg font-light text-primary-foreground">
										~
									</div>
									<Input
										className="rounded-l-none dark:border-primary dark:bg-transparent dark:ring-offset-primary"
										{...field}
									/>
								</div>
							</FormControl>
							<FormDescription>
								This will be the public, unique identifier for
								your team.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="photo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Media</FormLabel>
							<FormControl>
								<Input
									accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
									type="file"
									className="cursor-pointer file:cursor-pointer file:text-primary dark:border-primary dark:bg-transparent dark:ring-offset-primary"
									onChange={(e) =>
										field.onChange(
											e.target.files
												? e.target.files[0]
												: null,
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<Textarea
									className="dark:border-primary dark:bg-transparent dark:ring-offset-primary"
									placeholder="We are team X building Y..."
									{...field}
								/>
							</FormControl>
							<FormDescription>This is optional.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{loading ? (
					<p className="flex items-center justify-center gap-x-1">
						Creating Team <Shell className="animate-spin" />
					</p>
				) : (
					<Button type="submit">Create Team</Button>
				)}
			</form>
		</Form>
	);
}
