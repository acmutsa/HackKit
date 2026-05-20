import { ZodError } from "zod";

export const hackKitErrorCodes = [
	"VALIDATION_ERROR",
	"NOT_FOUND",
	"CONFLICT",
	"FORBIDDEN",
	"UNAUTHORIZED",
	"INVALID_OPERATION",
] as const;

export type HackKitErrorCode = (typeof hackKitErrorCodes)[number];

export class HackKitError extends Error {
	readonly code: HackKitErrorCode;
	readonly cause?: unknown;
	readonly details?: unknown;

	constructor(
		code: HackKitErrorCode,
		message: string,
		options?: { cause?: unknown; details?: unknown },
	) {
		super(message);
		this.name = "HackKitError";
		this.code = code;
		this.cause = options?.cause;
		this.details = options?.details;
	}

	static fromZod(error: ZodError): HackKitError {
		return new HackKitError("VALIDATION_ERROR", "Invalid HackKit input.", {
			cause: error,
			details: error.flatten(),
		});
	}
}

export function parseInput<T>(
	schema: { parse(input: unknown): T },
	input: unknown,
): T {
	try {
		return schema.parse(input);
	} catch (error) {
		if (error instanceof ZodError) throw HackKitError.fromZod(error);
		throw error;
	}
}
