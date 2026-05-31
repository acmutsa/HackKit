export const TeamsSetting = {
	MaximumTeamSize: "teams.maximumTeamSize",
} as const;

export type TeamsSetting = (typeof TeamsSetting)[keyof typeof TeamsSetting];
