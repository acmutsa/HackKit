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
import { zodResolver } from "@hookform/resolvers/zod";
import FormGroupWrapper from "./FormGroupWrapper";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import Link from "next/link";
import c from "config";
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
	PopoverClose,
} from "@/components/shadcn/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/client/cn";
import { useEffect, useCallback, useState } from "react";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FileRejection, useDropzone } from "react-dropzone";
import { put } from "@/lib/utils/client/file-upload";
import { Tag, TagInput } from "@/components/shadcn/ui/tag/tag-input";
import CreatingRegistration from "./CreatingRegistration";
import { staticUploads } from "config";
import {
	hackerRegistrationFormValidator,
	hackerRegistrationValidatorLocalStorage,
	hackerRegistrationResumeValidator,
} from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/lib/utils/client/shared";
import RegistrationFeedbackAlert from "./RegistrationFeedbackAlert";
import { registerHacker } from "@/actions/registration";
import { useAction } from "next-safe-action/hooks";
import type {
	GenderOptionsType,
	HeardFromOptionsType,
	SoftwareExperienceOptionsType,
	ShirtSizeOptionsType,
	RaceOptionsType,
	EthnicityOptionsType,
	SchoolOptionsType,
	LevelOfStudyOptionsType,
	MajorOptionsType,
} from "@/lib/types/user";
import z from "zod";
import {
	HACKER_REGISTRATION_STORAGE_KEY,
	HACKER_REGISTRATION_RESUME_STORAGE_KEY,
	NOT_LOCAL_SCHOOL,
} from "@/lib/constants";
import {
	encodeFileAsBase64,
	decodeBase64AsFile,
} from "@/lib/utils/shared/files";
import { useDebouncedCallback } from "use-debounce";

