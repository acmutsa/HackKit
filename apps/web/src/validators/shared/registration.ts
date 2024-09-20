import z from "zod";
import { userWithHackerDataInsertSchema } from "db/zod";
import c from "config";
import { isProfane } from "no-profanity";
const defaultPrettyError = c.zod.defaultPrettyError;
const noProfanityValidator = (val: any) => !isProfane(val);
const noProfanityMessage = "Profanity is not allowed";

const countryList = Object.freeze(
	c.registration.countries.map((countryObject) => countryObject.code),
) as readonly [string, ...string[]];

export const hackerRegistrationFormValidator = z
	.object({
		...userWithHackerDataInsertSchema.shape,
		email: z.string().email({
			message: "Email must be a valid email (eg: me@example.com",
		}).max(255, {
			message: "Email must be less than 255 characters.",
		}
		),
		// Test if this has a max on it from the schema
		firstName: z.string().min(1).max(50, {
			message: "First name must be between 1 and 50 characters",
		}),
		lastName: z.string().min(1).max(50, {
			message: "Last name must be between 1 and 50 characters",
		}),
		age: z
			.number()
			.min(18, {
				message: "You must be at least 18 years old to register.",
			}).max(100, {
				message: "You must be less than 100 years old to register"
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
					.positive({ message: "Value must be positive" })
					.int({ message: "Value must be an integer" }),
			),
		gender: z.enum(c.registration.genderOptions, defaultPrettyError),
		race: z.enum(c.registration.raceOptions, defaultPrettyError),
		ethnicity: z.enum(c.registration.ethnicityOptions, defaultPrettyError),
		phoneNumber: z.string().min(10).max(30, {
			message: "Phone number must be between 10 and 30 characters",
		}),
		countryOfResidence: z.enum(countryList, defaultPrettyError),
		hasAcceptedMLHCoC: z.boolean().refine((val) => val === true, {
			message: "You must accept the MLH Code of Conduct.",
		}),
		hasSharedDataWithMLH: z.boolean().refine((val) => val === true, {
			message:
				"You must accept the MLH Terms & Conditions and Privacy Policy.",
		}),
		university: z.enum(c.registration.schools, defaultPrettyError),
		schoolID: z
			.string()
			.length(c.localUniversityShortIDMaxLength, {
				message: `${c.localUniversitySchoolIDName} must be than ${c.localUniversityShortIDMaxLength} characters.`,
			})
			.or(z.literal("NOT_LOCAL_SCHOOL")),
		softwareExperience: z.enum(c.registration.softwareExperienceOptions, defaultPrettyError),
		levelOfStudy: z.enum(c.registration.levelsOfStudy, defaultPrettyError),
		heardFrom: z.enum(c.registration.heardFromOptions, defaultPrettyError),
		shirtSize: z.enum(c.registration.shirtSizeOptions, defaultPrettyError),
		dietRestrictions: z.array(
			z.enum(
				c.registration.dietaryRestrictionOptions,
				defaultPrettyError,
			),
		),
		major:z.enum(c.registration.majors,defaultPrettyError),
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

		),
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
	});


