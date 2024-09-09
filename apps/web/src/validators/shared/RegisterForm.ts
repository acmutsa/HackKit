import { z } from "zod";
import c from "config";
import { isProfane } from "no-profanity";

const defaultPrettyError = {
	errorMap: () => ({ message: "Please select a value" }),
};

const noProfanityValidator = (val: any) => !isProfane(val);
const noProfanityMessage = "Profanity is not allowed";

export const RegisterFormValidator = z.object({
	firstName: z
		.string()
		.min(1, { message: "Firstname must be at least one character" })
		.max(50, { message: "Firstname must be less than 50 characters" }),
	lastName: z
		.string()
		.min(1, { message: "Lastname must be at least 1 character" })
		.max(50, { message: "Lastname must be less than 50 characters" }),
	email: z
		.string()
		.email({
			message: "Email must be a valid email (eg: someone@example.com).",
		})
		.max(255, { message: "Email must be less than 255 characters." }),
	age: z
		.number()
		.min(18, { message: "You must be at least 18 years old to register." })
		.positive({ message: "Value must be positive" })
		.int({ message: "Value must be an integer" })
		.or(z.string())
		.pipe(
			z.coerce
				.number()
				.min(18, {
					message: "You must be at least 18 years old to register.",
				})
				.positive({ message: "Value must be positive" })
				.int({ message: "Value must be an integer" }),
		),
	gender: z.union([
		z.literal("MALE", defaultPrettyError),
		z.literal("FEMALE", defaultPrettyError),
		z.literal("NON-BINARY", defaultPrettyError),
		z.literal("OTHER", defaultPrettyError),
		z.literal("PREFERNOTSAY", defaultPrettyError),
	]),
	race: z.union([
		z.literal("Native American", defaultPrettyError),
		z.literal("Asian / Pacific Islander", defaultPrettyError),
		z.literal("Black or African American", defaultPrettyError),
		z.literal("White / Caucasion", defaultPrettyError),
		z.literal("Multiple / Other", defaultPrettyError),
		z.literal("Prefer not to say", defaultPrettyError),
	]),
	ethnicity: z.union([
		z.literal("Hispanic or Latino", defaultPrettyError),
		z.literal("Not Hispanic or Latino", defaultPrettyError),
	]),
	acceptsMLHCodeOfConduct: z.boolean().refine((val) => val === true, {
		message: "You must accept the MLH Code of Conduct.",
	}),
	shareDataWithMLH: z.boolean().refine((val) => val === true, {
		message:
			"You must accept the MLH Terms & Conditions and Privacy Policy.",
	}),
	wantsToReceiveMLHEmails: z.boolean(),
	university: z.string().min(1).max(200),
	major: z.string().min(1).max(200),
	shortID: z
		.string()
		.min(1)
		.max(c.localUniversityShortIDMaxLength, {
			message: `Short ID must be less than ${c.localUniversityShortIDMaxLength} characters.`,
		})
		.or(z.literal("NOT_LOCAL_SCHOOL")),
	levelOfStudy: z.union([
		z.literal("Freshman", defaultPrettyError),
		z.literal("Sophomore", defaultPrettyError),
		z.literal("Junior", defaultPrettyError),
		z.literal("Senior", defaultPrettyError),
		z.literal("Recent Grad", defaultPrettyError),
		z.literal("Other", defaultPrettyError),
	]),
	hackathonsAttended: z
		.number()
		.min(0, { message: "Value must be positive or zero" })
		.int({ message: "Value must be an integer" })
		.or(z.string())
		.pipe(
			z.coerce
				.number()
				.min(0, { message: "Value must be positive or zero" })
				.int({ message: "Value must be an integer" }),
		),
	softwareBuildingExperience: z.union([
		z.literal("Beginner", defaultPrettyError),
		z.literal("Intermediate", defaultPrettyError),
		z.literal("Advanced", defaultPrettyError),
		z.literal("Expert", defaultPrettyError),
	]),
	heardAboutEvent: z
		.union([
			z.literal("Instagram"),
			z.literal("Class Presentation"),
			z.literal("Twitter"),
			z.literal("Event Site"),
			z.literal("Friend"),
			z.literal("Other"),
		])
		.optional(),
	shirtSize: z.union([
		z.literal("S", defaultPrettyError),
		z.literal("M", defaultPrettyError),
		z.literal("L", defaultPrettyError),
		z.literal("XL", defaultPrettyError),
		z.literal("2XL", defaultPrettyError),
		z.literal("3XL", defaultPrettyError),
	]),
	dietaryRestrictions: z.array(z.string()),
	accommodationNote: z.string().optional(),
	github: z
		.string()
		.max(50, { message: "Username must be less than 50 characters" })
		.optional(),
	linkedin: z
		.string()
		.max(50, { message: "Username must be less than 50 characters" })
		.optional(),
	personalWebsite: z
		.string()
		.max(100, { message: "URL must be less than 100 characters" })
		.optional(),
	hackerTag: z
		.string()
		.min(3, {
			message: "Your HackerTag must be more than 3 characters long",
		})
		.max(20, {
			message: "Your HackerTag must be less than 20 characters long",
		})
		.regex(/^[a-zA-Z0-9]+$/, {
			message: "HackerTag must be alphanumeric and have no spaces",
		})
		.toLowerCase()
		.refine(noProfanityValidator, noProfanityMessage),
	profileDiscordName: z
		.string()
		.min(2, { message: "Please enter a valid Discord Username" })
		.max(50, { message: "Please enter a valid Discord Username" }),
	pronouns: z.string().min(1).max(15),
	bio: z
		.string()
		.min(1)
		.max(500, { message: "Bio must be less than 500 characters." })
		.refine(noProfanityValidator, noProfanityMessage),
	skills: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
		}),
	), // TODO: impliment a max length
	profileIsSearchable: z.boolean(),
});