export default function RegisterForm({
	defaultEmail,
}: {
	defaultEmail: string;
}) {
	const { isLoaded: isAuthLoaded } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const router = useRouter();

	const form = useForm<z.infer<typeof hackerRegistrationFormValidator>>({
		resolver: zodResolver(hackerRegistrationFormValidator),
		defaultValues: {
			hackathonsAttended: 0,
			dietRestrictions: [],
			isSearchable: false,
			bio: "",
			isEmailable: false,
			hasAcceptedMLHCoC: false,
			hasSharedDataWithMLH: false,
			accommodationNote: "",
			firstName: "",
			lastName: "",
			age: 0,
			ethnicity: "" as EthnicityOptionsType,
			gender: "" as GenderOptionsType,
			major: "" as MajorOptionsType,
			GitHub: "",
			hackerTag: "",
			heardFrom: "" as HeardFromOptionsType,
			levelOfStudy: "" as LevelOfStudyOptionsType,
			LinkedIn: "",
			PersonalWebsite: "",
			discord: "",
			pronouns: "",
			race: "" as RaceOptionsType,
			shirtSize: "" as ShirtSizeOptionsType,
			schoolID: "",
			university: "" as SchoolOptionsType,
			phoneNumber: "",
			countryOfResidence: "",
			softwareExperience: "" as SoftwareExperienceOptionsType,
			email: defaultEmail,
			skills: [],
		},
	});

	// logic to grab info from local storage
	useEffect(() => {
		const hackerFormData = localStorage.getItem(
			HACKER_REGISTRATION_STORAGE_KEY,
		);
		console.log(hackerFormData);
		if (hackerFormData) {
			try {
				const parsed = JSON.parse(hackerFormData);
				const res =
					hackerRegistrationValidatorLocalStorage.safeParse(parsed);
				if (res.success) {
					const {
						ethnicity,
						gender,
						major,
						university,
						dietRestrictions,
						heardFrom,
						softwareExperience,
						levelOfStudy,
						race,
						skills,
						shirtSize,
						...remainingData
					} = res.data;
					setSkills(res.data.skills as Tag[]);
					form.reset({
						...form.formState.defaultValues,
						ethnicity: ethnicity as EthnicityOptionsType,
						race: race as RaceOptionsType,
						gender: gender as GenderOptionsType,
						university: university as SchoolOptionsType,
						shirtSize: shirtSize as ShirtSizeOptionsType,
						skills: skills as Tag[],
						major: major as MajorOptionsType,
						levelOfStudy: levelOfStudy as LevelOfStudyOptionsType,
						softwareExperience:
							softwareExperience as SoftwareExperienceOptionsType,
						heardFrom: heardFrom as HeardFromOptionsType,
						dietRestrictions:
							dietRestrictions as (typeof c.registration.dietaryRestrictionOptions)[number][],
						...remainingData,
					});
				} else {
					console.log(
						"Error schema parsing hacker registration data: ",
						res.error,
					);
				}
			} catch (e) {
				console.error(
					"Error parsing hacker registration JSON data: ",
					e,
				);
			}
		}
	}, []);

	// seperate useffect for getting the resume file
	useEffect(() => {
		const dataString = localStorage.getItem(
			HACKER_REGISTRATION_RESUME_STORAGE_KEY,
		);

		if (dataString) {
			try {
				const parsedValue = JSON.parse(dataString);
				const schemaParsedRes =
					hackerRegistrationResumeValidator.safeParse(parsedValue);
				if (schemaParsedRes.success) {
					const { fileString, fileName } = schemaParsedRes.data;
					decodeBase64AsFile(fileString, fileName).then((file) => {
						setUploadedFile(file);
					});
				} else {
					console.error(
						"Error parsing resume data: ",
						schemaParsedRes.error,
					);
				}
			} catch (e) {
				console.error("Error parsing resume data: ", e);
			}
		}
	}, []);

	const debouncedLocalStorageWrite = useDebouncedCallback(
		// function
		() => {
			localStorage.setItem(
				HACKER_REGISTRATION_STORAGE_KEY,
				JSON.stringify({
					...form.getValues(),
				}),
			);
		},
		1000,
	);

	form.watch(() => {
		debouncedLocalStorageWrite();
	});

	// use action logic
	const { execute: runRegisterUser, reset: resetRegisterUser } = useAction(
		registerHacker,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					setHasSuccess(true);
					// clear the local storage
					localStorage.removeItem(HACKER_REGISTRATION_STORAGE_KEY);
					localStorage.removeItem(
						HACKER_REGISTRATION_RESUME_STORAGE_KEY,
					);
					setTimeout(() => {
						router.push("/dash");
					}, 200);
				} else {
					setIsLoading(false);
					console.error("onSuccess Error data:", data);
					setErrorMessage(
						data?.message ?? "Unexpected error occured",
					);
				}
			},
			onError: ({ error }) => {
				setIsLoading(false);
				console.log("onError Error is: ", error);
				resetRegisterUser();
			},
		},
	);

	const { isSubmitSuccessful, isSubmitted } = form.formState;

	const hasErrors = !isSubmitSuccessful && isSubmitted;

	const [skills, setSkills] = useState<Tag[]>([]);
	const [hasSuccess, setHasSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const universityValue = form.watch("university");
	const bioValue = form.watch("bio");
	const classificationValue = form.watch("levelOfStudy");
	const isLocalUniversitySelected =
		universityValue === c.localUniversityName &&
		classificationValue !== "Recent Grad";

	// used to track whether to enable the university ID field
	useEffect(() => {
		if (
			(universityValue && universityValue !== c.localUniversityName) ||
			classificationValue === "Recent Grad"
		) {
			form.setValue("schoolID", NOT_LOCAL_SCHOOL);
		} else {
			form.setValue("schoolID", form.getValues("schoolID") ?? "");
		}
	}, [universityValue]);

	async function onSubmit(
		data: z.infer<typeof hackerRegistrationFormValidator>,
	) {
		setIsLoading(true);
		console.log(data);
		setErrorMessage(null);
		if (!isAuthLoaded) {
			setErrorMessage(
				`Auth has not loaded yet. Please try again! If this is a repeating issue, please contact us at ${c.issueEmail}.`,
			);
			return;
		}

		let resume: string = c.noResumeProvidedURL;
		if (uploadedFile) {
			// test what happens when an error is thrown
			const uploadedFileUrl = await put(
				staticUploads.bucketResumeBaseUploadUrl,
				uploadedFile,
				{
					presignHandlerUrl: "/api/upload/resume/register",
				},
			);

			resume = uploadedFileUrl;
		}
		runRegisterUser({ ...data, resume });
	}

	const onDrop = useCallback(
		async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				alert(
					`The file you uploaded was rejected with the reason "${fileRejections[0].errors[0].message}". Please try again.`,
				);
			}
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				setUploadedFile(file);
				const fileName = file.name;
				const inputs = {
					fileName,
					fileString: await encodeFileAsBase64(file),
				};
				localStorage.setItem(
					HACKER_REGISTRATION_RESUME_STORAGE_KEY,
					JSON.stringify(inputs),
				);
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
		<>
			{isLoading || hasSuccess ? (
				<CreatingRegistration
					hasSuccess={hasSuccess}
					isLoading={isLoading}
				/>
			) : (
				<div className="relative">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<FormGroupWrapper title="General">
								<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"First Name",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="John"
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
												<FormLabel>
													{formatRegistrationField(
														"Last Name",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Doe"
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
												<FormLabel>
													{formatRegistrationField(
														"Email",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														readOnly={
															defaultEmail.length >
															0
														}
														{...field}
														disabled
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Phone Number",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="555-555-5555"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="age"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Age",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="gender"
										render={({ field }) => (
											<FormItem className="">
												<FormLabel>
													{formatRegistrationField(
														"Gender",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select a ${capitalizeFirstLetter(field.name)}`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															{c.registration.genderOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
										name="race"
										render={({ field }) => (
											<FormItem className="">
												<FormLabel>
													{formatRegistrationField(
														"Race",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full placeholder:text-muted-foreground">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select a ${capitalizeFirstLetter(field.name)}`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent className="">
														<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)] overflow-y-scroll">
															{c.registration.raceOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
											<FormItem className="">
												<FormLabel>
													{formatRegistrationField(
														"Ethnicity",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full placeholder:text-muted-foreground">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select a ${capitalizeFirstLetter(field.name)}`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															{c.registration.ethnicityOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
										name="countryOfResidence"
										render={({ field }) => (
											<FormItem className="grid-cols-2">
												<FormLabel>
													{formatRegistrationField(
														"Country of Residence",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
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
																<p className="truncate whitespace-nowrap">
																	{field.value
																		? c.registration.countries.find(
																				(
																					selectedCountry,
																				) =>
																					selectedCountry.code ===
																					field.value,
																			)
																				?.name
																		: "Select a Country"}
																</p>

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
																<PopoverClose
																	asChild
																>
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
																						field.onChange(
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
																</PopoverClose>
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</FormGroupWrapper>
							<FormGroupWrapper title="MLH">
								<FormField
									control={form.control}
									name="hasAcceptedMLHCoC"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
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
													{" *"}
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="hasSharedDataWithMLH"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													I authorize you to share my
													application/registration
													information with Major
													League Hacking for event
													administration, ranking, and
													MLH administration in-line
													with the MLH Privacy Policy.
													I further agree to the terms
													of both the{" "}
													<Link
														target="_blank"
														className="underline"
														href={
															"https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
														}
													>
														MLH Contest Terms and
														Conditions
													</Link>{" "}
													and the{" "}
													<Link
														target="_blank"
														className="underline"
														href={
															"https://mlh.io/privacy"
														}
													>
														MLH Privacy Policy
													</Link>
													. *
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isEmailable"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													I authorize MLH to send me
													an email where I can further
													opt into the MLH Hacker,
													Events, or Organizer
													Newsletters and other
													communications from MLH.
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>
							</FormGroupWrapper>
							<FormGroupWrapper title="University Info">
								<div
									className={`grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6`}
								>
									<FormField
										control={form.control}
										name="university"
										render={({ field }) => (
											<FormItem
												className={`col-span-2 ${isLocalUniversitySelected && "lg:col-span-3"} flex flex-col`}
											>
												<FormLabel>
													{formatRegistrationField(
														"University",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Popover>
													<FormControl>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																role="combobox"
																className={cn(
																	"w-full justify-between",
																	!field.value &&
																		"text-muted-foreground",
																)}
															>
																<p className="truncate whitespace-nowrap">
																	{field.value
																		? c.registration.schools.find(
																				(
																					school,
																				) =>
																					school ===
																					field.value,
																			)
																		: "Select a University"}
																</p>
																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</PopoverTrigger>
													</FormControl>
													<PopoverContent
														className="no-scrollbar max-h-[400px] w-[--radix-popover-trigger-width] overflow-y-auto p-0"
														onFocusOutside={() =>
															console.log(
																"closing",
															)
														}
													>
														<Command>
															<CommandInput placeholder="Search university..." />
															<CommandList>
																<CommandEmpty>
																	No
																	university
																	found.
																</CommandEmpty>
																<PopoverClose
																	asChild
																>
																	<CommandGroup>
																		{c.registration.schools.map(
																			(
																				school,
																			) => (
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
																						field.onChange(
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
																					{
																						school
																					}
																				</CommandItem>
																			),
																		)}
																	</CommandGroup>
																</PopoverClose>
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>
												<FormDescription>
													If you are not currently a
													student, please select the
													most recent university you
													attended.
												</FormDescription>
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
													isLocalUniversitySelected
														? "col-span-1 flex flex-col md:col-span-2 lg:col-span-3"
														: "hidden"
												}`}
											>
												<FormLabel>
													{formatRegistrationField(
														`${c.localUniversitySchoolIDName}`,
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
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
									<FormField
										control={form.control}
										name="levelOfStudy"
										render={({ field }) => (
											<FormItem
												className={`col-span-2 ${isLocalUniversitySelected ? "md:col-span-2 lg:col-span-3" : "md:col-span-1 lg:col-span-2"} flex flex-col`}
											>
												<FormLabel>
													{formatRegistrationField(
														"Level of Study",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full placeholder:text-muted-foreground">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select an Option`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup className="max-h-[400px] w-[calc(var(--radix-select-trigger-width)+10rem)] overflow-y-scroll">
															{c.registration.levelsOfStudy.map(
																(level) => (
																	<SelectItem
																		value={
																			level
																		}
																		key={
																			level
																		}
																	>
																		{level}
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
										name="major"
										render={({ field }) => (
											<FormItem
												//
												className={`col-span-2 ${isLocalUniversitySelected ? "md:col-span-2 lg:col-span-3" : "md:col-span-1 lg:col-span-2"} flex flex-col`}
											>
												<FormLabel>
													{formatRegistrationField(
														"Major",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
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
																<p className="truncate whitespace-nowrap">
																	{field.value
																		? c.registration.majors.find(
																				(
																					major,
																				) =>
																					major ===
																					field.value,
																			)
																		: "Select a Major"}
																</p>

																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="no-scrollbar max-h-[400px] w-[250px] overflow-y-auto p-0">
														<Command>
															<CommandInput placeholder="Search major..." />
															<CommandList className="">
																<CommandEmpty>
																	No major
																	found.
																</CommandEmpty>
																<PopoverClose
																	asChild
																>
																	<CommandGroup>
																		{c.registration.majors.map(
																			(
																				major,
																			) => (
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
																						field.onChange(
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
																					{
																						major
																					}
																				</CommandItem>
																			),
																		)}
																	</CommandGroup>
																</PopoverClose>
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>
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
													{formatRegistrationField(
														"# of hackathons attended",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="softwareExperience"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Coding Experience",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="placeholder:text-muted-foreground">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select an Option`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)]">
															{c.registration.softwareExperienceOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
										name="heardFrom"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														`Where did you hear about ${c.hackathonName}?`,
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full placeholder:text-muted-foreground">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select an Option`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)]">
															{c.registration.heardFromOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
								</div>
							</FormGroupWrapper>
							<FormGroupWrapper title="Day of Event">
								<div className="mt-0 grid grid-cols-1 gap-x-4 gap-y-2 pb-20 md:grid-cols-2 md:gap-y-0">
									<FormField
										control={form.control}
										name="shirtSize"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Shirt Size",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<div
																className={clsx(
																	"flex w-[95%] justify-start",
																	{
																		"text-muted-foreground":
																			!field.value,
																	},
																)}
															>
																<p className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{field.value ||
																		`Select a Shirt Size`}
																</p>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectGroup>
															{c.registration.shirtSizeOptions.map(
																(option) => (
																	<SelectItem
																		value={
																			option
																		}
																		key={
																			option
																		}
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
										name="dietRestrictions"
										render={({ field }) => (
											<FormItem className="row-span-2">
												<div className="mb-4">
													<FormLabel className="text-base">
														{formatRegistrationField(
															"Dietary Restrictions",
															hackerRegistrationFormValidator.shape[
																field.name
															].isOptional(),
														)}
													</FormLabel>
													<FormDescription>
														Please select which
														dietary restrictions you
														have so we can best
														accommodate you at the
														event!
													</FormDescription>
												</div>
												{c.registration.dietaryRestrictionOptions.map(
													(item) => (
														<FormField
															key={item}
															control={
																form.control
															}
															name="dietRestrictions"
															render={({
																field,
															}) => {
																return (
																	<FormItem
																		key={
																			item
																		}
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
																									...(field?.value ??
																										[]),
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
																			{
																				item
																			}
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
													{formatRegistrationField(
														"Anything else we can do to better accommodate you at our hackathon?",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="List any accessibility concerns here..."
														className="h-[80%] resize-none"
														{...field}
														value={field.value}
														onChange={
															field.onChange
														}
													/>
												</FormControl>
												<FormDescription>
													<span
														className={
															(field.value
																?.length ?? 0) >
															c.registration
																.maxaccommodationNoteSize
																? "text-red-800"
																: ""
														}
													>
														{field.value?.length ??
															0}{" "}
														/{" "}
														{
															c.registration
																.maxaccommodationNoteSize
														}{" "}
														{""}
														Characters
													</span>
												</FormDescription>
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
										name="GitHub"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"GitHub Username",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Username"
														{...field}
														value={
															field.value ??
															undefined
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="LinkedIn"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"LinkedIn Username",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Username"
														{...field}
														value={
															field.value ??
															undefined
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="PersonalWebsite"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Personal Website",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="https://example.com/"
														{...field}
														value={
															field.value ??
															undefined
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									name="resume"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{formatRegistrationField(
													"Resume",
													hackerRegistrationFormValidator.shape[
														field.name
													].isOptional(),
												)}
											</FormLabel>
											<FormControl>
												<div
													{...getRootProps()}
													className={`border-2${
														uploadedFile
															? ""
															: "cursor-pointer"
													} flex min-h-[200px] flex-col items-center justify-center rounded-lg border-dashed border-white`}
												>
													<input
														type="file"
														{...getInputProps()}
													/>
													<p className="p-2 text-center">
														{uploadedFile
															? `${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)}kb)`
															: isDragActive
																? "Drop your resume here..."
																: "Drag 'n' drop your resume here, or click to select a file"}
													</p>
													{uploadedFile && (
														<Button
															className="mt-4"
															onClick={() =>
																setUploadedFile(
																	null,
																)
															}
														>
															Remove
														</Button>
													)}
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
												<FormLabel>
													{formatRegistrationField(
														"HackerTag",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
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
										name="discord"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{formatRegistrationField(
														"Discord UserName",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormControl>
													<Input
														placeholder={`${c.hackathonName.toLowerCase()} or ${c.hackathonName.toLowerCase()}#1234`}
														{...field}
														value={
															field.value ??
															undefined
														}
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
												<FormLabel>
													{formatRegistrationField(
														"Pronouns",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
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
												<FormLabel>
													{formatRegistrationField(
														"Bio",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
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
															bioValue.length >
															c.registration
																.maxBioSize
																? "text-red-500"
																: ""
														}
													>
														{bioValue.length} /{" "}
														{
															c.registration
																.maxBioSize
														}{" "}
														{""}
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
													{formatRegistrationField(
														"Skills",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
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
															field.onChange(
																newTags as [
																	Tag,
																	...Tag[],
																],
															);
														}}
													/>
												</FormControl>
												<FormDescription className="!mt-0">
													These skills can be listed
													on your profile and help
													with the team finding
													process! Enter anything you
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
									name="isSearchable"
									render={({ field }) => (
										<FormItem className="mx-auto flex max-w-[600px] flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													{formatRegistrationField(
														"Make my profile searchable by other Hackers",
														hackerRegistrationFormValidator.shape[
															field.name
														].isOptional(),
													)}
												</FormLabel>
												<FormDescription>
													This will allow other
													Hackers to look you up by
													your name or HackerTag.
													Other Hackers will still be
													able to view your profile
													and invite you to teams if
													they have your link.
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
							</FormGroupWrapper>
							<Button type="submit">Submit</Button>
							{hasErrors && (
								<p className="text-red-800">
									Something doesn't look right. Please check
									your inputs.
								</p>
							)}
						</form>
					</Form>
				</div>
			)}
			<div className="relative">
				{!!errorMessage && !hasSuccess && (
					<RegistrationFeedbackAlert
						hasError={hasErrors}
						messasge={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				)}
			</div>
		</>
	);
}
