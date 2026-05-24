import { z } from "zod";
import { HackKitError } from "./errors.js";

export type UserDataOption = {
	value: string;
	label: string;
};

export type UserDataOptions = {
	gender: readonly UserDataOption[];
	race: readonly UserDataOption[];
	ethnicity: readonly UserDataOption[];
	shirtSize: readonly UserDataOption[];
	dietaryRestrictions: readonly UserDataOption[];
	countryOfResidence: readonly UserDataOption[];
};

export type UserDataOptionsInput = Partial<UserDataOptions>;

export const defaultUserDataOptions: UserDataOptions = {
	gender: [
		{ value: "woman", label: "Woman" },
		{ value: "man", label: "Man" },
		{ value: "non_binary", label: "Non-binary" },
		{ value: "prefer_not_to_answer", label: "Prefer not to answer" },
		{ value: "self_describe", label: "Prefer to self-describe" },
	],
	race: [
		{
			value: "american_indian_or_alaska_native",
			label: "American Indian or Alaska Native",
		},
		{ value: "asian", label: "Asian" },
		{
			value: "black_or_african_american",
			label: "Black or African American",
		},
		{
			value: "native_hawaiian_or_pacific_islander",
			label: "Native Hawaiian or Pacific Islander",
		},
		{ value: "white", label: "White" },
		{ value: "two_or_more", label: "Two or more races" },
		{ value: "prefer_not_to_answer", label: "Prefer not to answer" },
		{ value: "self_describe", label: "Prefer to self-describe" },
	],
	ethnicity: [
		{ value: "hispanic_or_latino", label: "Hispanic or Latino" },
		{ value: "not_hispanic_or_latino", label: "Not Hispanic or Latino" },
		{ value: "prefer_not_to_answer", label: "Prefer not to answer" },
	],
	shirtSize: [
		{ value: "xs", label: "XS" },
		{ value: "s", label: "S" },
		{ value: "m", label: "M" },
		{ value: "l", label: "L" },
		{ value: "xl", label: "XL" },
		{ value: "2xl", label: "2XL" },
		{ value: "3xl", label: "3XL" },
	],
	dietaryRestrictions: [
		{ value: "none", label: "No dietary restrictions" },
		{ value: "vegetarian", label: "Vegetarian" },
		{ value: "vegan", label: "Vegan" },
		{ value: "gluten_free", label: "Gluten-free" },
		{ value: "halal", label: "Halal" },
		{ value: "kosher", label: "Kosher" },
		{ value: "nut_allergy", label: "Nut allergy" },
		{ value: "other", label: "Other" },
	],
	countryOfResidence: [
		{ value: "us", label: "United States" },
		{ value: "ca", label: "Canada" },
		{ value: "mx", label: "Mexico" },
		{ value: "gb", label: "United Kingdom" },
		{ value: "other", label: "Other" },
	],
};

const userDataOptionSchema = z.object({
	value: z.string().min(1),
	label: z.string().min(1),
});

const userDataOptionsSchema = z.object({
	gender: z.array(userDataOptionSchema).min(1),
	race: z.array(userDataOptionSchema).min(1),
	ethnicity: z.array(userDataOptionSchema).min(1),
	shirtSize: z.array(userDataOptionSchema).min(1),
	dietaryRestrictions: z.array(userDataOptionSchema).min(1),
	countryOfResidence: z.array(userDataOptionSchema).min(1),
});

function assertUniqueValues(
	name: keyof UserDataOptions,
	options: readonly UserDataOption[],
): void {
	const seen = new Set<string>();
	for (const option of options) {
		if (seen.has(option.value)) {
			throw new HackKitError(
				"INVALID_OPERATION",
				`User Data Options for '${name}' contain duplicate value '${option.value}'.`,
			);
		}
		seen.add(option.value);
	}
}

export function resolveUserDataOptions(
	input: UserDataOptionsInput = {},
): UserDataOptions {
	const merged = { ...defaultUserDataOptions, ...input };
	const parsed = userDataOptionsSchema.safeParse(merged);

	if (!parsed.success) {
		throw HackKitError.fromZod(parsed.error);
	}

	for (const [name, options] of Object.entries(parsed.data) as [
		keyof UserDataOptions,
		UserDataOption[],
	][]) {
		assertUniqueValues(name, options);
	}

	return parsed.data;
}

function optionValueSchema(
	options: readonly UserDataOption[],
	message: string,
) {
	const values = new Set(options.map((option) => option.value));
	return z
		.string()
		.min(1)
		.refine((value) => values.has(value), { message });
}

export function createCompleteUserDataSchema(options: UserDataOptions) {
	const dietaryValues = new Set(
		options.dietaryRestrictions.map((option) => option.value),
	);

	return z.object({
		authId: z.string().min(1),
		age: z.number().int().nonnegative(),
		gender: optionValueSchema(options.gender, "Select a valid gender."),
		race: optionValueSchema(options.race, "Select a valid race."),
		ethnicity: optionValueSchema(
			options.ethnicity,
			"Select a valid ethnicity.",
		),
		shirtSize: optionValueSchema(
			options.shirtSize,
			"Select a valid shirt size.",
		),
		dietaryRestrictions: z
			.array(
				z
					.string()
					.refine((value) => dietaryValues.has(value), {
						message: "Select a valid dietary restriction.",
					}),
			)
			.default([]),
		accommodationNote: z.string().optional(),
		phoneNumber: z.string().optional(),
		countryOfResidence: optionValueSchema(
			options.countryOfResidence,
			"Select a valid country of residence.",
		).optional(),
		hasAcceptedMLHCodeOfConduct: z.boolean(),
		hasSharedDataWithMLH: z.boolean(),
		isEmailable: z.boolean(),
	});
}
