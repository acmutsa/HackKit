export const PARTICIPANT_ANALYTICS_SECTIONS = [
	"overview",
	"education",
	"demographics",
	"experience",
	"logistics",
	"acquisition",
	"skills",
] as const;

export type ParticipantAnalyticsSection =
	(typeof PARTICIPANT_ANALYTICS_SECTIONS)[number];
