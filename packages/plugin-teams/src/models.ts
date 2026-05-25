import { defineModel, field } from "@hackkit/core";

export const teamsModels = {
	team: defineModel("teams.team", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			name: field.string(),
			tag: field.string().unique(),
			ownerAuthId: field
				.string()
				.references("core.user", "authId", { onDelete: "cascade" }),
			createdAt: field.date().defaultNow(),
		},
		indexes: [["tag"], ["ownerAuthId"]],
	}),
	member: defineModel("teams.member", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			teamId: field
				.string()
				.references("teams.team", "id", { onDelete: "cascade" }),
			authId: field
				.string()
				.unique()
				.references("core.user", "authId", { onDelete: "cascade" }),
			joinedAt: field.date().defaultNow(),
		},
		indexes: [["teamId"], ["authId"]],
	}),
	invite: defineModel("teams.invite", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			teamId: field
				.string()
				.references("teams.team", "id", { onDelete: "cascade" }),
			inviteeAuthId: field
				.string()
				.references("core.user", "authId", { onDelete: "cascade" }),
			status: field
				.enum(["pending", "accepted", "declined"] as const)
				.default("pending"),
			createdAt: field.date().defaultNow(),
		},
		indexes: [["teamId"], ["inviteeAuthId"], ["teamId", "inviteeAuthId"]],
	}),
} as const;

export type Team = import("@hackkit/core").InferSelect<typeof teamsModels.team>;
export type TeamMember = import("@hackkit/core").InferSelect<
	typeof teamsModels.member
>;
export type TeamInvite = import("@hackkit/core").InferSelect<
	typeof teamsModels.invite
>;
