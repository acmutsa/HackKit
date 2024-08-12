"use client";
import { useForm } from "react-hook-form";
import {
	Form,
	FormItem,
	FormControl,
	FormDescription,
	FormMessage,
	FormLabel,
	FormField,
} from "@/components/shadcn/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/shadcn/ui/select";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { z } from "zod";
import { RegisterFormValidator } from "@/validators/shared/RegisterForm";
import { zodResolver } from "@hookform/resolvers/zod";
import FormGroupWrapper from "./FormGroupWrapper";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import Link from "next/link";
import c, { schools, majors } from "config";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/shadcn/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/client/cn";
import { useEffect, useCallback, useState } from "react";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { zpostSafe } from "@/lib/utils/client/zfetch";
import { useAuth } from "@clerk/nextjs";
import { BasicServerValidator } from "@/validators/shared/basic";
import { useRouter } from "next/navigation";
import { FileRejection, useDropzone } from "react-dropzone";
import { put, type PutBlobResult } from "@vercel/blob";
import { Tag, TagInput } from "@/components/shadcn/ui/tag/tag-input";
import CreatingRegistration from "./CreatingRegistration";

interface RegisterFormProps {
	defaultEmail: string;
}

export default function RegisterForm({ defaultEmail }: RegisterFormProps) {
	const { isLoaded, userId } = useAuth();
	const router = useRouter();

	const form = useForm<z.infer<typeof RegisterFormValidator>>({
		resolver: zodResolver(RegisterFormValidator),
		defaultValues: {
			email: defaultEmail,
			hackathonsAttended: 0,
			dietaryRestrictions: [],
			profileIsSearchable: true,
			bio: "",
			wantsToReceiveMLHEmails: false,
			// The rest of these are default values to prevent the controller / uncontrolled input warning from React
			acceptsMLHCodeOfConduct: false,
			shareDataWithMLH: false,
			accommodationNote: "",
			firstName: "",
			lastName: "",
			age: 0,
			ethnicity: "" as any,
			gender: "" as any,
			major: "",
			github: "",
			hackerTag: "",
			heardAboutEvent: "" as any,
			levelOfStudy: "" as any,
			linkedin: "",
			personalWebsite: "",
			profileDiscordName: "",
			pronouns: "",
			race: "" as any,
			shirtSize: "" as any,
			shortID: "",
			university: "",
		},
	});

	const { isSubmitSuccessful, isSubmitted, errors } = form.formState;

	const hasErrors = !isSubmitSuccessful && isSubmitted;

	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [skills, setSkills] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const universityValue = form.watch("university");
	const bioValue = form.watch("bio");

	useEffect(() => {
		if (universityValue != c.localUniversityName.toLowerCase()) {
			form.setValue("shortID", "NOT_LOCAL_SCHOOL");
		} else {
			form.setValue("shortID", "");
		}
	}, [universityValue]);

	async function onSubmit(data: z.infer<typeof RegisterFormValidator>) {
		setIsLoading(true);
		if (!userId || !isLoaded) {
			setIsLoading(false);
			return alert(
				`Auth has not loaded yet. Please try again! If this is a repeating issue, please contact us at ${c.issueEmail}.`,
			);
		}

		if (
			data.acceptsMLHCodeOfConduct !== true ||
			data.shareDataWithMLH !== true
		) {
			setIsLoading(false);
			return alert(
				"You must accept the MLH Code of Conduct and Privacy Policy to continue.",
			);
		}

		let resume: string = c.noResumeProvidedURL;

		if (uploadedFile) {
			const fileLocation = `${c.hackathonName}/resume/${uploadedFile.name}`;
			const newBlob = await put(fileLocation, uploadedFile, {
				access: "public",
				handleBlobUploadUrl: "/api/upload/resume/register",
			});
			resume = newBlob.url;
		}

		const res = await zpostSafe({
			url: "/api/registration/create",
			body: { ...data, resume },
			vRes: BasicServerValidator,
		});

		if (res.success) {
			if (res.data.success) {
				alert(
					"Registration successfully created! Redirecting to the dashboard.",
				);
				router.push("/dash");
			} else {
				if (res.data.message == "hackertag_not_unique") {
					setIsLoading(false);
					return alert(
						"The HackerTag you chose has already been taken. Please change it and then resubmit the form.",
					);
				}
				setIsLoading(false);
				return alert(
					`Registration not created. Error message: \n\n ${res.data.message} \n\n Please try again. If this is a continuing issue, please reach out to us at ${c.issueEmail}.`,
				);
			}
		} else {
			setIsLoading(false);
			return console.log(
				`Recieved a unexpected response from the server. Please try again. If this is a continuing issue, please reach out to us at ${c.issueEmail}.`,
			);
		}
	}

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				alert(
					`The file you uploaded was rejected with the reason "${fileRejections[0].errors[0].message}". Please try again.`,
				);
			}
			if (acceptedFiles.length > 0) {
				setUploadedFile(acceptedFiles[0]);
			}
		},
		[],
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: { "application/pdf": [".pdf"] },
		maxSize: c.maxResumeSizeInBytes,
		noClick: uploadedFile != null,
		noDrag: uploadedFile != null,
	});

	if (isLoading) {
		return <CreatingRegistration />;
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormGroupWrapper title="General">
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-0">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Some"
												{...field}
											/>
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
											<Input
												placeholder="One"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												readOnly={
													defaultEmail.length > 0
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-7 md:gap-y-0">
							<FormField
								control={form.control}
								name="age"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Age</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a Gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="MALE">
														Male
													</SelectItem>
													<SelectItem value="FEMALE">
														Female
													</SelectItem>
													<SelectItem value="NON-BINARY">
														Non-binary
													</SelectItem>
													<SelectItem value="OTHER">
														Other
													</SelectItem>
													<SelectItem value="PREFERNOTSAY">
														Prefer not to say
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="race"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Race</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a Race" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Native American">
														Native American
													</SelectItem>
													<SelectItem value="Asian / Pacific Islander">
														Asian / Pacific Islander
													</SelectItem>
													<SelectItem value="Black or African American">
														Black or African
														American
													</SelectItem>
													<SelectItem value="White / Caucasion">
														White / Caucasion
													</SelectItem>
													<SelectItem value="Multiple / Other">
														Multiple / Other
													</SelectItem>
													<SelectItem value="Prefer not to say">
														Prefer not to say
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="ethnicity"
								render={({ field }) => (
									<FormItem className="col-span-2">
										<FormLabel>Ethnicity</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full placeholder:text-muted-foreground">
													<SelectValue placeholder="Select a Ethnicity" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Hispanic or Latino">
														Hispanic or Latino
													</SelectItem>
													<SelectItem value="Not Hispanic or Latino">
														Not Hispanic or Latino
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="MLH">
						<FormField
							control={form.control}
							name="acceptsMLHCodeOfConduct"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											I accept the{" "}
											<Link
												target="_blank"
												className="underline"
												href={
													"https://mlh.io/code-of-conduct"
												}
											>
												MLH Code of Conduct
											</Link>
										</FormLabel>
										<FormDescription>
											This is required of all attendees.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="shareDataWithMLH"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											I authorize you to share my
											application/registration information
											with Major League Hacking for event
											administration, ranking, and MLH
											administration in-line with the MLH
											Privacy Policy. I further agree to
											the terms of both the{" "}
											<Link
												target="_blank"
												className="underline"
												href={
													"https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
												}
											>
												MLH Contest Terms and Conditions
											</Link>{" "}
											and the{" "}
											<Link
												target="_blank"
												className="underline"
												href={"https://mlh.io/privacy"}
											>
												MLH Privacy Policy
											</Link>
											.
										</FormLabel>
										<FormDescription>
											This is required of all attendees.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="wantsToReceiveMLHEmails"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											I authorize MLH to send me an email
											where I can further opt into the MLH
											Hacker, Events, or Organizer
											Newsletters and other communications
											from MLH.
										</FormLabel>
										<FormDescription>
											This is optional.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
					<FormGroupWrapper title="University Info">
						<div
							className={`grid ${
								universityValue ===
								c.localUniversityName.toLowerCase()
									? "grid-cols-1 md:grid-cols-6"
									: "grid-cols-1 md:grid-cols-5"
							} gap-x-2 gap-y-4`}
						>
							<FormField
								control={form.control}
								name="university"
								render={({ field }) => (
									<FormItem className="col-span-2 flex flex-col">
										<FormLabel>University</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value
															? schools.find(
																	(school) =>
																		school ===
																		field.value,
																)
															: "Select a University"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="no-scrollbar max-h-[400px] w-[250px] overflow-y-auto p-0">
												<Command>
													<CommandInput placeholder="Search university..." />
													<CommandList>
														<CommandEmpty>
															No university found.
														</CommandEmpty>
														<CommandGroup>
															{schools.map(
																(school) => (
																	<CommandItem
																		value={
																			school
																		}
																		key={
																			school
																		}
																		onSelect={(
																			value,
																		) => {
																			form.setValue(
																				"university",
																				value,
																			);
																		}}
																		className="cursor-pointer"
																	>
																		<Check
																			className={`mr-2 h-4 w-4 ${
																				school.toLowerCase() ===
																				field.value
																					? "block"
																					: "hidden"
																			} `}
																		/>
																		{school}
																	</CommandItem>
																),
															)}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="major"
								render={({ field }) => (
									<FormItem className="col-span-2 flex flex-col">
										<FormLabel>Major</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value &&
																"text-muted-foreground",
														)}
													>
														{field.value
															? majors.find(
																	(major) =>
																		major ===
																		field.value,
																)
															: "Select a Major"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="no-scrollbar max-h-[400px] w-[250px] overflow-y-auto p-0">
												<Command>
													<CommandInput placeholder="Search major..." />
													<CommandList>
														<CommandEmpty>
															No major found.
														</CommandEmpty>
														<CommandGroup>
															{majors.map(
																(major) => (
																	<CommandItem
																		value={
																			major
																		}
																		key={
																			major
																		}
																		onSelect={(
																			value,
																		) => {
																			form.setValue(
																				"major",
																				value,
																			);
																		}}
																		className="cursor-pointer"
																	>
																		<Check
																			className={`mr-2 h-4 w-4 overflow-hidden ${
																				major.toLowerCase() ===
																				field.value
																					? "block"
																					: "hidden"
																			} `}
																		/>
																		{major}
																	</CommandItem>
																),
															)}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="levelOfStudy"
								render={({ field }) => (
									<FormItem className="col-span-2 flex flex-col md:col-span-1">
										<FormLabel>Level of Study</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full placeholder:text-muted-foreground">
													<SelectValue placeholder="Level of Study" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Freshman">
														Freshman
													</SelectItem>
													<SelectItem value="Sophomore">
														Sophomore
													</SelectItem>
													<SelectItem value="Junior">
														Junior
													</SelectItem>
													<SelectItem value="Senior">
														Senior
													</SelectItem>
													<SelectItem value="Recent Grad">
														Recent Grad
													</SelectItem>
													<SelectItem value="Other">
														Other
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="shortID"
								render={({ field }) => (
									<FormItem
										className={`${
											universityValue ===
											c.localUniversityName.toLowerCase()
												? "col-span-2 flex flex-col md:col-span-1"
												: "hidden"
										}`}
									>
										<FormLabel>
											{c.localUniversityShortIDName}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													c.localUniversityShortIDName
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="Hackathon Experience">
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-0">
							<FormField
								control={form.control}
								name="hackathonsAttended"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											# of Hackathons Attended
										</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="softwareBuildingExperience"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Software Building Experience
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full placeholder:text-muted-foreground">
													<SelectValue placeholder="Experience Level" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Beginner">
														Beginner
													</SelectItem>
													<SelectItem value="Intermediate">
														Intermediate
													</SelectItem>
													<SelectItem value="Advanced">
														Advanced
													</SelectItem>
													<SelectItem value="Expert">
														Expert
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="heardAboutEvent"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Where did you hear about{" "}
											{c.hackathonName}?
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full placeholder:text-muted-foreground">
													<SelectValue placeholder="Heard From..." />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="Instagram">
														Instagram
													</SelectItem>
													<SelectItem value="Class Presentation">
														Class Presentation
													</SelectItem>
													<SelectItem value="Twitter">
														Twitter
													</SelectItem>
													<SelectItem value="Event Site">
														Event Site
													</SelectItem>
													<SelectItem value="Friend">
														Friend
													</SelectItem>
													<SelectItem value="Other">
														Other
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="Day of Event">
						<div className="grid grid-cols-1 gap-x-4 gap-y-2 pb-5 md:grid-cols-2 md:gap-y-0">
							<FormField
								control={form.control}
								name="shirtSize"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Shirt Size</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full placeholder:text-muted-foreground">
													<SelectValue placeholder="Shirt Size" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="S">
														S
													</SelectItem>
													<SelectItem value="M">
														M
													</SelectItem>
													<SelectItem value="L">
														L
													</SelectItem>
													<SelectItem value="XL">
														XL
													</SelectItem>
													<SelectItem value="2XL">
														2XL
													</SelectItem>
													<SelectItem value="3XL">
														3XL
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dietaryRestrictions"
								render={() => (
									<FormItem className="row-span-2">
										<div className="mb-4">
											<FormLabel className="text-base">
												Dietary Restrictions
											</FormLabel>
											<FormDescription>
												Please select which dietary
												restrictions you have so we can
												best accomodate you at the
												event!
											</FormDescription>
										</div>
										{c.dietaryRestrictionOptions.map(
											(item) => (
												<FormField
													key={item}
													control={form.control}
													name="dietaryRestrictions"
													render={({ field }) => {
														return (
															<FormItem
																key={item}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(
																			item,
																		)}
																		onCheckedChange={(
																			checked,
																		) => {
																			return checked
																				? field.onChange(
																						[
																							...field.value,
																							item,
																						],
																					)
																				: field.onChange(
																						field.value?.filter(
																							(
																								value,
																							) =>
																								value !==
																								item,
																						),
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal">
																	{item}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											),
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="accommodationNote"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Anything else we can do to better
											accommodate you at our hackathon?
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="List any accessibility concerns here..."
												className="h-[80%] resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="Career Info">
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-2">
							<FormField
								control={form.control}
								name="github"
								render={({ field }) => (
									<FormItem>
										<FormLabel>GitHub Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Username"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="linkedin"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Linkedin Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Username"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="personalWebsite"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Personal Website</FormLabel>
										<FormControl>
											<Input
												placeholder="https://example.com/"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="personalWebsite"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Resume</FormLabel>
									<FormControl>
										<div
											{...getRootProps()}
											className={`border-2${
												uploadedFile
													? ""
													: "cursor-pointer"
											} flex min-h-[200px] flex-col items-center justify-center rounded-lg border-dashed border-white`}
										>
											<input {...getInputProps()} />
											<p className="p-2 text-center">
												{uploadedFile
													? `${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)}kb)`
													: isDragActive
														? "Drop your resume here..."
														: "Drag 'n' drop your resume here, or click to select a file"}
											</p>
											{uploadedFile ? (
												<Button
													className="mt-4"
													onClick={() =>
														setUploadedFile(null)
													}
												>
													Remove
												</Button>
											) : null}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
					<FormGroupWrapper title="Hacker Profile">
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-3 md:gap-y-0">
							<FormField
								control={form.control}
								name="hackerTag"
								render={({ field }) => (
									<FormItem>
										<FormLabel>HackerTag</FormLabel>
										<FormControl>
											<div className="flex">
												<div className="flex h-10 w-10 items-center justify-center rounded-l bg-accent text-lg font-light text-primary">
													@
												</div>
												<Input
													className="rounded-l-none"
													placeholder={`${c.hackathonName.toLowerCase()}`}
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
								name="profileDiscordName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Discord Username</FormLabel>
										<FormControl>
											<Input
												placeholder={`${c.hackathonName.toLowerCase()} or ${c.hackathonName.toLowerCase()}#1234`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="pronouns"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pronouns</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 md:gap-y-0">
							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Hello! I'm..."
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											<span
												className={
													bioValue.length > 500
														? "text-red-500"
														: ""
												}
											>
												{bioValue.length} / 500
												Characters
											</span>
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="skills"
								render={({ field }) => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="pb-2 text-left">
											Skills
										</FormLabel>
										<FormControl className="min-h-[80px]">
											<TagInput
												inputFieldPostion="top"
												{...field}
												placeholder="Type and then press enter to add a skill..."
												tags={skills}
												className="sm:min-w-[450px]"
												setTags={(newTags) => {
													setSkills(newTags);
													form.setValue(
														"skills",
														newTags as [
															Tag,
															...Tag[],
														],
													);
												}}
											/>
										</FormControl>
										<FormDescription className="!mt-0">
											These skills can be listed on your
											profile and help with the team
											finding process! Enter anything you
											think is relevant, including
											non-technical skills!
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="profileIsSearchable"
							render={({ field }) => (
								<FormItem className="mx-auto flex max-w-[600px] flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											Make my profile searchable by other
											Hackers
										</FormLabel>
										<FormDescription>
											This will allow other Hackers to
											look you up by your name or
											HackerTag. Other Hackers will still
											be able to view your profile and
											invite you to teams if they have
											your link.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</FormGroupWrapper>
					<Button type="submit">Submit</Button>
					{hasErrors && (
						<p className="text-red-800">
							Something doesn't look right. Please check your
							inputs.
						</p>
					)}
				</form>
			</Form>
		</div>
	);
}
