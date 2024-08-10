import { db, eq, sql } from ".";
import { userCommonData } from "./schema";
import { Hacker, User } from "./types";

const _getUser = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
    }).prepare("getUser");

export function getUser(clerkID: string) : Promise<User | undefined> {
    return _getUser.execute({_clerkID: clerkID});
}

const _getHacker = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
        with: { hackerData: { with: { team: true } } }
    }).prepare("getHacker");

export function getHacker(clerkID: string) : Promise<Hacker | undefined> {
    return _getHacker.execute({_clerkID: clerkID});
}