import { InferSelectModel } from "drizzle-orm";
//add "teams" to import in order to implement teams(removed for V1 release)
import { userCommonData, userHackerData, scans, events } from "./schema";

export interface Scan extends InferSelectModel<typeof scans> {}
export interface User extends InferSelectModel<typeof userCommonData> {}
export interface HackerData extends InferSelectModel<typeof userHackerData> {}
//export interface Team extends InferSelectModel<typeof teams> {}
export interface Event extends InferSelectModel<typeof events> {}

export interface Hacker extends User {
	hackerData: typeof userHackerData.$inferSelect & {};
}
export interface NoticeOrError {
	message: string | undefined;
	severity: string | undefined;
	code: string | undefined;
	detail: string | undefined;
	hint: string | undefined;
	position: string | undefined;
	internalPosition: string | undefined;
	internalQuery: string | undefined;
	where: string | undefined;
	schema: string | undefined;
	table: string | undefined;
	column: string | undefined;
	dataType: string | undefined;
	constraint: string | undefined;
	file: string | undefined;
	line: string | undefined;
	routine: string | undefined;
}
export type MessageName =
	| "parseComplete"
	| "bindComplete"
	| "closeComplete"
	| "noData"
	| "portalSuspended"
	| "replicationStart"
	| "emptyQuery"
	| "copyDone"
	| "copyData"
	| "rowDescription"
	| "parameterDescription"
	| "parameterStatus"
	| "backendKeyData"
	| "notification"
	| "readyForQuery"
	| "commandComplete"
	| "dataRow"
	| "copyInResponse"
	| "copyOutResponse"
	| "authenticationOk"
	| "authenticationMD5Password"
	| "authenticationCleartextPassword"
	| "authenticationSASL"
	| "authenticationSASLContinue"
	| "authenticationSASLFinal"
	| "error"
	| "notice";

export class DatabaseError extends Error implements NoticeOrError {
	public severity: string | undefined;
	public code: string | undefined;
	public detail: string | undefined;
	public hint: string | undefined;
	public position: string | undefined;
	public internalPosition: string | undefined;
	public internalQuery: string | undefined;
	public where: string | undefined;
	public schema: string | undefined;
	public table: string | undefined;
	public column: string | undefined;
	public dataType: string | undefined;
	public constraint: string | undefined;
	public file: string | undefined;
	public line: string | undefined;
	public routine: string | undefined;
	constructor(
		message: string,
		public readonly length: number,
		public readonly name: MessageName,
	) {
		super(message);
	}
	// This is a work around as the true DatabaeError class is not properly exported in Vercel Postgres.
	// Therefore, we create a mock up of the DatabaseError object sourced from: https://github.com/brianc/node-postgres/blob/8b2768f91d284ff6b97070aaf6602560addac852/packages/pg-protocol/src/messages.ts#L97
	// And override the instance function as it is technically not the true class object
	static [Symbol.hasInstance](instance: any) {
		return instance.constructor.name === "DatabaseError";
	}
}
