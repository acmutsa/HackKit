"use client";

import * as React from "react";
import {
	createCompleteUserDataSchema,
	type User,
	type UserDataOptions,
} from "@hackkit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useHackKitUI } from "../provider";
import type { UserDataFormValues } from "../types";
import { cn } from "../lib/cn";
import { usePersistedFormState } from "../lib/use-persisted-form-state";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export type { UserDataFormValues };

export type UserDataFormProps = {
	currentUser: User;
	userDataOptions: UserDataOptions;
	defaultValues?: Partial<UserDataFormValues> | null;
	localStorageKey?: string;
	successRedirectTo?: string;
	className?: string;
};

type FieldProps = {
	form: UseFormReturn<UserDataFormValues>;
	userDataOptions: UserDataOptions;
};

const emptyDefaults: UserDataFormValues = {
	age: 0,
	gender: "",
	race: "",
	ethnicity: "",
	shirtSize: "",
	dietaryRestrictions: [],
	accommodationNote: "",
	phoneNumber: "",
	countryOfResidence: undefined,
	hasAcceptedMLHCodeOfConduct: false,
	hasSharedDataWithMLH: false,
	isEmailable: false,
};

function createUserDataFormSchema(options: UserDataOptions) {
	return createCompleteUserDataSchema(options)
		.omit({ authId: true })
		.extend({
			countryOfResidence: z.preprocess(
				(value) => (value === "" ? undefined : value),
				createCompleteUserDataSchema(options).shape.countryOfResidence,
			),
		});
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-sm font-medium text-destructive">{message}</p>;
}

function SelectField({
	label,
	placeholder,
	value,
	onValueChange,
	options,
	error,
}: {
	label: string;
	placeholder: string;
	value?: string;
	onValueChange: (value: string) => void;
	options: readonly { value: string; label: string }[];
	error?: string;
}) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError message={error} />
		</div>
	);
}

