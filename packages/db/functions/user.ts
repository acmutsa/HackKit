import { db, eq } from "..";
import {userCommonData, userHackerData} from "../schema";
import {Hacker, HackerData, User} from "../types";

// const _getAllUsers = db.query.userCommonData.findMany().prepare("getAllUsers");

export function getAllUsers(): Promise<User[] | undefined> {
	// return _getAllUsers.execute();
	return db.query.userCommonData.findMany();
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

export function getHackerData(clerkID: string): Promise<HackerData | undefined> {
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
