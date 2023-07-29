import { z } from "zod";

export const BasicServerValidator = z.object({
	success: z.boolean(),
	message: z.string(),
	internalCode: z.string().optional(),
});
