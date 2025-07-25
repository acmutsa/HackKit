import { db, eq } from "..";
import { userCommonData } from "../schema";
import { Hacker } from "../types";

// const _getAllHackers = db.query.userCommonData
// 	.findMany({
// 		with: { hackerData: true },
// 	})
// 	.prepare("getAllHackers");

export function getAllHackers(): Promise<Hacker[] | undefined> {
	// return _getAllHackers.execute();
	return db.query.userCommonData.findMany({
		with: { hackerData: true },
	});
}

// ID

// const _getHackerByIDWithTeam = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.clerkID, sql.placeholder("_clerkID")),
// 		with: { hackerData: { with: { team: true } } },
// 	})
// 	.prepare("getHackerByIDWithTeam");

// const _getHackerByIDAlone = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.clerkID, sql.placeholder("_clerkID")),
// 		with: { hackerData: true },
// 	})
// 	.prepare("getHackerByID");

export function getHacker(
	clerkID: string,
	//withTeam: boolean,
): Promise<Hacker | undefined> {
	// return withTeam
	// 	? _getHackerByIDWithTeam.execute({ _clerkID: clerkID })
	// 	: _getHackerByIDAlone.execute({ _clerkID: clerkID });
	return db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, clerkID),
		with: { hackerData: true },
	});
}

// Tag

// const _getHackerByTagWithTeam = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.hackerTag, sql.placeholder("_hackerTag")),
// 		with: { hackerData: { with: { team: true } } },
// 	})
// 	.prepare("getHackerByTagWithTeam");

// const _getHackerByTagAlone = db.query.userCommonData
// 	.findFirst({
// 		where: eq(userCommonData.hackerTag, sql.placeholder("_hackerTag")),
// 		with: { hackerData: true },
// 	})
// 	.prepare("getHackerByTag");

export function getHackerByTag(
	hackerTag: string,
	//withTeam: boolean,
): Promise<Hacker | undefined> {
	// return withTeam
	// 	? _getHackerByTagWithTeam.execute({ _hackerTag: hackerTag })
	// 	: _getHackerByTagAlone.execute({ _hackerTag: hackerTag });
	return db.query.userCommonData.findFirst({
		where: eq(userCommonData.hackerTag, hackerTag),
		with: { hackerData: true },
	});
}
