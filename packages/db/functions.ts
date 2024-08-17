import { db, eq, sql } from ".";
import { userCommonData } from "./schema";
import { Hacker, User } from "./types";

// USER

const _getUser = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
    }).prepare("getUser");

export function getUser(clerkID: string) : Promise<User | undefined> {
    return _getUser.execute({_clerkID: clerkID});
}

// HACKER

const _getHackerWithTeam = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
        with: { hackerData: { with: { team: true } } }
    }).prepare("getHackerWithTeam");

const _getHackerAlone = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
        with: { hackerData: true }
    }).prepare("getHacker");

export function getHacker(clerkID: string, withTeam: boolean) : Promise<Hacker | undefined> {
    return (withTeam) ? _getHackerWithTeam.execute({_clerkID: clerkID}) : _getHackerAlone.execute({_clerkID: clerkID});
}