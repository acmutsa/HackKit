import { scans, users } from "db/schema";

export type DeArray<T> = T extends (infer R)[] ? R : T;
export type scansType = typeof scans.$inferSelect;
export type userType = typeof users.$inferSelect;
