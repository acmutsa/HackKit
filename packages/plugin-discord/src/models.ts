import { defineModel, field } from "@hackkit/core";

export const discordModels = {
	verification: defineModel("discord.verification", {
		fields: {
			code: field.string().primaryKey(),
			discordUserId: field.string(),
			guildId: field.string(),
			username: field.string(),
			avatarHash: field.string().optional(),
			authId: field
				.string()
				.optional()
				.references("core.user", "authId", { onDelete: "setNull" }),
			status: field
				.enum(["pending", "accepted", "rejected", "expired"] as const)
				.default("pending"),
			expiresAt: field.date(),
			createdAt: field.date().defaultNow(),
			acceptedAt: field.date().optional(),
		},
		indexes: [["discordUserId"], ["guildId"], ["authId"], ["status"], ["createdAt"]],
	}),
	member: defineModel("discord.member", {
		fields: {
			authId: field
				.string()
				.primaryKey()
				.references("core.user", "authId", { onDelete: "cascade" }),
			discordUserId: field.string().unique(),
			guildId: field.string(),
			username: field.string(),
			avatarHash: field.string().optional(),
			verifiedAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
			lastRoleSyncAt: field.date().optional(),
		},
		indexes: [["discordUserId"], ["guildId"], ["updatedAt"]],
	}),
	roleSyncAttempt: defineModel("discord.roleSyncAttempt", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			authId: field
				.string()
				.references("core.user", "authId", { onDelete: "cascade" }),
			discordUserId: field.string(),
			guildId: field.string(),
			status: field.enum(["synced", "failed", "skipped"] as const),
			roleIds: field.json<string[]>().default([]),
			roleNames: field.json<string[]>().default([]),
			error: field.string().optional(),
			createdAt: field.date().defaultNow(),
		},
		indexes: [["authId"], ["discordUserId"], ["status"], ["createdAt"]],
	}),
} as const;

export type DiscordVerification = import("@hackkit/core").InferSelect<
	typeof discordModels.verification
>;
export type DiscordMember = import("@hackkit/core").InferSelect<
	typeof discordModels.member
>;
export type DiscordRoleSyncAttempt = import("@hackkit/core").InferSelect<
	typeof discordModels.roleSyncAttempt
>;
