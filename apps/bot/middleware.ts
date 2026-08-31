import { Request, Response, NextFunction } from "express";

export function sharedSecretMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const expected = process.env.SHARED_SECRET;
	if (!expected) {
		console.error("SHARED_SECRET not configured");
		process.exit(1);
		return next();
	}

	const provided = (req.header("X-Shared-Secret") as string) || "";
	if (!provided || provided !== expected) {
		res.status(401).json({
			success: false,
			error: "invalid_shared_secret",
		});
		return;
	}

	return next();
}

export default sharedSecretMiddleware;
