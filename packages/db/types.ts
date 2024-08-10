import { userCommonData, userHackerData, teams, scans, events } from "./schema";

export type Scan = typeof scans.$inferSelect;
export type User = typeof userCommonData.$inferSelect;
export type Event = typeof events.$inferSelect;

export interface Hacker extends User {
	hackerData: typeof userHackerData.$inferSelect & {
		team: typeof teams.$inferSelect | null;
	};
}