export function UserDataFields({ form, userDataOptions }: FieldProps) {
	const dietaryRestrictions = form.watch("dietaryRestrictions") ?? [];

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="age">Age</Label>
					<Input
						id="age"
						type="number"
						min={0}
						{...form.register("age", { valueAsNumber: true })}
					/>
					<FieldError message={form.formState.errors.age?.message} />
				</div>

				<SelectField
					label="Gender"
					placeholder="Select gender"
					value={form.watch("gender")}
					onValueChange={(value) =>
						form.setValue("gender", value, { shouldValidate: true })
					}
					options={userDataOptions.gender}
					error={form.formState.errors.gender?.message}
				/>

				<SelectField
					label="Race"
					placeholder="Select race"
					value={form.watch("race")}
					onValueChange={(value) =>
						form.setValue("race", value, { shouldValidate: true })
					}
					options={userDataOptions.race}
					error={form.formState.errors.race?.message}
				/>

				<SelectField
					label="Ethnicity"
					placeholder="Select ethnicity"
					value={form.watch("ethnicity")}
					onValueChange={(value) =>
						form.setValue("ethnicity", value, {
							shouldValidate: true,
						})
					}
					options={userDataOptions.ethnicity}
					error={form.formState.errors.ethnicity?.message}
				/>

				<SelectField
					label="Shirt size"
					placeholder="Select shirt size"
					value={form.watch("shirtSize")}
					onValueChange={(value) =>
						form.setValue("shirtSize", value, {
							shouldValidate: true,
						})
					}
					options={userDataOptions.shirtSize}
					error={form.formState.errors.shirtSize?.message}
				/>

				<SelectField
					label="Country of residence"
					placeholder="Select country"
					value={form.watch("countryOfResidence")}
					onValueChange={(value) =>
						form.setValue("countryOfResidence", value, {
							shouldValidate: true,
						})
					}
					options={userDataOptions.countryOfResidence}
					error={form.formState.errors.countryOfResidence?.message}
				/>
			</div>

			<div className="space-y-3">
				<div>
					<Label>Dietary restrictions</Label>
					<p className="text-sm text-muted-foreground">
						Select all that apply. Use the accommodation note for
						details.
					</p>
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					{userDataOptions.dietaryRestrictions.map((option) => {
						const checked = dietaryRestrictions.includes(
							option.value,
						);
						return (
							<label
								key={option.value}
								className="flex items-center gap-2 rounded-md border p-3 text-sm"
							>
								<Checkbox
									checked={checked}
									onCheckedChange={(next) => {
										const selected = next === true;
										form.setValue(
											"dietaryRestrictions",
											selected
												? [
														...dietaryRestrictions,
														option.value,
													]
												: dietaryRestrictions.filter(
														(value) =>
															value !==
															option.value,
													),
											{ shouldValidate: true },
										);
									}}
								/>
								{option.label}
							</label>
						);
					})}
				</div>
				<FieldError
					message={form.formState.errors.dietaryRestrictions?.message}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="accommodationNote">Accommodation note</Label>
				<Textarea
					id="accommodationNote"
					placeholder="Anything organizers should know about dietary, accessibility, or logistics needs."
					{...form.register("accommodationNote")}
				/>
				<FieldError
					message={form.formState.errors.accommodationNote?.message}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="phoneNumber">Phone number</Label>
					<Input id="phoneNumber" {...form.register("phoneNumber")} />
					<FieldError
						message={form.formState.errors.phoneNumber?.message}
					/>
				</div>
			</div>

			<div className="space-y-3">
				<label className="flex items-start gap-3 rounded-md border p-3 text-sm">
					<Checkbox
						checked={form.watch("hasAcceptedMLHCodeOfConduct")}
						onCheckedChange={(value) =>
							form.setValue(
								"hasAcceptedMLHCodeOfConduct",
								value === true,
								{ shouldValidate: true },
							)
						}
					/>
					<span>
						I have read and agree to the MLH Code of Conduct.
					</span>
				</label>
				<FieldError
					message={
						form.formState.errors.hasAcceptedMLHCodeOfConduct
							?.message
					}
				/>

				<label className="flex items-start gap-3 rounded-md border p-3 text-sm">
					<Checkbox
						checked={form.watch("hasSharedDataWithMLH")}
						onCheckedChange={(value) =>
							form.setValue(
								"hasSharedDataWithMLH",
								value === true,
								{ shouldValidate: true },
							)
						}
					/>
					<span>
						I authorize sharing my registration information with MLH
						for event administration.
					</span>
				</label>
				<FieldError
					message={
						form.formState.errors.hasSharedDataWithMLH?.message
					}
				/>

				<label className="flex items-start gap-3 rounded-md border p-3 text-sm">
					<Checkbox
						checked={form.watch("isEmailable")}
						onCheckedChange={(value) =>
							form.setValue("isEmailable", value === true, {
								shouldValidate: true,
							})
						}
					/>
					<span>
						I agree to receive email updates about this hackathon.
					</span>
				</label>
				<FieldError
					message={form.formState.errors.isEmailable?.message}
				/>
			</div>
		</div>
	);
}

export function UserDataForm({
	currentUser,
	userDataOptions,
	defaultValues,
	localStorageKey,
	successRedirectTo,
	className,
}: UserDataFormProps) {
	const { actions, navigation } = useHackKitUI();
	const redirectTo = successRedirectTo ?? navigation.routes.dashboard;
	const schema = React.useMemo(
		() => createUserDataFormSchema(userDataOptions),
		[userDataOptions],
	);
	const form = useForm<UserDataFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { ...emptyDefaults, ...defaultValues },
	});
	const clearPersistedState = usePersistedFormState(form, localStorageKey);

	async function onSubmit(values: UserDataFormValues) {
		const result = await actions.completeUserData(values);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}

		clearPersistedState();
		toast.success("User data saved.");
		navigation.push(redirectTo);
	}

	return (
		<Card className={cn("w-full max-w-3xl", className)}>
			<CardHeader>
				<CardTitle>User Data</CardTitle>
				<CardDescription>
					Completing registration as {currentUser.firstName}{" "}
					{currentUser.lastName} ({currentUser.email}).
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<UserDataFields
						form={form}
						userDataOptions={userDataOptions}
					/>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting
							? "Saving..."
							: "Save user data"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
