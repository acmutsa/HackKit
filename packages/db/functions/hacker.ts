import { db, eq, sql } from "..";
import { userCommonData } from "../schema";
import { Hacker } from "../types";


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