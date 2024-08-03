import { scans, userCommonData, events } from "db/schema";

export type DeArray<T> = T extends (infer R)[] ? R : T;
export type scansType = typeof scans.$inferSelect;
export type userType = typeof userCommonData.$inferSelect;
export type eventType = typeof events.$inferSelect;
