"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
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
import clsx from "clsx";
import c from "config";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectGroup,
} from "@/components/shadcn/ui/select";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";
import type { SectionProps } from "../RegisterForm";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function Education({ isLocalUniversitySelected }: SectionProps) {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="University Info">
			<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
				<FormField
					control={form.control}
					name="university"
					render={({ field }) => (
						<FormItem
							className={`col-span-2 ${
								isLocalUniversitySelected ? "lg:col-span-3" : ""
							} flex flex-col`}
						>
							<FormLabel>
								{formatRegistrationField(
									"University",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
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
												!field.value && "text-muted-foreground",
											)}
										>
											<p className="truncate whitespace-nowrap">
												{field.value
													? c.registration.schools.find(
															(school) => school === field.value,
														)
													: "Select a University"}
											</p>
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
								</FormControl>

								<PopoverContent className="no-scrollbar max-h-[400px] w-[--radix-popover-trigger-width] overflow-y-auto p-0">
									<Command>
										<CommandInput placeholder="Search university..." />
										<CommandList>
											<CommandEmpty>No university found.</CommandEmpty>
											<PopoverClose asChild>
												<CommandGroup>
													{c.registration.schools.map((school) => (
														<CommandItem
															value={school}
															key={school}
															onSelect={(value) => field.onChange(value)}
															className="cursor-pointer"
														>
															<Check
																className={`mr-2 h-4 w-4 ${
																	school.toLowerCase() ===
																	(field.value ?? "").toLowerCase()
																		? "block"
																		: "hidden"
																}`}
															/>
															{school}
														</CommandItem>
													))}
												</CommandGroup>
											</PopoverClose>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>

							<FormDescription>
								If you are not currently a student, please select the most
								recent university you attended.
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
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<FormControl>
								<Input placeholder={c.localUniversitySchoolIDName} {...field} />
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
							className={`col-span-2 ${
								isLocalUniversitySelected
									? "md:col-span-2 lg:col-span-3"
									: "md:col-span-1 lg:col-span-2"
							} flex flex-col`}
						>
							<FormLabel>
								{formatRegistrationField(
									"Level of Study",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
								)}
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full placeholder:text-muted-foreground">
										<div
											className={clsx("flex w-[95%] justify-start", {
												"text-muted-foreground": !field.value,
											})}
										>
											<p className="overflow-hidden text-ellipsis whitespace-nowrap">
												{field.value || "Select an Option"}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup className="max-h-[400px] w-[calc(var(--radix-select-trigger-width)+10rem)] overflow-y-scroll">
										{c.registration.levelsOfStudy.map((level) => (
											<SelectItem value={level} key={level}>
												{level}
											</SelectItem>
										))}
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
							className={`col-span-2 ${
								isLocalUniversitySelected
									? "md:col-span-2 lg:col-span-3"
									: "md:col-span-1 lg:col-span-2"
							} flex flex-col`}
						>
							<FormLabel>
								{formatRegistrationField(
									"Major",
									hackerRegistrationFormValidator.shape[field.name].isOptional(),
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
												!field.value && "text-muted-foreground",
											)}
										>
											<p className="truncate whitespace-nowrap">
												{field.value
													? c.registration.majors.find(
															(major) => major === field.value,
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
										<CommandList>
											<CommandEmpty>No major found.</CommandEmpty>
											<PopoverClose asChild>
												<CommandGroup>
													{c.registration.majors.map((major) => (
														<CommandItem
															value={major}
															key={major}
															onSelect={(value) => field.onChange(value)}
															className="cursor-pointer"
														>
															<Check
																className={`mr-2 h-4 w-4 overflow-hidden ${
																	major.toLowerCase() ===
																	(field.value ?? "").toLowerCase()
																		? "block"
																		: "hidden"
																}`}
															/>
															{major}
														</CommandItem>
													))}
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
	);
}