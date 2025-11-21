import { userCommonData, userHackerData } from "./schema.sqlite";
import { createInsertSchema } from "drizzle-zod";

export const userCommonDataInsertSchema = createInsertSchema(userCommonData);
export const userHackerDataInsertSchema = createInsertSchema(userHackerData);

export const userWithHackerDataInsertSchema = userCommonDataInsertSchema.merge(
	userHackerDataInsertSchema,
);
