"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useRouter } from "next/navigation";
import { createCompleteUserDataSchema } from "@hackkit/core";
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
const emptyDefaults = {
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
function createUserDataFormSchema(options) {
	return createCompleteUserDataSchema(options)
		.omit({ authId: true })
		.extend({
			countryOfResidence: z.preprocess(
				(value) => (value === "" ? undefined : value),
				createCompleteUserDataSchema(options).shape.countryOfResidence,
			),
		});
}
export function toUserDataFormDefaultValues(userData) {
	return {
		age: userData.age,
		gender: userData.gender,
		race: userData.race,
		ethnicity: userData.ethnicity,
		shirtSize: userData.shirtSize,
		dietaryRestrictions: userData.dietaryRestrictions,
		accommodationNote: userData.accommodationNote ?? "",
		phoneNumber: userData.phoneNumber ?? "",
		countryOfResidence: userData.countryOfResidence,
		hasAcceptedMLHCodeOfConduct: userData.hasAcceptedMLHCodeOfConduct,
		hasSharedDataWithMLH: userData.hasSharedDataWithMLH,
		isEmailable: userData.isEmailable,
	};
}
function FieldError({ message }) {
	if (!message) return null;
	return _jsx("p", {
		className: "text-sm font-medium text-destructive",
		children: message,
	});
}
function SelectField({
	label,
	placeholder,
	value,
	onValueChange,
	options,
	error,
}) {
	return _jsxs("div", {
		className: "space-y-2",
		children: [
			_jsx(Label, { children: label }),
			_jsxs(Select, {
				value: value,
				onValueChange: onValueChange,
				children: [
					_jsx(SelectTrigger, {
						children: _jsx(SelectValue, {
							placeholder: placeholder,
						}),
					}),
					_jsx(SelectContent, {
						children: options.map((option) =>
							_jsx(
								SelectItem,
								{ value: option.value, children: option.label },
								option.value,
							),
						),
					}),
				],
			}),
			_jsx(FieldError, { message: error }),
		],
	});
}
export function UserDataFields({ form, userDataOptions }) {
	const dietaryRestrictions = form.watch("dietaryRestrictions") ?? [];
	return _jsxs("div", {
		className: "space-y-6",
		children: [
			_jsxs("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					_jsxs("div", {
						className: "space-y-2",
						children: [
							_jsx(Label, { htmlFor: "age", children: "Age" }),
							_jsx(Input, {
								id: "age",
								type: "number",
								min: 0,
								...form.register("age", {
									valueAsNumber: true,
								}),
							}),
							_jsx(FieldError, {
								message: form.formState.errors.age?.message,
							}),
						],
					}),
					_jsx(SelectField, {
						label: "Gender",
						placeholder: "Select gender",
						value: form.watch("gender"),
						onValueChange: (value) =>
							form.setValue("gender", value, {
								shouldValidate: true,
							}),
						options: userDataOptions.gender,
						error: form.formState.errors.gender?.message,
					}),
					_jsx(SelectField, {
						label: "Race",
						placeholder: "Select race",
						value: form.watch("race"),
						onValueChange: (value) =>
							form.setValue("race", value, {
								shouldValidate: true,
							}),
						options: userDataOptions.race,
						error: form.formState.errors.race?.message,
					}),
					_jsx(SelectField, {
						label: "Ethnicity",
						placeholder: "Select ethnicity",
						value: form.watch("ethnicity"),
						onValueChange: (value) =>
							form.setValue("ethnicity", value, {
								shouldValidate: true,
							}),
						options: userDataOptions.ethnicity,
						error: form.formState.errors.ethnicity?.message,
					}),
					_jsx(SelectField, {
						label: "Shirt size",
						placeholder: "Select shirt size",
						value: form.watch("shirtSize"),
						onValueChange: (value) =>
							form.setValue("shirtSize", value, {
								shouldValidate: true,
							}),
						options: userDataOptions.shirtSize,
						error: form.formState.errors.shirtSize?.message,
					}),
					_jsx(SelectField, {
						label: "Country of residence",
						placeholder: "Select country",
						value: form.watch("countryOfResidence"),
						onValueChange: (value) =>
							form.setValue("countryOfResidence", value, {
								shouldValidate: true,
							}),
						options: userDataOptions.countryOfResidence,
						error: form.formState.errors.countryOfResidence
							?.message,
					}),
				],
			}),
			_jsxs("div", {
				className: "space-y-3",
				children: [
					_jsxs("div", {
						children: [
							_jsx(Label, { children: "Dietary restrictions" }),
							_jsx("p", {
								className: "text-sm text-muted-foreground",
								children:
									"Select all that apply. Use the accommodation note for details.",
							}),
						],
					}),
					_jsx("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: userDataOptions.dietaryRestrictions.map(
							(option) => {
								const checked = dietaryRestrictions.includes(
									option.value,
								);
								return _jsxs(
									"label",
									{
										className:
											"flex items-center gap-2 rounded-md border p-3 text-sm",
										children: [
											_jsx(Checkbox, {
												checked: checked,
												onCheckedChange: (next) => {
													const selected =
														next === true;
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
														{
															shouldValidate: true,
														},
													);
												},
											}),
											option.label,
										],
									},
									option.value,
								);
							},
						),
					}),
					_jsx(FieldError, {
						message:
							form.formState.errors.dietaryRestrictions?.message,
					}),
				],
			}),
			_jsxs("div", {
				className: "space-y-2",
				children: [
					_jsx(Label, {
						htmlFor: "accommodationNote",
						children: "Accommodation note",
					}),
					_jsx(Textarea, {
						id: "accommodationNote",
						placeholder:
							"Anything organizers should know about dietary, accessibility, or logistics needs.",
						...form.register("accommodationNote"),
					}),
					_jsx(FieldError, {
						message:
							form.formState.errors.accommodationNote?.message,
					}),
				],
			}),
			_jsx("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: _jsxs("div", {
					className: "space-y-2",
					children: [
						_jsx(Label, {
							htmlFor: "phoneNumber",
							children: "Phone number",
						}),
						_jsx(Input, {
							id: "phoneNumber",
							...form.register("phoneNumber"),
						}),
						_jsx(FieldError, {
							message: form.formState.errors.phoneNumber?.message,
						}),
					],
				}),
			}),
			_jsxs("div", {
				className: "space-y-3",
				children: [
					_jsxs("label", {
						className:
							"flex items-start gap-3 rounded-md border p-3 text-sm",
						children: [
							_jsx(Checkbox, {
								checked: form.watch(
									"hasAcceptedMLHCodeOfConduct",
								),
								onCheckedChange: (value) =>
									form.setValue(
										"hasAcceptedMLHCodeOfConduct",
										value === true,
										{ shouldValidate: true },
									),
							}),
							_jsx("span", {
								children:
									"I have read and agree to the MLH Code of Conduct.",
							}),
						],
					}),
					_jsx(FieldError, {
						message:
							form.formState.errors.hasAcceptedMLHCodeOfConduct
								?.message,
					}),
					_jsxs("label", {
						className:
							"flex items-start gap-3 rounded-md border p-3 text-sm",
						children: [
							_jsx(Checkbox, {
								checked: form.watch("hasSharedDataWithMLH"),
								onCheckedChange: (value) =>
									form.setValue(
										"hasSharedDataWithMLH",
										value === true,
										{ shouldValidate: true },
									),
							}),
							_jsx("span", {
								children:
									"I authorize sharing my registration information with MLH for event administration.",
							}),
						],
					}),
					_jsx(FieldError, {
						message:
							form.formState.errors.hasSharedDataWithMLH?.message,
					}),
					_jsxs("label", {
						className:
							"flex items-start gap-3 rounded-md border p-3 text-sm",
						children: [
							_jsx(Checkbox, {
								checked: form.watch("isEmailable"),
								onCheckedChange: (value) =>
									form.setValue(
										"isEmailable",
										value === true,
										{ shouldValidate: true },
									),
							}),
							_jsx("span", {
								children:
									"I agree to receive email updates about this hackathon.",
							}),
						],
					}),
					_jsx(FieldError, {
						message: form.formState.errors.isEmailable?.message,
					}),
				],
			}),
		],
	});
}
export function UserDataForm({
	currentUser,
	userDataOptions,
	defaultValues,
	successRedirectTo = "/dashboard",
	className,
}) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const schema = React.useMemo(
		() => createUserDataFormSchema(userDataOptions),
		[userDataOptions],
	);
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: { ...emptyDefaults, ...defaultValues },
	});
	async function onSubmit(values) {
		const result = await actions.completeUserData(values);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("User data saved.");
		router.push(successRedirectTo);
	}
	return _jsxs(Card, {
		className: cn("w-full max-w-3xl", className),
		children: [
			_jsxs(CardHeader, {
				children: [
					_jsx(CardTitle, { children: "User Data" }),
					_jsxs(CardDescription, {
						children: [
							"Completing registration as ",
							currentUser.firstName,
							" ",
							currentUser.lastName,
							" (",
							currentUser.email,
							").",
						],
					}),
				],
			}),
			_jsx(CardContent, {
				children: _jsxs("form", {
					className: "space-y-6",
					onSubmit: form.handleSubmit(onSubmit),
					children: [
						_jsx(UserDataFields, {
							form: form,
							userDataOptions: userDataOptions,
						}),
						_jsx(Button, {
							type: "submit",
							disabled: form.formState.isSubmitting,
							children: form.formState.isSubmitting
								? "Saving..."
								: "Save user data",
						}),
					],
				}),
			}),
		],
	});
}
//# sourceMappingURL=user-data-form.js.map
