import { db, eq, sql } from ".";
import { userCommonData } from "./schema";
import { User } from "./types";

const _getUser = db.query.userCommonData
    .findFirst({
        where: eq(userCommonData.clerkID, sql.placeholder('_clerkID')),
    }).prepare("getUser");

export function getUser(clerkID: string) : Promise<User | undefined>{
    return _getUser.execute({_clerkID: clerkID});
}