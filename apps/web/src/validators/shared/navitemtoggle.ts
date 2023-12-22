import { z } from "zod";

export const navItemToggleSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1),
	enabled: z.boolean(),
});

export type NavItemToggleType = z.infer<typeof navItemToggleSchema>;
