import { BasicServerValidator } from "./basic";
import { z } from "zod";

export const BasicRedirValidator = BasicServerValidator.merge(
	z.object({
		redirect: z.string(),
	}),
);
