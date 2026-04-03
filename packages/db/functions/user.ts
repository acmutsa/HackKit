import { db, eq } from "..";
import { userCommonData, userHackerData } from "../schema";
import { HackerData, User } from "../types";

// const _getAllUsers = db.query.userCommonData.findMany().prepare("getAllUsers");

export function getAllUsers() {
	// return _getAllUsers.execute();
	return db.query.userCommonData.findMany({
		with: {
			role: true,
		},
	});
}

export async function getAllUsersWithHackerData() {
	return db.query.userCommonData.findMany({
		with: {
			hackerData: true,
			role: true,
		},
	});
}

// ID

// const _getUser = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.clerkID, sql.placeholder("_clerkID")),
// 	})
// 	.prepare("getUser");

export function getUser(id: string) {
	// return _getUser.execute({ _clerkID: clerkID });
	return db.query.userCommonData.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
		with: {
			role: true,
		},
	});
}

export function getHackerData(
	id: string,
): Promise<HackerData | undefined> {
	return db.query.userHackerData.findFirst({
		where: eq(userHackerData.id, id),
	});
}

// Tag

// const _getUserByTag = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.hackerTag, sql.placeholder("_hackerTag")),
// 	})
// 	.prepare("getUserByTag");

export function getUserByTag(hackerTag: string): Promise<User | undefined> {
	// return _getUserByTag.execute({ _hackerTag: hackerTag });
	return db.query.userCommonData.findFirst({
		where: eq(userCommonData.hackerTag, hackerTag),
	});
}

export function updateUserResume(id: string, url: string) {
	return db
		.update(userHackerData)
		.set({
			resume: url,
		})
		.where(eq(userHackerData.id, id));
}
