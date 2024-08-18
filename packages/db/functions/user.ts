import { db, eq, sql } from "..";
import { userCommonData } from "../schema";
import { User } from "../types";

// ID

const _getUser = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
    }).prepare("getUser");

export function getUser(clerkID: string) : Promise<User | undefined> {
    return _getUser.execute({_clerkID: clerkID});
}

// Tag

const _getUserByTag = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.hackerTag, sql.placeholder('_hackerTag')),
    }).prepare("getUserByTag");

export function getUserByTag(hackerTag: string) : Promise<User | undefined> {
    return _getUserByTag.execute({_hackerTag: hackerTag});
}