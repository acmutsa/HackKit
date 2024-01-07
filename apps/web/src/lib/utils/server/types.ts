import { z, type ZodType } from "zod";
import type { NextResponse } from "next/server";
import { users, profileData, registrationData, teams } from "@/db/schema";

export type serverZodResponse<T extends ZodType<any, any, any>> = Promise<
	undefined | NextResponse<z.infer<T>> | NextResponse<"Unauthorized">
>;

type User = typeof users.$inferSelect;

export interface UserWithAllData extends User {
	profileData: typeof profileData.$inferSelect;
	registrationData: typeof registrationData.$inferSelect;
	team: typeof teams.$inferSelect | null;
}

export interface DefaultEmailTemplateProps {
	firstName: string;
}
