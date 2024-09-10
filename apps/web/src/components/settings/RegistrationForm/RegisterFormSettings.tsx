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
import FormGroupWrapper from "@/components/registration/FormGroupWrapper";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import c, { schools, majors } from "config";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem, CommandList
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
import { FileRejection, useDropzone } from "react-dropzone";
import { put } from "@vercel/blob";
import { useAction } from "next-safe-action/hook";
import { modifyRegistrationData, modifyResume } from "@/actions/user-profile-mod";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react"

interface RegistrationData {
	age: number;
	gender: string;
	race: string;
	ethnicity: string;
	wantsToReceiveMLHEmails: boolean;
	university: string;
	major: string;
	shortID: string;
	levelOfStudy: string;
	hackathonsAttended: number;
	softwareExperience: any;
	heardFrom: any;
	shirtSize: any;
	dietRestrictions: any;
	accommodationNote: string | null;
	GitHub: string | null;
	LinkedIn: string | null;
	PersonalWebsite: any;
	resume: string;
}

interface RegisterFormSettingsProps {
	data: RegistrationData
}

export default function RegisterForm({ data }: RegisterFormSettingsProps) {
	if (data.heardFrom === null) data.heardFrom = undefined
	const form = useForm<z.infer<typeof RegisterFormValidator>>({
		resolver: zodResolver(RegisterFormValidator),
		defaultValues: {
			hackathonsAttended: data.hackathonsAttended || 0,
			dietaryRestrictions: data.dietRestrictions || [],
			wantsToReceiveMLHEmails: data.wantsToReceiveMLHEmails,
			// The rest of these are default values to prevent the controller / uncontrolled input warning from React
			accommodationNote: data.accommodationNote || "",
			age: data.age,
			ethnicity: data.ethnicity as any,
			gender: data.gender as any,
			major: data.major,
			github: data.GitHub as any,
			heardAboutEvent: data.heardFrom,
			levelOfStudy: data.levelOfStudy as any,
			linkedin: data.LinkedIn as any,
			personalWebsite: data.PersonalWebsite,
			race: data.race as any,
			shirtSize: data.shirtSize,
			shortID: data.shortID,
			softwareBuildingExperience: data.softwareExperience,
			university: data.university,
		},
	});
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const resumeLink: string = data.resume ?? c.noResumeProvidedURL;
	// @ts-ignore
	let f = new File([data.resume], resumeLink.split('/').pop());
	useEffect(() => {
		if (resumeLink === c.noResumeProvidedURL)
			setUploadedFile(null)
		else
			setUploadedFile(f)
	}, []);

	const [isLoading, setIsLoading] = useState(false);
	const [oldFile, setOldFile] = useState(true);

	const universityValue = form.watch("university").toLowerCase();
	const shortID = form.watch("shortID").toLowerCase();
	const [goBackLoading, setGoBackLoading] = useState(false);

	useEffect(() => {
		if (universityValue != c.localUniversityName.toLowerCase()) {
			form.setValue("shortID", "NOT_LOCAL_SCHOOL");
			console.log(1);
		} else {
			if (shortID === "NOT_LOCAL_SCHOOL") {
				form.setValue("shortID", data.shortID);
			} else {
				form.setValue("shortID", "");
			}
		}
	}, [universityValue]);

	const { execute: runModifyRegistrationData } = useAction(
		modifyRegistrationData,
		{
			onSuccess: ({ success }) => {
				setIsLoading(false)
				toast.dismiss();
				toast.success("Account updated successfully!");
			},
			onError: () => {
				setIsLoading(false)
				toast.dismiss();
				toast.error("An error occurred while updating your account settings!");
			},
		},
	);

	const { execute: runModifyResume } = useAction(
		modifyResume,
		{
			onSuccess: ({ success }) => {
			},
			onError: () => {
				toast.dismiss();
				toast.error("An error occurred while uploading resume!");
			}
		}
	)

	async function onSubmit(data: z.infer<typeof RegisterFormValidator>) {
		console.log(data);
		// setIsLoading(true);
		// console.log("Submision Clicked");
		// console.log(data);
		// if (!userId || !isLoaded) {
		// 	setIsLoading(false);
		// 	return alert(
		// 		`Auth has not loaded yet. Please try again! If this is a repeating issue, please contact us at ${c.issueEmail}.`,
		// 	);
		// }
		//
		// let resume: string = c.noResumeProvidedURL;
		//
		// if (uploadedFile) {
		// 	const newBlob = await put(uploadedFile.name, uploadedFile, {
		// 		access: "public",
		// 		handleBlobUploadUrl: "/api/upload/resume/register",
		// 	});
		// 	resume = newBlob.url;
		// }
		// //runModifyRegistrationData()
	}

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				alert(
					`The file you uploaded was rejected with the reason "${fileRejections[0].errors[0].message}". Please try again.`,
				);
			}
			if (acceptedFiles.length > 0) {
				console.log(
					`Got accepted file! The length of the array is ${acceptedFiles.length}.`,
				);
				console.log(acceptedFiles[0]);
				setUploadedFile(acceptedFiles[0]);
				setOldFile(false);
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

	return (
		<div>
			<Button variant={"secondary"} className={"mb-3"} disabled={goBackLoading} onClick={() => setGoBackLoading(true)}>
				<Link href={"/settings"}>
					{goBackLoading ? (
						<div className={"flex"}>
							<Loader2 className={"mr-2 h-4 w-4 animate-spin"}/>
						</div>
					) : (
						<Link href={"/settings"}>Back</Link>
					)}
				</Link>
			</Button>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormGroupWrapper title="General">
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
							name="wantsToReceiveMLHEmails"
							render={({ field }) => (
								<FormItem
									className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
																				school ===
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
																				major ===
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
											universityValue.toLowerCase() ===
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
							name={"personalWebsite"}
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
													? oldFile
														? <Link href={resumeLink}>{uploadedFile.name} ({Math.round(uploadedFile.size)}kb)</Link>
														: `${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)}kb)`

													: isDragActive
														? "Drop your resume here..."
														: "Drag 'n' drop your resume here, or click to select a file"}
											</p>
											{uploadedFile ? (
												<Button
													className="mt-4"
													onClick={() => {
														setUploadedFile(null);
														setOldFile(false);
													}

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
					<Button
						onClick={ async () => {
							setIsLoading(true)
							let resume: string = c.noResumeProvidedURL
							if (uploadedFile) {
								const newBlob = await put(uploadedFile.name, uploadedFile, {
									access: "public",
									handleBlobUploadUrl: "/api/upload/resume/register",
								});
								resume = newBlob.url;
							}
							runModifyRegistrationData({
								age: +form.watch("age"),
								gender: form.watch("gender"),
								race: form.watch("race"),
								ethnicity: form.watch("ethnicity"),
								wantsToReceiveMLHEmails: form.watch("wantsToReceiveMLHEmails"),
								university: form.watch("university"),
								major: form.watch("major"),
								levelOfStudy: form.watch("levelOfStudy"),
								shortID: form.watch("shortID"),
								hackathonsAttended: +form.watch("hackathonsAttended"),
								softwareExperience: form.watch("softwareBuildingExperience"),
								heardFrom: form.watch("heardAboutEvent"),
								shirtSize: form.watch("shirtSize"),
								dietRestrictions: form.watch("dietaryRestrictions"),
								accommodationNote: form.watch("accommodationNote"),
								GitHub: form.watch("github"),
								LinkedIn: form.watch("linkedin"),
								PersonalWebsite: form.watch("personalWebsite"),
							});
							runModifyResume({
								resume
							});
						}}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className={"mr-2 h-4 w-4 animate-spin"}/>
								<div>Updating</div>
							</>
						) : (
							"Update"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
