import z from "zod";
import { userWithHackerDataInsertSchema } from "db/zod";
import c from "config";
import { isProfane } from "no-profanity";

const defaultSelectPrettyError = c.zod.defaultSelectPrettyError;
const defaultInputPrettyError = c.zod.defaultInputPrettyError;
const noProfanityValidator = (val: any) => !isProfane(val);
const noProfanityMessage = "Profanity is not allowed";

const countryList = Object.freeze(
	c.registration.countries.map((countryObject) => countryObject.code),
) as readonly [string, ...string[]];

export const hackerRegistrationFormValidator = z
	.object({
		...userWithHackerDataInsertSchema.shape,
		// Test if this has a max on it from the schema
		firstName: z.string().min(1, defaultInputPrettyError).max(50, {
			message: "First name must be between 1 and 50 characters",
		}),
		lastName: z.string().min(1, defaultInputPrettyError).max(50, {
			message: "Last name must be between 1 and 50 characters",
		}),
		email: z
			.string()
			.email({
				message: "Email must be a valid email (eg: me@example.com",
			})
			.max(255, {
				message: "Email must be less than 255 characters.",
			}),
		age: z
			.number()
			.min(18, {
				message: "You must be at least 18 years old to register.",
			})
			.max(100, {
				message: "You must be less than 100 years old to register",
			})
			.positive({ message: "Value must be positive" })
			.int({ message: "Value must be an integer" })
			.or(z.string())
			.pipe(
				z.coerce
					.number()
					.min(18, {
						message:
							"You must be at least 18 years old to register.",
					})
					.max(100, {
						message:
							"You must be less than 100 years old to register",
					})
					.positive({ message: "Value must be positive" })
					.int({ message: "Value must be an integer" }),
			),
		gender: z.enum(c.registration.genderOptions, defaultSelectPrettyError),
		race: z.enum(c.registration.raceOptions, defaultSelectPrettyError),
		ethnicity: z.enum(
			c.registration.ethnicityOptions,
			defaultSelectPrettyError,
		),
		phoneNumber: z
			.string()
			.min(10)
			.max(30, {
				message: "Phone number must be between 10 and 30 characters",
			})
			.refine((val) => val.match(c.registration.phoneNumberRegex), {
				message: "Phone number must be a valid phone number",
			}),
		countryOfResidence: z.enum(countryList, defaultSelectPrettyError),
		hasAcceptedMLHCoC: z.boolean().refine((val) => val === true, {
			message: "You must accept the MLH Code of Conduct.",
		}),
		hasSharedDataWithMLH: z.boolean().refine((val) => val === true, {
			message:
				"You must accept the MLH Terms & Conditions and Privacy Policy.",
		}),
		university: z.enum(c.registration.schools, defaultSelectPrettyError),
		schoolID: z
			.string()
			.length(c.localUniversityShortIDMaxLength, {
				message: `${c.localUniversitySchoolIDName} must be than ${c.localUniversityShortIDMaxLength} characters.`,
			})
			.refine((val) => val.match(c.registration.universityShortIDRegex), {
				message: "School ID must be a valid school ID",
			})
			.or(z.literal("NOT_LOCAL_SCHOOL")),
		softwareExperience: z.enum(
			c.registration.softwareExperienceOptions,
			defaultSelectPrettyError,
		),
		levelOfStudy: z.enum(
			c.registration.levelsOfStudy,
			defaultSelectPrettyError,
		),
		hackathonsAttended: z
			.number()
			.min(0, { message: "Value must be positive or zero" })
			.max(200, { message: "Value must be less than 200" })
			.int({ message: "Value must be an integer" })
			.or(z.string())
			.pipe(
				z.coerce
					.number()
					.min(0, { message: "Value must be positive or zero" })
					.max(200, { message: "Value must be less than 200" })
					.int({ message: "Value must be an integer" }),
			),
		heardFrom: z.enum(
			c.registration.heardFromOptions,
			defaultSelectPrettyError,
		),
		shirtSize: z.enum(
			c.registration.shirtSizeOptions,
			defaultSelectPrettyError,
		),
		dietRestrictions: z
			.array(
				z.enum(
					c.registration.dietaryRestrictionOptions,
					defaultSelectPrettyError,
				),
			)
			.optional(),
		pronouns: z.string().min(1).max(20, {
			message: "Pronouns must be between 1 and 20 characters",
		}),
		major: z.enum(c.registration.majors, defaultSelectPrettyError),
		hackerTag: z
			.string()
			.min(3, {
				message: "Your HackerTag must be more than 3 characters long",
			})
			.max(20, {
				message: "Your HackerTag must be less than 20 characters long",
			})
			.regex(c.registration.hackerTagRegex, {
				message: "HackerTag must be alphanumeric and have no spaces",
			})
			.toLowerCase()
			.refine(noProfanityValidator, noProfanityMessage),
		bio: z
			.string()
			.min(1)
			.max(c.registration.maxBioSize, {
				message: `Bio must be less than ${c.registration.maxBioSize} characters.`,
			})
			.refine(noProfanityValidator, noProfanityMessage),
		skills: z
			.array(
				z.object({
					id: z.string(),
					text: z.string(),
				}),
			)
			.refine((val) => val.length <= c.registration.maxNumberOfSkills, {
				message: `You can only have up to ${c.registration.maxNumberOfSkills} skills`,
			}),
		accommodationNote: z
			.string()
			.max(c.registration.maxaccommodationNoteSize, {
				message: `Accommodation note must be less than ${c.registration.maxaccommodationNoteSize} characters.`,
			})
			.optional(),
	})
	.omit({
		clerkID: true,
		isFullyRegistered: true,
		signupTime: true,
		role: true,
		isRSVPed: true,
		isApproved: true,
		group: true,
		points: true,
		profilePhoto: true,
	});
