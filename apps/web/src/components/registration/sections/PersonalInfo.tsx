"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/shadcn/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectGroup,
} from "@/components/shadcn/ui/select";
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
import { Button } from "@/components/shadcn/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
import c from "config";
import { cn } from "@/lib/utils/client/cn";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";
import { capitalizeFirstLetter } from "@/lib/utils/client/shared";
import type { SectionProps } from "../RegisterForm";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function PersonalInfo(_: SectionProps) {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="Personal Info">
			<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
				<FormField
					control={form.control}
					name="race"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Race",
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
												{field.value ||
													`Select a ${capitalizeFirstLetter(field.name)}`}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup className="max-h-[400px] w-[var(--radix-select-trigger-width)] overflow-y-scroll">
										{c.registration.raceOptions.map((option) => (
											<SelectItem value={option} key={option}>
												{option}
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
					name="ethnicity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{formatRegistrationField(
									"Ethnicity",
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
												{field.value ||
													`Select a ${capitalizeFirstLetter(field.name)}`}
											</p>
										</div>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{c.registration.ethnicityOptions.map((option) => (
											<SelectItem value={option} key={option}>
												{option}
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
					name="countryOfResidence"
					render={({ field }) => (
						<FormItem className="md:col-span-2">
							<FormLabel>
								{formatRegistrationField(
									"Country of Residence",
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
													? c.registration.countries.find(
															(selectedCountry) =>
																selectedCountry.code === field.value,
														)?.name
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
											<CommandEmpty>No country found.</CommandEmpty>
											<PopoverClose asChild>
												<CommandGroup>
													{c.registration.countries.map((country) => (
														<CommandItem
															value={country.name}
															key={country.name}
															onSelect={() => {
																const countryResult =
																	c.registration.countries.find(
																		(countryObject) =>
																			countryObject.name === country.name,
																	);
																field.onChange(countryResult?.code ?? "00");
															}}
															className="cursor-pointer"
														>
															<Check
																className={`mr-2 h-4 w-4 ${
																	country.name.toLowerCase() ===
																	field.value?.toLowerCase()
																		? "block"
																		: "hidden"
																}`}
															/>
															{country.name}
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