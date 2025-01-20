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
import { zodResolver } from "@hookform/resolvers/zod";
import FormGroupWrapper from "@/components/registration/FormGroupWrapper";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import c, { bucketResumeBaseUploadUrl } from "config";
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
import { useEffect, useCallback, useState, useRef } from "react";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { FileRejection, useDropzone } from "react-dropzone";
import { put } from "@vercel/blob";
import { useAction } from "next-safe-action/hooks";
import {
	deleteResume,
	modifyRegistrationData,
} from "@/actions/user-profile-mod";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { HackerData, User } from "db/types";
import { registrationSettingsFormValidator } from "@/validators/settings";
interface RegistrationFormSettingsProps {
	user: User;
	data: HackerData;
}

export default function RegisterFormSettings({
	user,
	data: originalData,
}: RegistrationFormSettingsProps) {
	const form = useForm<z.infer<typeof registrationSettingsFormValidator>>({
		resolver: zodResolver(registrationSettingsFormValidator),
		defaultValues: {
			hackathonsAttended: originalData.hackathonsAttended,
			dietaryRestrictions: user.dietRestrictions as any,
			isEmailable: originalData.isEmailable,
			accommodationNote: user.accommodationNote || "",
			age: user.age,
			ethnicity: user.ethnicity as any,
			gender: user.gender as any,
			major: originalData.major,
			github: originalData.GitHub ?? "",
			heardAboutEvent: originalData.heardFrom as any,
			levelOfStudy: originalData.levelOfStudy as any,
			linkedin: originalData.LinkedIn ?? "",
			personalWebsite: originalData.PersonalWebsite ?? "",
			race: user.race as any,
			shirtSize: user.shirtSize as any,
			schoolID: originalData.schoolID,
			softwareBuildingExperience: originalData.softwareExperience as any,
			university: originalData.university,
			phoneNumber: user.phoneNumber,
			countryOfResidence: user.countryOfResidence,
		},
	});

	const { isSubmitSuccessful, isSubmitted, isDirty } = form.formState;

	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [isOldFile, setIsOldFile] = useState(true);
	const [hasDataChanged, setHasDataChanged] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const hasErrors = !isSubmitSuccessful && isSubmitted;
	const oldResumeLink = useRef(originalData.resume);
	let f = new File(
		[originalData.resume],
		oldResumeLink.current.split("/").pop()!,
	);
	let newResumeLink: string = originalData.resume;

	// used to prevent infinite re-renders
	useEffect(() => {
		if (oldResumeLink.current === c.noResumeProvidedURL)
			setUploadedFile(null);
		else setUploadedFile(f);
	}, []);

	useEffect(() => {
		console.log("isDirty: ", isDirty);
		console.log("isOldFile: ", isOldFile);
		console.log("uploadedFile: ", uploadedFile);
		console.log("oldResumeLink: ", oldResumeLink.current);
		setHasDataChanged(
			isDirty ||
				(uploadedFile != null && !isOldFile) ||
				(oldResumeLink.current !== c.noResumeProvidedURL &&
					uploadedFile == null),
		);
	}, [isDirty, uploadedFile, isOldFile, oldResumeLink.current]);

	const universityValue = form.watch("university").toLowerCase();
	const shortID = form.watch("schoolID").toLowerCase();

	useEffect(() => {
		if (universityValue != c.localUniversityName.toLowerCase()) {
			form.setValue("schoolID", "NOT_LOCAL_SCHOOL");
		} else {
			const ShortIDValue =
				shortID === "NOT_LOCAL_SCHOOL" ? "" : originalData.schoolID;
			form.setValue("schoolID", ShortIDValue);
		}
	}, [universityValue]);

	async function onSubmit(
		data: z.infer<typeof registrationSettingsFormValidator>,
	) {
		if (!hasDataChanged) {
			toast.error("Please change something before updating");
			return;
		}
		setIsLoading(true);
		if (uploadedFile && !isOldFile) {
			console.log("uploading file...");
			const newBlob = await put(
				bucketResumeBaseUploadUrl + "/" + uploadedFile.name,
				uploadedFile,
				{
					access: "public",
					handleBlobUploadUrl: "/api/upload/resume/register",
				},
			);
			console.log("file uploaded");
			newResumeLink = newBlob.url;
		} else {
			newResumeLink =
				uploadedFile == null
					? c.noResumeProvidedURL
					: originalData.resume;
		}
		oldResumeLink.current = newResumeLink;
		const oldResume = originalData.resume;
		if (hasDataChanged) {
			console.log("running modify registration data...");
			runModifyRegistrationData({
				...data,
				uploadedFile: newResumeLink,
			});
		}
		runDeleteResume({ oldFileLink: oldResume });
		setIsLoading(false);
	}

	const { execute: runModifyRegistrationData, status: loadingState } =
		useAction(modifyRegistrationData, {
			onSuccess: async () => {
				toast.dismiss();
				toast.success("Data updated successfully!", {
					duration: 2000,
				});
				console.log("Success");
				form.reset({
					...form.getValues(),
				});
				// setHasDataChanged(false);
				setIsOldFile(true);
			},
			onError: async () => {
				if (newResumeLink !== c.noResumeProvidedURL)
					runDeleteResume({ oldFileLink: newResumeLink }); // If error, delete the blob write (of the attempted new resume)
				setIsLoading(false);
				toast.dismiss();
				toast.error(
					`An error occurred. Please contact ${c.issueEmail} for help.`,
				);
			},
		});
	const { execute: runDeleteResume } = useAction(deleteResume);

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				alert(
					`The file you uploaded was rejected with the reason "${fileRejections[0].errors[0].message}". Please try again.`,
				);
			}
			if (acceptedFiles.length > 0) {
				setUploadedFile(acceptedFiles[0]);
				setIsOldFile(false);
				setHasDataChanged(true);
			} else {
				setUploadedFile(null);
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
			<Form {...form}>
				<form
					className="space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormGroupWrapper title="General">
						<div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-7">
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
													{c.registration.raceOptions.map(
														(option) => (
															<SelectItem
																value={option}
																key={option}
															>
																{option}
															</SelectItem>
														),
													)}
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
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem className={"col-span-3"}>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="countryOfResidence"
								render={({ field }) => (
									<FormItem className="col-span-4 grid-cols-2">
										<FormLabel>
											Country of Residence
										</FormLabel>
										<div className="flex w-full items-center justify-center">
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
																? c.registration.countries.find(
																		(
																			selectedCountry,
																		) =>
																			selectedCountry.code ===
																			field.value,
																	)?.name
																: "Select a Country"}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="no-scrollbar max-h-[400px] w-[250px] overflow-y-auto p-0">
													<Command>
														<CommandInput placeholder="Search countries..." />
														<CommandList>
															<CommandEmpty>
																No country
																found.
															</CommandEmpty>
															<CommandGroup>
																{c.registration.countries.map(
																	(
																		country,
																	) => (
																		<CommandItem
																			value={
																				country.name
																			}
																			key={
																				country.name
																			}
																			onSelect={(
																				_,
																			) => {
																				const countryResult =
																					c.registration.countries.find(
																						(
																							countryObject,
																						) =>
																							countryObject.name ===
																							country.name,
																					);
																				form.setValue(
																					"countryOfResidence",
																					countryResult?.code ??
																						"00",
																				);
																			}}
																			className="cursor-pointer"
																		>
																			<Check
																				className={`mr-2 h-4 w-4 ${
																					country.name.toLowerCase() ===
																					field.value
																						? "block"
																						: "hidden"
																				} `}
																			/>
																			{
																				country.name
																			}
																		</CommandItem>
																	),
																)}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FormGroupWrapper>
					<FormGroupWrapper title="MLH">
						<FormField
							control={form.control}
							name="isEmailable"
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
															? c.registration.schools.find(
																	(
																		school: string,
																	) =>
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
															{c.registration.schools.map(
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
															? c.registration.majors.find(
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
															{c.registration.majors.map(
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
								name="schoolID"
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
											{c.localUniversitySchoolIDName}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													c.localUniversitySchoolIDName
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
										{c.registration.dietaryRestrictionOptions.map(
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
												{uploadedFile ? (
													isOldFile ? (
														<Link
															href={
																oldResumeLink.current
															}
														>
															{uploadedFile.name}{" "}
															(
															{Math.round(
																uploadedFile.size,
															)}
															kb)
														</Link>
													) : (
														`${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)}kb)`
													)
												) : isDragActive ? (
													"Drop your resume here..."
												) : (
													"Drag 'n' drop your resume here, or click to select a file"
												)}
											</p>
											{uploadedFile ? (
												<Button
													className="mt-4"
													onClick={() => {
														setUploadedFile(null);
														setIsOldFile(false);
													}}
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
						type={"submit"}
						disabled={isLoading || loadingState === "executing"}
					>
						{isLoading || loadingState === "executing" ? (
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
					{hasErrors && (
						<p className={"text-red-800"}>
							Something doesn't look right. Please check your
							inputs.
						</p>
					)}
				</form>
			</Form>
		</div>
	);
}
