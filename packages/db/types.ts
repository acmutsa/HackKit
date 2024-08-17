import { InferSelectModel } from "drizzle-orm";
import { userCommonData, userHackerData, teams, scans, events } from "./schema";

export interface Scan  extends InferSelectModel<typeof scans> {};
export interface User  extends InferSelectModel<typeof userCommonData> {};
export interface Event extends InferSelectModel<typeof events> {};

export interface Hacker extends User {
    hackerData: typeof userHackerData.$inferSelect & {
        team?: typeof teams.$inferSelect | null;
	};
}