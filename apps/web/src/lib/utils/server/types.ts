import { z, type ZodType } from "zod";
import type { NextResponse } from "next/server";

export type serverZodResponse<T extends ZodType<any, any, any>> = Promise<
	undefined | NextResponse<z.infer<T>> | NextResponse<"Unauthorized">
>;

export interface DefaultEmailTemplateProps {
	firstName: string;
}
