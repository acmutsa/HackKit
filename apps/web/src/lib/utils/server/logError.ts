import { db } from "db";
import { errorLog } from "db/schema";
import { nanoid } from "nanoid";

interface LogErrorParams {
	error: unknown;
	userID?: string;
	route: string;
}

export async function logError({ error, userID, route }: LogErrorParams) {
	if (error instanceof Error) {
		const errorID = nanoid();
		await db.insert(errorLog).values({
			id: errorID,
			message: error.message,
			userID: userID || null,
			route,
		});
		return errorID;
	} else {
		throw new Error("Error must be an instance of Error");
	}
}
