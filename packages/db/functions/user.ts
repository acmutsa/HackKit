import { db, eq } from "..";
import { userCommonData, userHackerData } from "../schema";
import { HackerData, User } from "../types";

// const _getAllUsers = db.query.userCommonData.findMany().prepare("getAllUsers");

export function getAllUsers() {
	// return _getAllUsers.execute();
	return db.query.userCommonData.findMany();
}

export async function getAllUsersWithHackerData() {
	return db.query.userCommonData.findMany({
		with: {
			hackerData: true,
		},
	});
}

// ID

// const _getUser = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.clerkID, sql.placeholder("_clerkID")),
// 	})
// 	.prepare("getUser");

export function getUser(clerkID: string): Promise<User | undefined> {
	// return _getUser.execute({ _clerkID: clerkID });
	return db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, clerkID),
	});
}

export function getHackerData(
	clerkID: string,
): Promise<HackerData | undefined> {
	return db.query.userHackerData.findFirst({
		where: eq(userHackerData.clerkID, clerkID),
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
