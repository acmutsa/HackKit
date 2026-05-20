import { z } from "zod";
import {
	createCompleteUserDataSchema,
	defaultUserDataOptions,
} from "./user-data-options";

export const permissionKeySchema = z
	.string()
	.regex(/^[a-z0-9_-]+\.[a-z0-9_.-]+$/);
export const authIdSchema = z.string().min(1);
export const roleIdSchema = z.string().min(1);
export const hackTagSchema = z
	.string()
	.min(1)
	.max(50)
	.regex(/^[a-zA-Z0-9_-]+$/)
	.transform((value) => value.toLowerCase());

export const ensureUserSchema = z.object({
	authId: authIdSchema,
	email: z.string().email(),
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	profilePhotoUrl: z.string().url().optional(),
});

export const claimHackTagSchema = z.object({
	authId: authIdSchema,
	hackTag: hackTagSchema,
});

export const completeUserDataSchema = createCompleteUserDataSchema(
	defaultUserDataOptions,
);
export type CompleteUserDataInput = z.input<typeof completeUserDataSchema>;

export const registerHackerSchema = z.object({
	authId: authIdSchema,
	university: z.string().min(1),
	major: z.string().min(1),
	schoolId: z.string().optional(),
	levelOfStudy: z.string().min(1),
	hackathonsAttended: z.number().int().nonnegative(),
	softwareExperience: z.string().min(1),
	heardFrom: z.string().optional(),
	githubUrl: z.string().url().optional(),
	linkedInUrl: z.string().url().optional(),
	personalWebsiteUrl: z.string().url().optional(),
	resumeUrl: z.string().url().optional(),
	group: z.string().optional(),
});

export const actorSchema = z.object({ actorAuthId: authIdSchema });

export const createRoleSchema = actorSchema.extend({
	id: roleIdSchema.optional(),
	name: z.string().min(1).max(50),
	position: z.number().int().nonnegative(),
	permissions: z.array(permissionKeySchema),
	color: z.string().optional(),
});

export const updateRoleSchema = actorSchema.extend({
	roleId: roleIdSchema,
	name: z.string().min(1).max(50).optional(),
	position: z.number().int().nonnegative().optional(),
	permissions: z.array(permissionKeySchema).optional(),
	color: z.string().optional(),
});

export const deleteRoleSchema = actorSchema.extend({ roleId: roleIdSchema });
export const assignRoleSchema = actorSchema.extend({
	targetAuthId: authIdSchema,
	roleId: roleIdSchema,
});
export const bootstrapOwnerSchema = z.object({ authId: authIdSchema });
export const approveUserSchema = actorSchema.extend({
	targetAuthId: authIdSchema,
	approved: z.boolean(),
});
export const banUserSchema = actorSchema.extend({
	targetAuthId: authIdSchema,
	reason: z.string().optional(),
});
export const unbanUserSchema = actorSchema.extend({
	targetAuthId: authIdSchema,
});
