import { z, type ZodType } from "zod";
import type { NextResponse } from "next/server";
import { profileData, registrationData, teams } from "db/schema";
import type { userType } from "@/lib/utils/shared/types";

export type serverZodResponse<T extends ZodType<any, any, any>> = Promise<
	undefined | NextResponse<z.infer<T>> | NextResponse<"Unauthorized">
>;

export interface UserWithAllData extends userType {
	profileData: typeof profileData.$inferSelect;
	registrationData: typeof registrationData.$inferSelect;
	team: typeof teams.$inferSelect | null;
}

export interface DefaultEmailTemplateProps {
	firstName: string;
}
